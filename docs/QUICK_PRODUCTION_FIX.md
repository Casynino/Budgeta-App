# ⚡ QUICK FIX: Production Deployment Error

## 🔴 Your Error:
```
Cannot connect to server. Please ensure the backend is running on http://localhost:5001
```

## 🎯 The Problem:
Your deployed frontend is trying to connect to `localhost:5001` instead of your production backend.

## ✅ THE FIX (3 Simple Steps):

---

### Step 1: Find Your Backend URL 🔍

**Where did you deploy your backend?**

- **Render:** Go to https://dashboard.render.com
  - Your URL looks like: `https://budgeta-api.onrender.com`
  
- **Railway:** Go to https://railway.app/dashboard
  - Your URL looks like: `https://budgeta-api.up.railway.app`
  
- **Heroku:** Go to https://dashboard.heroku.com
  - Your URL looks like: `https://budgeta-api.herokuapp.com`

**Write it down:** `https://_____________________.com`

---

### Step 2: Update Frontend Environment Variable 🔧

**Where did you deploy your frontend?**

#### If you're on Vercel:

1. Go to: https://vercel.com/dashboard
2. Click on your "Budgeta" project
3. Click "Settings" tab
4. Click "Environment Variables" in sidebar
5. **Add new variable:**
   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.com/api
   ```
   **IMPORTANT:** Add `/api` at the end!
   
6. Select all environments (Production, Preview, Development)
7. Click "Save"
8. Go to "Deployments" tab
9. Click the three dots (...) on latest deployment
10. Click "Redeploy"
11. Wait 1-2 minutes

#### If you're on Netlify:

1. Go to: https://app.netlify.com
2. Click on your "Budgeta" site
3. Click "Site settings"
4. Click "Environment variables" in sidebar
5. Click "Add a variable"
6. **Add:**
   ```
   Key: VITE_API_URL
   Value: https://your-backend-url.com/api
   ```
   **IMPORTANT:** Add `/api` at the end!
   
7. Click "Create variable"
8. Go to "Deploys" tab
9. Click "Trigger deploy" → "Deploy site"
10. Wait 1-2 minutes

---

### Step 3: Update Backend CORS 🔒

Your backend needs to allow requests from your frontend.

#### If backend is on Render:

1. Go to: https://dashboard.render.com
2. Click your backend service
3. Click "Environment" tab
4. Find `CLIENT_URL` variable
5. Update value to: `https://your-frontend-url.vercel.app`
   (Use YOUR actual frontend URL!)
6. Click "Save Changes"
7. Service will auto-redeploy (wait 2-3 minutes)

#### If backend is on Railway:

1. Go to: https://railway.app/dashboard
2. Click your backend project
3. Click "Variables" tab
4. Find or add `CLIENT_URL`
5. Set value to: `https://your-frontend-url.vercel.app`
6. Redeploy if needed

---

## ✅ Test Your Fix

### Test 1: Check Backend is Running
Open this in browser:
```
https://your-backend-url.com/health
```

Should see:
```json
{"status":"ok","message":"Budgeta API is running"}
```

### Test 2: Check Frontend Environment
1. Open your deployed app: `https://your-frontend-url.com`
2. Press F12 (Open Console)
3. Look for: `[API] Using API_URL: https://your-backend-url.com/api`
4. Should NOT say localhost!

### Test 3: Test Registration
1. Go to registration page
2. Fill in form
3. Click "Create Account"
4. Should work now! ✅

---

## 🎯 Quick Reference

### Your URLs:

Fill these in:

```
Frontend URL: https://_________________________.vercel.app
Backend URL:  https://_________________________.onrender.com
API URL:      https://_________________________.onrender.com/api
```

### Environment Variables:

**Frontend (Vercel/Netlify):**
```
VITE_API_URL=https://your-backend-url.com/api
```

**Backend (Render/Railway):**
```
CLIENT_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

---

## 🐛 Still Not Working?

### Error: "CORS policy"
**Fix:** Make sure backend `CLIENT_URL` matches your frontend URL exactly (no trailing slash)

### Error: "504 Gateway Timeout"
**Fix:** Backend is waking up (Render free tier). Wait 60 seconds and try again.

### Error: Still showing localhost
**Fix:** 
1. Make sure you saved the environment variable
2. Make sure you redeployed after adding it
3. Clear browser cache (Ctrl+Shift+Delete)

---

## 📋 Deployment Checklist

- [ ] Backend is deployed and running
- [ ] Backend health endpoint works
- [ ] Frontend is deployed
- [ ] `VITE_API_URL` environment variable added to frontend
- [ ] Frontend redeployed after adding variable
- [ ] `CLIENT_URL` updated in backend
- [ ] Backend redeployed after updating CORS
- [ ] Browser console shows production URL (not localhost)
- [ ] Registration works!

---

## 💡 Common Mistakes

### ❌ Wrong:
```bash
VITE_API_URL=http://localhost:5001/api  # Still localhost!
```

### ✅ Correct:
```bash
VITE_API_URL=https://budgeta-api.onrender.com/api  # Production URL!
```

---

### ❌ Wrong:
```bash
VITE_API_URL=https://budgeta-api.onrender.com  # Missing /api
```

### ✅ Correct:
```bash
VITE_API_URL=https://budgeta-api.onrender.com/api  # Has /api
```

---

### ❌ Wrong:
Setting `.env` file locally (doesn't affect deployed app!)

### ✅ Correct:
Setting environment variable on Vercel/Netlify dashboard

---

## 🎊 Done!

After following these steps, your app should work in production!

**Remember:**
- Local `.env` files ≠ Production environment variables
- Always set variables on deployment platform
- Always redeploy after changing environment variables
- Include `/api` in the API URL

---

**For detailed guide, see:** `DEPLOYMENT_FIX.md`

