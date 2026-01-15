import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import multer from 'multer';
import pdfParse from 'pdf-parse';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'text/plain', 'text/markdown'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, TXT, and MD files are allowed'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// In-memory storage (replace with database in production)
let quizzes = new Map();
let quizCounter = 1;

// ============= AI GENERATION ENDPOINTS =============

/**
 * Extract text from uploaded document (PDF, TXT, or MD)
 * Helper function
 */
async function extractTextFromDocument(file) {
  if (file.mimetype === 'application/pdf') {
    const data = await pdfParse(file.buffer);
    return data.text;
  } else if (file.mimetype === 'text/plain' || file.mimetype === 'text/markdown') {
    return file.buffer.toString('utf-8');
  }
  throw new Error('Unsupported file type');
}

/**
 * Generate quiz from uploaded document
 * POST /api/generate-quiz-from-document
 * FormData: { file: File, numQuestions: number }
 */
app.post('/api/generate-quiz-from-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const numQuestions = parseInt(req.body.numQuestions) || 5;

    // Extract text from document
    let documentText = '';
    try {
      documentText = await extractTextFromDocument(req.file);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to extract text from document: ' + error.message });
    }

    if (documentText.length === 0) {
      return res.status(400).json({ error: 'Document appears to be empty' });
    }

    // Limit text to avoid token limits
    const maxChars = 8000;
    const limitedText = documentText.substring(0, maxChars);

    const openaiKey = process.env.GROQ_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `Based on the following document content, generate ${numQuestions} multiple choice quiz questions.

DOCUMENT CONTENT:
---
${limitedText}
---

Generate quiz questions in this JSON format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": "Correct answer text"
  }
]

Requirements:
- Questions must be based on the document content
- Each question should have exactly 4 options
- The "correct" field should match one of the options exactly
- Return ONLY valid JSON, no other text`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a quiz generator. Generate quiz questions based on document content. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    let questions;
    
    try {
      questions = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    res.json({ 
      success: true,
      questions: questions.slice(0, numQuestions),
      documentName: req.file.originalname,
      charactersAnalyzed: limitedText.length
    });

  } catch (error) {
    console.error('Document Analysis Error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to generate quiz from document'
    });
  }
});

/**
 * Generate flashcards from uploaded document
 * POST /api/generate-cards-from-document
 * FormData: { file: File, count: number }
 */
app.post('/api/generate-cards-from-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const count = parseInt(req.body.count) || 10;

    // Extract text from document
    let documentText = '';
    try {
      documentText = await extractTextFromDocument(req.file);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to extract text from document: ' + error.message });
    }

    if (documentText.length === 0) {
      return res.status(400).json({ error: 'Document appears to be empty' });
    }

    const maxChars = 8000;
    const limitedText = documentText.substring(0, maxChars);

    const openaiKey = process.env.GROQ_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `Based on the following document content, generate ${count} flashcard question-answer pairs.

DOCUMENT CONTENT:
---
${limitedText}
---

Generate flashcards in this JSON format:
[
  {
    "question": "Question or prompt",
    "answer": "Answer or explanation"
  }
]

Requirements:
- Questions and answers should be based on the document content
- Answers should be detailed but concise
- Return ONLY valid JSON, no other text`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a flashcard generator. Generate flashcards based on document content. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    let cards;
    
    try {
      cards = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cards = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    res.json({ 
      success: true,
      cards: cards.slice(0, count),
      documentName: req.file.originalname,
      charactersAnalyzed: limitedText.length
    });

  } catch (error) {
    console.error('Card Generation Error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to generate cards from document'
    });
  }
});

/**
 * Generate quiz questions using OpenAI API (topic-based)
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { topic, numQuestions = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const openaiKey = process.env.GROQ_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `Generate ${numQuestions} multiple choice quiz questions about "${topic}". 
    
Format your response as a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": "Correct answer text"
  }
]

Return ONLY valid JSON, no other text.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful quiz generator. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    let questions;
    
    try {
      questions = JSON.parse(content);
    } catch (e) {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    res.json({ 
      success: true,
      questions: questions.slice(0, numQuestions)
    });

  } catch (error) {
    console.error('AI Generation Error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to generate quiz questions'
    });
  }
});

/**
 * Generate flashcards using OpenAI API
 * POST /api/generate-cards
 * Body: { topic: string, count: number }
 */
app.post('/api/generate-cards', async (req, res) => {
  try {
    const { topic, count = 10 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const openaiKey = process.env.GROQ_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `Generate ${count} flashcard question-answer pairs about "${topic}".
    
Format your response as a JSON array with this structure:
[
  {
    "question": "Question or prompt",
    "answer": "Answer or explanation"
  }
]

Return ONLY valid JSON, no other text.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful flashcard generator. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    let cards;
    
    try {
      cards = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cards = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    res.json({ 
      success: true,
      cards: cards.slice(0, count)
    });

  } catch (error) {
    console.error('Card Generation Error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to generate flashcards'
    });
  }
});

// ============= QUIZ MANAGEMENT ENDPOINTS =============

/**
 * Create a new quiz
 * POST /api/quizzes
 * Body: { title: string, questions: array }
 */
app.post('/api/quizzes', (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Title and questions are required' });
    }

    const quizId = String(quizCounter++);
    const quiz = {
      quizId,
      title,
      questions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    quizzes.set(quizId, quiz);

    res.status(201).json({
      success: true,
      quizId,
      message: 'Quiz created successfully'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a quiz by ID
 * GET /api/quizzes/:quizId
 */
app.get('/api/quizzes/:quizId', (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = quizzes.get(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      success: true,
      quiz: {
        quizId: quiz.quizId,
        title: quiz.title,
        createdAt: quiz.createdAt
      },
      questions: quiz.questions
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a quiz
 * PUT /api/quizzes/:quizId
 * Body: { title: string, questions: array }
 */
app.put('/api/quizzes/:quizId', (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, questions } = req.body;

    const quiz = quizzes.get(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (title) quiz.title = title;
    if (questions) quiz.questions = questions;
    quiz.updatedAt = new Date().toISOString();

    quizzes.set(quizId, quiz);

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      quizId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a quiz
 * DELETE /api/quizzes/:quizId
 */
app.delete('/api/quizzes/:quizId', (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizzes.has(quizId)) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    quizzes.delete(quizId);

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * List all quizzes
 * GET /api/quizzes
 */
app.get('/api/quizzes', (req, res) => {
  try {
    const quizList = Array.from(quizzes.values()).map(quiz => ({
      quizId: quiz.quizId,
      title: quiz.title,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    }));

    res.json({
      success: true,
      quizzes: quizList
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= HEALTH CHECK =============

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Flashcard Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      generateQuiz: 'POST /api/generate-quiz',
      generateCards: 'POST /api/generate-cards',
      createQuiz: 'POST /api/quizzes',
      getQuiz: 'GET /api/quizzes/:quizId',
      updateQuiz: 'PUT /api/quizzes/:quizId',
      deleteQuiz: 'DELETE /api/quizzes/:quizId',
      listQuizzes: 'GET /api/quizzes'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Flashcard Backend running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}`);
});
