# Document-Based Quiz Generation Guide

## Overview

Your Flashcard app now supports **analyzing PDFs and documents** to automatically generate quiz questions using AI!

Teachers can now:
1. ✅ Upload PDF files, TXT files, or Markdown documents
2. ✅ AI automatically extracts text and analyzes content
3. ✅ Generates quiz questions based on document content
4. ✅ Customize number of questions to generate

## How to Use

### On the Frontend (App)

1. **Go to Teacher Quiz Builder**
   - Click "Create Quiz"
   - Scroll down to "📄 PDF Quiz Generator"

2. **Click "📄 Generate from PDF"**
   - A modal dialog will appear

3. **Upload Document**
   - Select a PDF, TXT, or Markdown file
   - Specify number of questions (1-50)
   - Click "Generate Quiz"

4. **AI Generates Questions**
   - Backend extracts text from your document
   - OpenAI analyzes content
   - Multiple choice questions are created
   - Questions auto-populate your quiz builder

### On the Backend

#### New Endpoints

**Generate Quiz from Document:**
```
POST /api/generate-quiz-from-document
Content-Type: multipart/form-data

Form Data:
- file: <PDF, TXT, or MD file>
- numQuestions: <number>

Response:
{
  "success": true,
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": "Correct answer text"
    }
  ],
  "documentName": "filename.pdf",
  "charactersAnalyzed": 8000
}
```

**Generate Flashcards from Document:**
```
POST /api/generate-cards-from-document
Content-Type: multipart/form-data

Form Data:
- file: <PDF, TXT, or MD file>
- count: <number>

Response:
{
  "success": true,
  "cards": [
    {
      "question": "Question?",
      "answer": "Answer explanation..."
    }
  ],
  "documentName": "filename.pdf",
  "charactersAnalyzed": 8000
}
```

## Supported File Types

✅ **PDF** (.pdf)
- Scanned documents
- Digital PDFs
- Text-based PDFs

✅ **Text Files** (.txt)
- Plain text documents
- Notes
- Study guides

✅ **Markdown** (.md)
- Markdown formatted documents
- GitHub-style documents

❌ **Not Supported**
- DOCX (Word documents)
- Images only PDFs
- Password-protected PDFs

## Setup Requirements

### 1. Install Dependencies

The backend already includes file upload support:
```bash
npm install
```

Required packages:
- `multer` - File upload handling
- `pdf-parse` - PDF text extraction

### 2. Configure OpenAI API Key

Get your API key from https://platform.openai.com/api-keys

Set in environment:
```bash
OPENAI_API_KEY=sk-...
```

### 3. File Size Limits

- Maximum file size: **10MB**
- Maximum text analyzed: **8000 characters** (to avoid token limits)
- Timeout: **60 seconds**

## How It Works

1. **File Upload**
   - Frontend sends file to backend via FormData
   - Multer validates file type and size

2. **Text Extraction**
   - For PDFs: Uses `pdf-parse` library
   - For TXT/MD: Direct text reading

3. **Content Analysis**
   - Backend sends extracted text to OpenAI
   - Prompts AI to generate quiz questions based on content
   - Limits text to 8000 chars to avoid token overflow

4. **Question Generation**
   - OpenAI generates multiple choice questions
   - Each question has 4 options
   - Returns in JSON format

5. **Frontend Processing**
   - Questions are processed into quiz format
   - Displayed in quiz builder
   - Ready to publish

## Error Handling

### Common Errors

**"No file provided"**
- Solution: Select a file before clicking Generate

**"Document appears to be empty"**
- Solution: File has no readable text
- Try different file format

**"Failed to extract text from document"**
- Solution: File may be corrupted or image-based PDF
- Try converting PDF to text first

**"Groq API key not configured"**
- Solution: Set GROQ_API_KEY in backend environment

**"Unexpected error from Groq"**
- Solution: Check Groq account has credits

## Cost Considerations

### Groq API Pricing

For document-based quiz generation:
- Uses Mixtral 8x7B model (fast inference)
- Groq Free Tier: No cost with rate limits
- Groq Paid: Competitive pricing (~$0.001-0.002 per request)
- Example: 10 questions = FREE or ~$0.01

No usage monitoring needed for free tier at: https://console.groq.com

### To Reduce Costs

1. **Limit text size** - Only upload relevant sections
2. **Batch operations** - Generate multiple questions at once
3. **Use topic-based generation** for free alternatives

## Backend Configuration

### Configure File Upload Limits

In `server.js`:

```javascript
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'text/plain', 'text/markdown'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, TXT, and MD files are allowed'));
    }
  }
});
```

### Text Extraction Limits

Change maximum characters analyzed:

```javascript
const maxChars = 8000; // Increase this for longer documents
const limitedText = documentText.substring(0, maxChars);
```

## Advanced Features

### Future Enhancements

Could add:
- **OCR for scanned PDFs** - Tesseract.js
- **DOCX support** - mammoth library
- **Web page analysis** - Puppeteer
- **Video captions** - For multimedia content
- **Database storage** - Save generated quizzes

### Extending for Flashcards

The same document analysis works for flashcard generation!

Endpoint: `POST /api/generate-cards-from-document`

## Troubleshooting

### PDF Upload Not Working

1. Check file size < 10MB
2. Verify file is actual PDF (not image)
3. Check browser console for errors (F12)
4. Try different PDF file

### Backend Not Found

1. Ensure backend is running: `npm start` or `npm run dev`
2. Check backend URL in app: Settings or Console
3. Verify CORS is enabled (it is by default)

### Low Quality Questions

1. Try uploading cleaner document text
2. Provide more detailed content
3. Adjust numQuestions - sometimes 5 works better than 20

### Groq Errors

1. Check API key is correct
2. Verify account has available credits
3. Check Groq status page for API issues
4. Try simpler, shorter documents first

## Support

For issues:
1. Check backend logs: `npm run dev`
2. Check browser console: F12 → Console tab
3. Check Groq API status: https://status.groq.com
4. Verify your API key: https://console.groq.com/keys
