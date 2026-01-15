# 🎯 Render Deployment - Quick Start

## What You Have Ready

✅ Backend code with Groq API integration
✅ Git repository initialized
✅ All dependencies configured
✅ .env.example with Groq setup
✅ Comprehensive documentation

---

## Deploy in 3 Steps

### Step 1: Push to GitHub (2 min)

**Create repo on GitHub.com:**
```
https://github.com/new
- Name: flashcard-backend
- Make it PUBLIC
- Click "Create repository"
```

**Copy these commands from GitHub setup page, then run:**
```bash
cd c:\Users\User\flashcard-backend
git remote add origin https://github.com/YOUR_USERNAME/flashcard-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render (2 min)

1. Go to https://render.com
2. Sign up with GitHub
3. Click **+ New** → **Web Service**
4. **Connect GitHub** → select `flashcard-backend`
5. Fill settings:
   - Name: `flashcard-api`
   - Build: `npm install`
   - Start: `npm start`

6. Click **Advanced** → Add environment variable:
   ```
   GROQ_API_KEY = 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
   ```

7. Click **Create Web Service**
8. Wait 2-3 minutes for deployment ✨

### Step 3: Update Frontend (1 min)

Once deployed, you'll get a URL like:
```
https://flashcard-api.onrender.com
```

In your app, open console (F12) and run:
```javascript
setBackendUrl('https://flashcard-api.onrender.com')
```

Or edit app.js line 1-10 and update:
```javascript
const DEFAULT_BACKEND_URL = 'https://flashcard-api.onrender.com';
```

---

## Test It Works

Visit: `https://flashcard-api.onrender.com/api/health`

Should show:
```json
{"status":"ok","timestamp":"..."}
```

---

## Important: Free Tier Notes

**Free tier = Perfect for development/testing**

✅ Works great for:
- Development
- Testing
- Small-scale learning
- Student projects

⚠️ Limitations:
- Server sleeps after 15 min inactivity
- First request after sleep = ~30 sec slower
- Limited CPU/RAM

✅ Upgrade to Starter ($7/mo) for:
- Always-on server
- Better performance
- Recommended for production

---

## Future: Keep Server Awake

If on free tier, keep server active with:

**Option 1: Monitoring Service (Free)**
- Use https://uptimerobot.com (free tier)
- Set to ping your API every 5 minutes
- Keeps server warm

**Option 2: Upgrade to Starter ($7/mo)**
- Dashboard → Settings → Change Instance Type
- Instant always-on deployment

---

## What's Next?

1. ✅ Deploy (you are here)
2. Test PDF upload in your app
3. Create a few quizzes
4. Share with others (it's live!)
5. Optional: Add database to save quizzes permanently
6. Optional: Add authentication

---

## Reference Files

- `RENDER_DEPLOYMENT.md` - Full detailed guide
- `README.md` - API documentation
- `DOCUMENT_ANALYSIS.md` - Feature guide
- `.env.example` - Environment template

---

## Support Commands

```bash
# View deployment status
# → Go to https://dashboard.render.com

# View live logs
# → Dashboard → flashcard-api → Logs

# Redeploy latest code
# → Dashboard → Manual deploy

# Update environment variables
# → Dashboard → Environment

# Restart server
# → Dashboard → Restart service

# Delete deployment
# → Dashboard → Settings → Delete service
```

---

## Cost Breakdown

| Service | Free Tier | Starter |
|---------|-----------|---------|
| **Render** | ✅ FREE | $7/mo |
| **Groq API** | ✅ FREE (limited) | Paid |
| **GitHub** | ✅ FREE | — |
| **Total** | **$0** | **$7+** |

---

**Status:** Ready to deploy! Follow the 3 steps above. Takes ~5 minutes. 🚀
