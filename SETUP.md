# Backend Setup Complete! 🎉

Your backend is ready in: `C:\Users\User\flashcard-backend`

## What's Included

✅ **Express.js Server** - REST API with CORS support
✅ **AI Quiz Generation** - Groq API integration for creating quizzes
✅ **AI Card Generation** - Groq API integration for flashcards
✅ **Quiz Management** - Full CRUD operations (Create, Read, Update, Delete)
✅ **Production Ready** - Can be deployed to Render (free)

## 3 Quick Steps to Deploy

### 1️⃣ Get Groq API Key (2 minutes)
- Go to: https://console.groq.com
- Sign up or log in
- Click API Keys
- Create new API key
- Copy the key

### 2️⃣ Deploy to Render (3 minutes)
1. Push backend to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repo
5. Add environment variable: `GROQ_API_KEY=gsk-...`
6. Deploy!

**Your backend URL**: `https://flashcard-api.onrender.com` (or similar)

### 3️⃣ Update Frontend URLs (1 minute)

In your `app.js` file, update these lines:

**Line 74-75** (AI API URL):
```javascript
// Change FROM:
const AI_API_URL = "https://flashcards-ai-backend.onrender.com/api/generate-cards";

// Change TO:
const AI_API_URL = "https://flashcard-api.onrender.com/api/generate-cards";
```

**Line 3446** (Generate Quiz):
```javascript
// Change FROM:
const res = await fetch("https://flashcards-ai-backend.onrender.com/api/generate-quiz", {

// Change TO:
const res = await fetch("https://flashcard-api.onrender.com/api/generate-quiz", {
```

**Line 3531, 3559, 3598** (Quiz API):
```javascript
// Change FROM:
`https://quiz-backend.espaderario.workers.dev/api/quizzes/${quizId}`

// Change TO:
`https://flashcard-api.onrender.com/api/quizzes/${quizId}`
```

## API Endpoints

```
✅ GET /api/health                          - Check if backend is running
✅ POST /api/generate-quiz                  - Generate quiz questions (requires OpenAI key)
✅ POST /api/generate-cards                 - Generate flashcards (requires OpenAI key)
✅ POST /api/quizzes                        - Create quiz
✅ GET /api/quizzes/:quizId                 - Get quiz by ID
✅ PUT /api/quizzes/:quizId                 - Update quiz
✅ DELETE /api/quizzes/:quizId              - Delete quiz
✅ GET /api/quizzes                         - List all quizzes
```

## File Structure

```
flashcard-backend/
├── server.js           - Main Express app (all endpoints)
├── package.json        - Dependencies
├── .env.example        - Environment variables template
├── .gitignore          - Git ignore rules
├── README.md           - Full documentation
└── DEPLOY.md           - Deployment guide
```

## Local Testing (Optional)

```bash
cd flashcard-backend
npm install
cp .env.example .env
# Edit .env and add your Groq key
npm run dev
```

Server will run at `http://localhost:5000`

## Costs

- **Render Hosting**: FREE (with free tier limits)
- **Groq API**: Free tier available + affordable paid plans
- **Total**: $0-5/month for small usage

## Next Steps

1. ✅ Get Groq API key
2. ✅ Deploy backend to Render
3. ✅ Update frontend URLs
4. ✅ Test AI features in your app
5. (Optional) Add database (MongoDB) for persistence

## Questions?

Check `DEPLOY.md` for detailed deployment instructions!
