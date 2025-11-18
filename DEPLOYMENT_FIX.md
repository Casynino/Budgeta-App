# 🚀 Production Deployment Fix Guide

## Issue: "Cannot connect to server. Please ensure the backend is running on http://localhost:5001"

This error means your deployed frontend is still trying to connect to `localhost:5001` instead of your production backend URL.

---

## 🔍 Root Cause

**Local `.env` files are NOT deployed to production.**

When you build and deploy your app:
- ❌ Your local `.env` file stays on your computer
- ❌ The deployment uses default values (localhost)
- ✅ You must set environment variables on your deployment platform

---

## ✅ Complete Fix (Step-by-Step)

### Step 1: Deploy Your Backend First

You need to deploy your backend to get a production URL.

#### Option A: Deploy to Render (Recommended - Free Tier)

1. **Go to:** https://render.com
2. **Sign up/Login** with GitHub
3. **Click:** "New +" → "Web Service"
4. **Connect:** Your GitHub repository (Budgeta-App)
5. **Configure:**
   ```
   Name: budgeta-api
   Region: Choose closest to you
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

6. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_QUc9eLGH8hXE@ep-young-dawn-a4v39pgm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   
   JWT_SECRET=budgeta_jwt_secret_key_2024_secure_random_string_change_in_production_xyz789
   
   NODE_ENV=production
   
   PORT=5001
   
   CLIENT_URL=https://your-app-name.vercel.app
   ```
   
   **IMPORTANT:** Replace `CLIENT_URL` with your actual frontend URL (see Step 2)

7. **Click:** "Create Web Service"

8. **Wait for deployment** (2-5 minutes)

9. **Copy your backend URL:**
   Will be something like: `https://budgeta-api.onrender.com`

#### Option B: Deploy to Railway

1. **Go to:** https://railway.app
2. **Sign up/Login** with GitHub
3. **Click:** "New Project" → "Deploy from GitHub repo"
4. **Select:** Budgeta-App
5. **Add Service:** Choose server folder
6. **Add Environment Variables** (same as Render above)
7. **Deploy** and copy your URL

---

### Step 2: Deploy Your Frontend

#### Option A: Deploy to Vercel (Recommended)

1. **Go to:** https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click:** "Add New..." → "Project"
4. **Import:** Budgeta-App repository
5. **Configure:**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

6. **Add Environment Variable:**
   Click "Environment Variables"
   
   Add:
   ```
   Name: VITE_API_URL
   Value: https://budgeta-api.onrender.com/api
   ```
   
   **IMPORTANT:** Replace with YOUR actual backend URL from Step 1!
   
   Make sure to add `/api` at the end!

7. **Click:** "Deploy"

8. **Copy your frontend URL:**
   Will be something like: `https://budgeta-app.vercel.app`

#### Option B: Deploy to Netlify

1. **Go to:** https://netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Connect:** GitHub → Select Budgeta-App
4. **Configure:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

5. **Add Environment Variable:**
   Site settings → Environment variables
   
   ```
   Key: VITE_API_URL
   Value: https://budgeta-api.onrender.com/api
   ```

6. **Deploy**

---

### Step 3: Update Backend CORS (Critical!)

After deploying frontend, you need to update backend's `CLIENT_URL`:

**On Render:**
1. Go to your backend service
2. Click "Environment"
3. Find `CLIENT_URL`
4. Update to: `https://budgeta-app.vercel.app`
5. Save (will auto-redeploy)

**On Railway:**
1. Go to your backend service
2. Click "Variables"
3. Update `CLIENT_URL` to your frontend URL
4. Redeploy

---

### Step 4: Verify Deployment

1. **Test backend:**
   ```bash
   curl https://budgeta-api.onrender.com/health
   ```
   Should return: `{"status":"ok","message":"Budgeta API is running"}`

2. **Test frontend:**
   - Open: `https://budgeta-app.vercel.app`
   - Open browser console (F12)
   - Should see: `[API] Using API_URL: https://budgeta-api.onrender.com/api`
   - NOT localhost!

3. **Test registration:**
   - Fill in registration form
   - Check console for API calls
   - Should connect successfully!

---

## 🔧 Quick Fix Checklist

### ☑️ Backend Deployed?
- [ ] Backend is on Render/Railway
- [ ] Has production URL (not localhost)
- [ ] Environment variables set correctly
- [ ] Health endpoint works
- [ ] Database connected

### ☑️ Frontend Deployed?
- [ ] Frontend is on Vercel/Netlify
- [ ] Has production URL
- [ ] `VITE_API_URL` environment variable set
- [ ] Points to production backend
- [ ] Includes `/api` at the end

### ☑️ CORS Configured?
- [ ] Backend `CLIENT_URL` set to frontend URL
- [ ] No localhost URLs in production
- [ ] Both services can communicate

### ☑️ Environment Variables?
- [ ] Backend: `NODE_ENV=production`
- [ ] Backend: `CLIENT_URL=https://your-frontend.com`
- [ ] Frontend: `VITE_API_URL=https://your-backend.com/api`
- [ ] Database URL is production ready

---

## 📊 Environment Variables Reference

### Frontend Environment Variables (Vercel/Netlify)

**Required:**
```bash
VITE_API_URL=https://budgeta-api.onrender.com/api
```

**Important:**
- ✅ Must start with `VITE_`
- ✅ Must be HTTPS (not HTTP)
- ✅ Must include `/api` at the end
- ✅ No trailing slash after `/api`

### Backend Environment Variables (Render/Railway)

**Required:**
```bash
DATABASE_URL=postgresql://neondb_owner:npg_QUc9eLGH8hXE@ep-young-dawn-a4v39pgm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=budgeta_jwt_secret_key_2024_secure_random_string_change_in_production_xyz789

NODE_ENV=production

CLIENT_URL=https://budgeta-app.vercel.app

PORT=5001
```

**Important:**
- ✅ `NODE_ENV` must be `production`
- ✅ `CLIENT_URL` must match your frontend URL exactly
- ✅ `DATABASE_URL` should use your Neon connection string
- ✅ `JWT_SECRET` should be a strong random string

---

## 🐛 Troubleshooting

### Error: "Cannot connect to server"

**Cause:** Frontend environment variable not set or wrong

**Fix:**
1. Go to Vercel/Netlify dashboard
2. Find your project
3. Go to Settings → Environment Variables
4. Add/Update `VITE_API_URL`
5. **Redeploy** (important!)

### Error: "CORS policy" in console

**Cause:** Backend `CLIENT_URL` doesn't match frontend URL

**Fix:**
1. Go to Render/Railway dashboard
2. Find your backend service
3. Update `CLIENT_URL` to match frontend URL exactly
4. Example: `https://budgeta-app.vercel.app` (no trailing slash)

### Error: "504 Gateway Timeout"

**Cause:** Backend is sleeping (Render free tier)

**Fix:**
- First request takes 30-60 seconds (cold start)
- Wait and try again
- Subsequent requests are fast

### Error: "Database connection failed"

**Cause:** Neon database URL incorrect or database is paused

**Fix:**
1. Go to https://console.neon.tech
2. Check database is active
3. Copy connection string
4. Update `DATABASE_URL` in backend environment variables

### Frontend shows old localhost URL

**Cause:** Build cache not cleared

**Fix:**
1. In Vercel/Netlify, trigger a new deployment
2. Or: Redeploy after changing environment variable
3. Clear browser cache

---

## 🎯 Common Mistakes to Avoid

### ❌ Wrong:
```bash
# Frontend .env (local file - not used in production!)
VITE_API_URL=http://localhost:5001/api
```

### ✅ Correct:
```bash
# Vercel/Netlify Environment Variable
VITE_API_URL=https://budgeta-api.onrender.com/api
```

### ❌ Wrong:
```bash
# Missing /api
VITE_API_URL=https://budgeta-api.onrender.com
```

### ✅ Correct:
```bash
# Includes /api
VITE_API_URL=https://budgeta-api.onrender.com/api
```

### ❌ Wrong:
```bash
# HTTP instead of HTTPS
VITE_API_URL=http://budgeta-api.onrender.com/api
```

### ✅ Correct:
```bash
# HTTPS in production
VITE_API_URL=https://budgeta-api.onrender.com/api
```

---

## 📱 Example URLs

### Development (Local):
```bash
Frontend: http://localhost:3000
Backend:  http://localhost:5001
API:      http://localhost:5001/api
```

### Production:
```bash
Frontend: https://budgeta-app.vercel.app
Backend:  https://budgeta-api.onrender.com
API:      https://budgeta-api.onrender.com/api
```

---

## 🔐 Security Best Practices

### For Production:

1. **Change JWT Secret:**
   ```bash
   # Generate a strong secret:
   openssl rand -base64 32
   
   # Use in production environment variable
   JWT_SECRET=your_generated_secret_here
   ```

2. **Use Environment Secrets:**
   - Never commit `.env` files
   - Always use platform's environment variables
   - Different secrets for dev/prod

3. **HTTPS Only:**
   - Always use HTTPS in production
   - No HTTP URLs

4. **CORS Whitelist:**
   - Only allow your frontend domain
   - No wildcards (`*`) in production

---

## 🧪 Testing Production Deployment

### Test 1: Backend Health
```bash
curl https://budgeta-api.onrender.com/health

# Expected:
{"status":"ok","message":"Budgeta API is running"}
```

### Test 2: Backend Root
```bash
curl https://budgeta-api.onrender.com/

# Expected:
{"message":"Welcome to Budgeta API","version":"1.0.0",...}
```

### Test 3: Frontend Console
1. Open: `https://budgeta-app.vercel.app`
2. Press F12 (Console)
3. Look for:
   ```
   [API] Using API_URL: https://budgeta-api.onrender.com/api
   ```

### Test 4: Registration
1. Go to registration page
2. Fill in form
3. Submit
4. Check console for successful API call
5. Should redirect to dashboard

---

## 🚀 Deployment Commands Reference

### Redeploy Frontend (Vercel):
```bash
# Via CLI
npm i -g vercel
vercel --prod

# Or use Vercel dashboard → Deployments → Redeploy
```

### Redeploy Backend (Render):
```bash
# Render auto-deploys on git push
git push origin main

# Or use Render dashboard → Manual Deploy
```

---

## 📊 Environment Variables Checklist

### Before Deploying:

**Frontend (Vercel/Netlify):**
- [ ] `VITE_API_URL` is set
- [ ] Points to production backend
- [ ] Includes `/api` suffix
- [ ] Uses HTTPS

**Backend (Render/Railway):**
- [ ] `DATABASE_URL` is set (Neon)
- [ ] `JWT_SECRET` is set (strong)
- [ ] `NODE_ENV=production`
- [ ] `CLIENT_URL` matches frontend
- [ ] `PORT` is set (usually 5001)

### After Deploying:

- [ ] Backend health endpoint works
- [ ] Frontend loads correctly
- [ ] Console shows correct API URL
- [ ] No CORS errors
- [ ] Registration works
- [ ] Login works
- [ ] Data persists

---

## 🎊 Success Indicators

### ✅ Everything Working When:

**Backend:**
- Health endpoint returns 200 OK
- No database connection errors
- CORS configured correctly
- All environment variables set

**Frontend:**
- Loads without errors
- Console shows production API URL
- No localhost references
- Registration/login works

**Integration:**
- API calls succeed
- Data saves to database
- User can register/login
- Dashboard loads with data

---

## 📚 Additional Resources

**Deployment Platforms:**
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Netlify: https://docs.netlify.com

**Neon Database:**
- Console: https://console.neon.tech
- Docs: https://neon.tech/docs

---

## 🆘 Still Having Issues?

### Get Help:

1. **Check deployment logs:**
   - Render/Railway: Click on service → Logs
   - Vercel/Netlify: Deployments → View logs

2. **Verify environment variables:**
   - Check they're set on platform (not just local .env)
   - Check for typos
   - Check URLs are correct

3. **Test API directly:**
   ```bash
   curl https://your-backend-url.com/health
   curl https://your-backend-url.com/api/auth/login
   ```

4. **Check browser console:**
   - Look for exact error messages
   - Check Network tab for failed requests
   - Verify API URL being used

---

## ✅ Quick Deployment Checklist

**Do this now:**

1. [ ] Deploy backend to Render/Railway
2. [ ] Get backend production URL
3. [ ] Set backend environment variables
4. [ ] Test backend health endpoint
5. [ ] Deploy frontend to Vercel/Netlify
6. [ ] Set frontend `VITE_API_URL` variable
7. [ ] Get frontend production URL
8. [ ] Update backend `CLIENT_URL`
9. [ ] Test registration
10. [ ] Celebrate! 🎉

---

**Your specific fix:**

1. **Find your deployed backend URL** (where did you deploy the server?)
2. **Go to your frontend deployment** (Vercel/Netlify)
3. **Add environment variable:**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
4. **Redeploy frontend**
5. **Test again!**

---

**Need the URLs? Check:**
- Render: https://dashboard.render.com
- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app/dashboard
- Netlify: https://app.netlify.com

