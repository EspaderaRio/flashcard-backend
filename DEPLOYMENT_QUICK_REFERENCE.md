# 🚀 RENDER DEPLOYMENT - ONE-PAGE REFERENCE

## THE PROCESS (3 STEPS, 5 MINUTES)

```
Step 1: GitHub
├─ Create repo at https://github.com/new
├─ Name: flashcard-backend
├─ Make PUBLIC
└─ Copy the git commands

Step 2: Push to GitHub
├─ git remote add origin https://github.com/YOU/flashcard-backend.git
├─ git branch -M main
└─ git push -u origin main

Step 3: Deploy on Render
├─ Go to https://render.com
├─ Sign in with GitHub
├─ Click +New → Web Service
├─ Connect GitHub repo: flashcard-backend
├─ Fill settings:
│  ├─ Name: flashcard-api
│  ├─ Build: npm install
│  └─ Start: npm start
├─ Add Environment: GROQ_API_KEY = [your key]
└─ Click Create Web Service (wait 2-3 min)
```

## COMMANDS TO RUN

**In your terminal (from c:\Users\User\flashcard-backend):**

```powershell
# After creating GitHub repo, copy/paste from GitHub:
git remote add origin https://github.com/YOUR_USERNAME/flashcard-backend.git
git branch -M main
git push -u origin main
```

That's it! Render auto-deploys when it sees new commits.

---

## YOUR DETAILS

- **GitHub Repo:** https://github.com/YOUR_USERNAME/flashcard-backend
- **Groq API Key:** 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
- **Render URL (after deploy):** https://flashcard-api.onrender.com
- **Frontend Update:**
  ```javascript
  setBackendUrl('https://flashcard-api.onrender.com')
  ```

---

## IMPORTANT CHECKLIST

- [ ] GitHub repo created and set to PUBLIC
- [ ] Code pushed to GitHub main branch
- [ ] Render app created and connected to GitHub
- [ ] GROQ_API_KEY added in Render environment variables
- [ ] Deployment successful (watch logs in Render dashboard)
- [ ] Test API: https://flashcard-api.onrender.com/api/health
- [ ] Update frontend URL to use Render URL

---

## FREE TIER NOTES

✅ **Costs: FREE**
✅ **Works great for:** Development, testing, learning
✅ **Features:** HTTPS, auto-deploy from GitHub, logs

⚠️ **Limitation:** Sleeps after 15 min of inactivity
   - First request wakes it up (~30 sec)
   - Still free! Just a bit slower initially

📈 **Upgrade if needed:** Starter = $7/mo (always on)

---

## AFTER DEPLOYMENT

1. **Test it:**
   ```
   https://flashcard-api.onrender.com/api/health
   Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Update your app:**
   ```javascript
   // In browser console (F12):
   setBackendUrl('https://flashcard-api.onrender.com')
   ```

3. **Test full flow:**
   - Open your flashcard app
   - Create a quiz
   - Upload a PDF
   - Should generate questions from your Groq API!

4. **Share it:**
   - Your app now has a live, 24/7 backend!
   - Share the frontend URL with others

---

## MANAGE YOUR DEPLOYMENT

**View logs:**
- https://dashboard.render.com → flashcard-api → Logs

**Redeploy latest code:**
- Push to GitHub, it auto-deploys
- Or manual: Dashboard → Manual Deploy

**Update environment variables:**
- Dashboard → Environment
- Add/modify/delete GROQ_API_KEY etc

**Restart:**
- Dashboard → Restart service

**Upgrade plan:**
- Dashboard → Settings → Restart → Upgrade Instance Type

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Build fails | Check package.json has all deps |
| "Groq key not set" | Add GROQ_API_KEY in Render environment |
| API returns 404 | Wrong URL? Check Render dashboard for correct domain |
| Frontend can't reach API | Update frontend URL: `setBackendUrl(...)` |
| Server sleeps | Normal on free tier - wakes instantly |
| Want it always-on | Upgrade to Starter plan ($7/mo) |

---

## WHAT TO READ

- **DEPLOY_NOW.md** - Quick 3-step guide (this file)
- **RENDER_DEPLOYMENT.md** - Full detailed walkthrough
- **README.md** - API endpoints reference

---

## SUPPORT LINKS

- Render Dashboard: https://dashboard.render.com
- Groq Console: https://console.groq.com
- GitHub: https://github.com

---

**Next Step: Create GitHub repo → https://github.com/new**
