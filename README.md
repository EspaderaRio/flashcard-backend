# Flashcard Backend

Node.js + Express backend for the Flashcard Study Hub application.

## Features

- ✅ Quiz CRUD operations (Create, Read, Update, Delete)
- ✅ AI-powered quiz generation using Groq API
- ✅ AI-powered flashcard generation
- ✅ CORS enabled for frontend integration
- ✅ RESTful API architecture

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Then edit `.env` and add:
- `GROQ_API_KEY`: Get from https://console.groq.com/keys
- `PORT`: (optional) defaults to 5000

### 3. Run Locally
```bash
npm run dev
```

Server will start at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### AI Generation

#### Generate Quiz Questions
```
POST /api/generate-quiz
Content-Type: application/json

{
  "topic": "World History",
  "numQuestions": 5
}
```

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "question": "What year did World War II end?",
      "options": ["1943", "1945", "1947", "1950"],
      "correct": "1945"
    }
  ]
}
```

#### Generate Flashcards
```
POST /api/generate-cards
Content-Type: application/json

{
  "topic": "Biology",
  "count": 10
}
```

**Response:**
```json
{
  "success": true,
  "cards": [
    {
      "question": "What is photosynthesis?",
      "answer": "The process by which plants convert light energy into chemical energy..."
    }
  ]
}
```

### Quiz Management

#### Create Quiz
```
POST /api/quizzes
Content-Type: application/json

{
  "title": "My Quiz",
  "questions": [
    {
      "question": "What is 2+2?",
      "options": ["3", "4", "5"],
      "correct": "4"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "quizId": "1",
  "message": "Quiz created successfully"
}
```

#### Get Quiz
```
GET /api/quizzes/:quizId
```

#### Update Quiz
```
PUT /api/quizzes/:quizId
Content-Type: application/json

{
  "title": "Updated Title",
  "questions": [...]
}
```

#### Delete Quiz
```
DELETE /api/quizzes/:quizId
```

#### List All Quizzes
```
GET /api/quizzes
```

## Deploy to Render

1. Push this folder to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your GitHub repository
5. Set Environment Variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `NODE_ENV`: `production`
6. Deploy!

Your backend URL will be like: `https://your-app-name.onrender.com`

## Update Frontend URLs

In your `app.js`, replace:
- `https://flashcards-ai-backend.onrender.com` → `https://your-backend-url.onrender.com`
- `https://quiz-backend.espaderario.workers.dev` → `https://your-backend-url.onrender.com`

## Get OpenAI API Key

1. Go to https://platform.openai.com
2. Sign up or login
3. Go to API keys section
4. Create new API key
5. Copy and paste into `.env` file

**Note:** OpenAI charges per API call. Monitor your usage at https://platform.openai.com/account/billing/usage

## Database (Future)

To add persistence, integrate MongoDB:
1. Create MongoDB Atlas cluster (free tier available)
2. Add Mongoose to dependencies
3. Replace in-memory storage with MongoDB models
4. Update endpoints to use async database calls

## License

ISC
