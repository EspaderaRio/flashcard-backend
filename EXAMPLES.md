# Document Analysis Examples

## Using cURL to Test Backend

### Test Document-Based Quiz Generation

```bash
# Generate quiz from a PDF file
curl -X POST http://localhost:5000/api/generate-quiz-from-document \
  -F "file=@path/to/your/document.pdf" \
  -F "numQuestions=5"

# Response:
{
  "success": true,
  "questions": [
    {
      "question": "What is photosynthesis?",
      "options": [
        "Process of converting sunlight to energy",
        "Breakdown of glucose",
        "Cellular respiration",
        "DNA replication"
      ],
      "correct": "Process of converting sunlight to energy"
    }
  ],
  "documentName": "biology.pdf",
  "charactersAnalyzed": 8000
}
```

### Test Document-Based Flashcard Generation

```bash
# Generate flashcards from a document
curl -X POST http://localhost:5000/api/generate-cards-from-document \
  -F "file=@path/to/document.pdf" \
  -F "count=10"

# Response:
{
  "success": true,
  "cards": [
    {
      "question": "Define photosynthesis",
      "answer": "The process by which plants convert light energy into chemical energy stored in glucose..."
    },
    {
      "question": "What are the two main stages of photosynthesis?",
      "answer": "Light-dependent reactions and light-independent reactions (Calvin cycle)..."
    }
  ],
  "documentName": "biology.pdf",
  "charactersAnalyzed": 8000
}
```

## JavaScript Examples

### Frontend Usage

```javascript
// Set backend URL
setBackendUrl('http://localhost:5000');

// Get backend URL
const url = getBackendUrl();
console.log(url); // http://localhost:5000

// Generate quiz from document
async function generateQuizFromDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('numQuestions', 10);

  const response = await fetch(
    `${getBackendUrl()}/api/generate-quiz-from-document`,
    {
      method: 'POST',
      body: formData
    }
  );

  const data = await response.json();
  console.log(data.questions);
}

// Generate flashcards from document
async function generateCardsFromDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('count', 15);

  const response = await fetch(
    `${getBackendUrl()}/api/generate-cards-from-document`,
    {
      method: 'POST',
      body: formData
    }
  );

  const data = await response.json();
  console.log(data.cards);
}
```

## Example Documents

### Sample PDF Content
```
Photosynthesis

Photosynthesis is the process by which plants convert light energy 
into chemical energy that can be used to fuel the plant's cellular activities.

The Process:
1. Light-dependent reactions occur in the thylakoid membranes
2. Water molecules are split, releasing oxygen
3. NADPH and ATP are produced
4. Light-independent reactions (Calvin cycle) convert CO2 to glucose

Key Benefits:
- Produces oxygen for atmosphere
- Converts solar energy to chemical energy
- Foundation of food chains
```

### Sample Text File
```
World War II Facts

Dates: 1939-1945
Main Belligerents: Axis vs. Allies
Key Turning Points:
- Battle of Stalingrad (1942-1943)
- D-Day Invasion (June 6, 1944)
- Battle of the Bulge (1944-1945)

Notable Figures:
- Winston Churchill (Britain)
- Franklin D. Roosevelt (USA)
- Joseph Stalin (USSR)
- Adolf Hitler (Nazi Germany)
```

## Expected Output Examples

### Generated Quiz Questions
```json
[
  {
    "question": "In what year did World War II end?",
    "options": [
      "1943",
      "1944",
      "1945",
      "1946"
    ],
    "correct": "1945"
  },
  {
    "question": "Who was the Prime Minister of Britain during WWII?",
    "options": [
      "Neville Chamberlain",
      "Winston Churchill",
      "Clement Attlee",
      "Anthony Eden"
    ],
    "correct": "Winston Churchill"
  }
]
```

### Generated Flashcards
```json
[
  {
    "question": "What is the definition of photosynthesis?",
    "answer": "The process by which plants convert light energy from the sun into chemical energy stored in glucose molecules, using water and carbon dioxide as inputs."
  },
  {
    "question": "What are the products of the light-dependent reactions?",
    "answer": "The light-dependent reactions produce NADPH, ATP, and oxygen. Water molecules are split and the oxygen is released as a byproduct."
  }
]
```

## Error Examples

### No File Provided
```json
{
  "error": "No file provided"
}
```

### Unsupported File Type
```json
{
  "error": "Only PDF, TXT, and MD files are allowed"
}
```

### Empty Document
```json
{
  "error": "Document appears to be empty"
}
```

### Groq Key Not Configured
```json
{
  "error": "Groq API key not configured"
}
```

### Groq API Error
```json
{
  "error": "Failed to generate quiz from document: Rate limit exceeded. Please try again later."
}
```

## Testing Workflow

### 1. Start Backend
```bash
cd flashcard-backend
npm run dev
```

### 2. Create Sample Document
Create `test.txt`:
```
JavaScript Basics

Variables:
- var, let, const
- let is block-scoped
- const cannot be reassigned

Data Types:
- String, Number, Boolean
- Object, Array
- undefined, null

Functions:
- Named functions
- Arrow functions: () => {}
- Closures
```

### 3. Test Document Analysis
```bash
curl -X POST http://localhost:5000/api/generate-quiz-from-document \
  -F "file=@test.txt" \
  -F "numQuestions=5"
```

### 4. Check Response
Should return 5 multiple choice questions about JavaScript!

## Integration with Flashcard App

### In Quiz Builder

```javascript
// When user clicks "Generate from PDF"
async function handleDocumentUpload() {
  const file = document.getElementById('pdf-file-input').files[0];
  const count = document.getElementById('pdf-quiz-count-input').value;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('numQuestions', count);

    const response = await fetch(
      `${getBackendUrl()}/api/generate-quiz-from-document`,
      { method: 'POST', body: formData }
    );

    const data = await response.json();
    
    // Process into quiz format
    const questions = data.questions.map(q => ({
      question: q.question,
      options: shuffleArray(q.options),
      correct: q.correct
    }));

    // Add to quiz builder
    teacherQuestions = questions;
    window._teacherTitleDraft = `${file.name} Quiz`;
    
    renderApp();
  } catch (error) {
    toast(`Error: ${error.message}`);
  }
}
```

## Performance Tips

### Optimize Document Size
- Limit documents to 10-20 pages
- Remove images/formatting if possible
- Text-only content is best

### Batch Processing
```bash
# Instead of 10 separate 1-question requests:
# Make 1 request for 10 questions
curl -X POST http://localhost:5000/api/generate-quiz-from-document \
  -F "file=@document.pdf" \
  -F "numQuestions=10"  # Better than 10 calls with numQuestions=1
```

### Caching
Store generated questions in localStorage:
```javascript
const cacheKey = `quiz_${file.name}_${file.size}`;
if (localStorage.getItem(cacheKey)) {
  return JSON.parse(localStorage.getItem(cacheKey));
}
```

## Troubleshooting Examples

### Issue: "Cannot GET /api/generate-quiz-from-document"
**Cause:** Backend not running or wrong URL
**Fix:** 
```bash
cd flashcard-backend
npm run dev
```

### Issue: "ENOENT: no such file or directory"
**Cause:** File path incorrect
**Fix:** Use absolute path or test with file in same directory

### Issue: "rate_limit_exceeded" from Groq
**Cause:** Too many API requests in short time
**Fix:** Wait a few minutes, upgrade plan for higher limits

### Issue: "413 Payload Too Large"
**Cause:** File exceeds 10MB limit
**Fix:** Use smaller PDF or text file
