# Quick Deploy Guide

## Option 1: Deploy to Render (Easiest - Free)

### Step 1: Create GitHub Repository
```bash
cd flashcard-backend
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com
2. Click "New Web Service"
3. Connect your GitHub account
4. Select the `flashcard-backend` repository
5. Fill in settings:
   - **Name**: `flashcard-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Starter for better performance)

6. Click "Advanced" and add Environment Variables:
   ```
   GROQ_API_KEY=gsk-...  (your Groq key)
   NODE_ENV=production
   ```

7. Click "Create Web Service"
8. Wait for deployment (~2 minutes)
9. Copy the URL (e.g., `https://flashcard-api.onrender.com`)

### Step 3: Update Your Frontend

In `app.js`, replace:
```javascript
// OLD:
const AI_API_URL = "https://flashcards-ai-backend.onrender.com/api/generate-cards";
// Line 3446: const res = await fetch("https://flashcards-ai-backend.onrender.com/api/generate-quiz", ...
// Line 3531: `https://quiz-backend.espaderario.workers.dev/api/quizzes/${quizId}`

// NEW:
const AI_API_URL = "https://flashcard-api.onrender.com/api/generate-cards";
// Line 3446: const res = await fetch("https://flashcard-api.onrender.com/api/generate-quiz", ...
// Line 3531: `https://flashcard-api.onrender.com/api/quizzes/${quizId}`
```

## Option 2: Run Locally

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Groq API key to .env
# GROQ_API_KEY=gsk-...

# Run development server
npm run dev

# Server runs at http://localhost:5000
```

## Option 3: Deploy to Heroku (Requires Credit Card)

```bash
# Install Heroku CLI
heroku login
heroku create flashcard-api
heroku config:set GROQ_API_KEY=gsk-...
git push heroku main
```

## Get Groq API Key

1. Go to https://console.groq.com/keys
2. Sign up or log in
3. Click "Create API Key"
4. Copy it
5. Add to `.env` or Render environment variables

⚠️ **IMPORTANT**: Keep your API key secret! Never commit it to GitHub.

## Test Your Backend

```bash
# Check if backend is running
curl https://flashcard-api.onrender.com/api/health

# Generate quiz (requires Groq key)
curl -X POST https://flashcard-api.onrender.com/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"topic":"World History","numQuestions":3}'
```

## Troubleshooting

### 503 Bad Gateway on Render
- Wait 1-2 minutes for the app to warm up (free tier)
- Check the Render logs for errors

### AI Generation Not Working
- Verify Groq API key is correct
- Check you have enough API credits
- Check the logs: Render Dashboard → Logs

### CORS Issues
- CORS is already enabled in the backend
- Make sure you're using the full URL with `https://`

## Cost Estimates

- **Render**: Free tier = $0/month (sleeps after 15 mins of inactivity)
- **Groq**: Free tier available + affordable paid plans
- **Total**: ~$0-5/month depending on usage

To upgrade from free tier on Render, it's $7/month for better performance.
