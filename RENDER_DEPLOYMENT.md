# 🚀 Deploy to Render (5 Minutes)

Your backend is ready to deploy! Follow these steps to make it available 24/7.

## Step 1: Create GitHub Repository (2 minutes)

### A. Create on GitHub.com
1. Go to https://github.com/new
2. **Repository name:** `flashcard-backend`
3. **Description:** "Flashcard backend with Groq AI integration"
4. **Visibility:** Public (Render needs this for free tier)
5. Click **Create repository**

### B. Push Your Code
```bash
cd c:\Users\User\flashcard-backend

# Add remote (copy from GitHub after creating repo)
git remote add origin https://github.com/YOUR_USERNAME/flashcard-backend.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 2: Deploy on Render (3 minutes)

### A. Connect Render Account
1. Go to https://render.com
2. Click **Sign up** (or sign in with GitHub)
3. Authorize Render to access your GitHub account

### B. Create Web Service
1. Click **+ New** → **Web Service**
2. **Connect a repository** → Select `flashcard-backend`
3. Click **Connect**

### C. Configure Deployment

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `flashcard-api` |
| **Environment** | `Node` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### D. Add Environment Variables

Click **Advanced** → **Add Environment Variable**

Add these:
```
Key: GROQ_API_KEY
Value: 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
```

```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 8000
```

### E. Deploy!

1. Click **Create Web Service**
2. Wait for deployment (2-3 minutes)
3. You'll see a URL like: `https://flashcard-api.onrender.com`

---

## Step 3: Update Your Frontend

Once deployed, update your app to use the Render URL:

### In Your Browser Console (F12)
```javascript
// Set Render backend URL
setBackendUrl('https://flashcard-api.onrender.com')

// Verify it's set
console.log(localStorage.getItem('backendUrl'))
```

### Or Edit app.js
Find this line and update the default:
```javascript
const DEFAULT_BACKEND_URL = 'https://flashcard-api.onrender.com';
```

---

## Verify Deployment

### Check Health Endpoint
```
https://flashcard-api.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T..."
}
```

### Test Quiz Generation
```bash
curl -X POST https://flashcard-api.onrender.com/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"topic":"Biology","numQuestions":2}'
```

---

## Useful Links

| Feature | URL |
|---------|-----|
| **View Logs** | https://dashboard.render.com |
| **Manage App** | https://dashboard.render.com → Select `flashcard-api` |
| **View Domain** | https://dashboard.render.com → Settings |
| **Update Code** | Push to GitHub, Render auto-deploys |
| **Restart App** | Dashboard → Manual deploy |

---

## Important Notes

### Free Tier Limits
- ⚠️ Server goes to sleep after 15 mins of inactivity
- ✅ Wakes up when you make a request (first request ~30 sec slower)
- ✅ Free SSL certificate (HTTPS)
- ✅ Unlimited API calls (within Groq rate limits)

### To Keep Server Active
Option 1: Upgrade to Starter plan ($7/month)
```
Dashboard → Settings → Upgrade Instance Type
```

Option 2: Setup monitoring endpoint (keeps server warm)
```bash
# Run from local machine or set up monitoring
curl https://flashcard-api.onrender.com/api/health every 10 minutes
```

### Update Backend Code
1. Make changes locally
2. `git add .`
3. `git commit -m "Update message"`
4. `git push`
5. Render auto-deploys (watch dashboard)

---

## Troubleshooting

### "No repository connected"
→ Ensure GitHub repo is public and Render has access

### "Build failed: Cannot find module"
→ Check package.json has all dependencies listed

### "Groq API key not configured"
→ Add GROQ_API_KEY in Render dashboard Environment Variables

### "Port already in use"
→ Render handles port assignment automatically

### "Still getting Offline error"
→ Update frontend URL: `setBackendUrl('https://flashcard-api.onrender.com')`

---

## Cost Analysis

- **Render Hosting**: FREE (with limits) or $7/month (unlimited)
- **Groq API**: FREE tier available
- **GitHub**: FREE
- **Total**: **$0-7/month** depending on needs

---

## Next: Production-Ready Setup

Once deployed, you might want:

1. **Custom Domain** (e.g., api.mysite.com)
   - Render supports custom domains
   - Add CNAME record in your DNS

2. **Database** (store quizzes permanently)
   - Upgrade to MongoDB Atlas
   - Update `server.js` to save to DB

3. **Authentication** (so only your students can use it)
   - Add JWT tokens
   - Validate API keys

4. **Monitoring** (get alerts if API fails)
   - Render has built-in monitoring
   - Or use UptimeRobot (free)

---

**Status:** Your backend is production-ready! Deploy now for 24/7 availability. 🚀
