# Document Analysis Feature - Quick Summary

✅ **COMPLETE!** Your backend now supports document-based quiz generation.

## What's New

### Backend Updates
- ✅ **multer** - File upload handling
- ✅ **pdf-parse** - PDF text extraction
- ✅ **POST /api/generate-quiz-from-document** - Analyze PDFs and generate quizzes
- ✅ **POST /api/generate-cards-from-document** - Analyze documents and generate flashcards

### Frontend Updates
- ✅ **PDF Quiz Modal** - Already existed, now connected to real backend
- ✅ **Dynamic Backend URL** - Uses `getBackendUrl()` function
- ✅ **File Upload Support** - PDF, TXT, Markdown files
- ✅ **Error Handling** - Real error messages from backend

## Quick Start

### 1. Install Dependencies
```bash
cd c:\Users\User\flashcard-backend
npm install
```

### 2. Get Groq Key
- Go: https://console.groq.com/keys
- Create new API key
- Copy key

### 3. Create .env File
```bash
cp .env.example .env
```

Edit `.env`:
```
GROQ_API_KEY=gsk-your-key-here
PORT=5000
NODE_ENV=development
```

### 4. Start Backend
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### 5. Test Document Analysis

Go to your app (http://localhost:8000 or wherever):
1. Click "Create Quiz"
2. Scroll to "📄 PDF Quiz Generator"
3. Click "📄 Generate from PDF"
4. Upload a PDF file
5. Click "Generate Quiz"
6. Questions will be generated! 🎉

## How It Works

```
User uploads PDF
        ↓
Frontend sends to Backend
        ↓
Backend extracts text (pdf-parse)
        ↓
Sends text to Groq
        ↓
Groq analyzes and generates questions
        ↓
Questions returned to frontend
        ↓
Added to quiz builder
        ↓
Teacher publishes quiz
```

## File Structure

```
flashcard-backend/
├── server.js               (All endpoints including new document ones)
├── package.json            (Added multer & pdf-parse)
├── .env.example            (Groq key template)
├── README.md               (Full API docs)
├── DEPLOY.md               (Deployment guide)
├── SETUP.md                (Quick setup)
└── DOCUMENT_ANALYSIS.md    (New! Document feature guide)
```

## Frontend Changes

### New Helper Functions
```javascript
getBackendUrl()        // Gets backend URL from localStorage
setBackendUrl(url)     // Sets backend URL in localStorage
```

### Updated API Endpoints
All quiz API calls now use `getBackendUrl()`:
- `GET /api/quizzes/:id`
- `PUT /api/quizzes/:id`
- `DELETE /api/quizzes/:id`
- `POST /api/quizzes`

### New generatePDFQuiz() Function
Replaced mock implementation with real backend integration:
- Reads file from input
- Sends to `POST /api/generate-quiz-from-document`
- Processes returned questions
- Adds to quiz builder

## Deployment

For production (Render, Heroku, etc):

1. **Update frontend backend URL:**
   - In your app settings or localStorage
   - Or hardcode: `localStorage.setItem('backendUrl', 'https://your-backend.onrender.com')`

2. **Deploy backend:**
   - Push to GitHub
   - Deploy to Render/Heroku
   - Set `GROQ_API_KEY` environment variable

3. **Test:**
   - Upload PDF through app
   - Should generate questions from your document

## Supported Files

✅ PDF files (.pdf)
✅ Text files (.txt)
✅ Markdown files (.md)
❌ Word documents (.docx) - Not supported
❌ Image-only PDFs - Won't work

## Pricing

- **Render Hosting**: Free (with limitations) or $7/month
- **Groq**: Free tier available + affordable plans
  - 10 questions = ~$0.02-0.03
  - 100 quizzes/month = ~$2-3

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup Groq key in .env
3. ✅ Start backend: `npm run dev`
4. ✅ Test document upload in your app
5. ✅ Deploy to production when ready

## Common Issues

**Backend not connecting?**
- Check backend is running: `npm run dev`
- Check network tab in browser DevTools (F12)
- Verify CORS headers

**PDF not extracting?**
- File might be image-based PDF (try different file)
- File might be corrupted
- Check file size < 10MB

**Groq error?**
- Check API key is correct
- Verify account has credits
- Try shorter document

## Documentation

- `README.md` - Full API reference
- `DEPLOY.md` - How to deploy
- `DOCUMENT_ANALYSIS.md` - Document feature details
- `SETUP.md` - Quick setup guide

## Questions?

Check the documentation files or test with the included example endpoints!

**Ready to use?** Start with `npm run dev` 🚀
