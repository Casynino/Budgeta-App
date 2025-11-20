# 🚀 Vercel Deployment Guide (Frontend)

## Step-by-Step: Deploy Frontend to Vercel

### Prerequisites:
- ✅ Backend already deployed (Render/Railway/etc.)
- ✅ Backend URL ready (e.g., `https://budgeta-api.onrender.com`)

---

## 📋 Steps

### 1. Go to Vercel
**URL:** https://vercel.com

Click **"Add New..."** → **"Project"**

---

### 2. Import Repository

1. Click **"Import Git Repository"**
2. Find **"Budgeta-App"** in the list
3. Click **"Import"**

If you don't see it:
- Click **"Adjust GitHub App Permissions"**
- Select your repository
- Come back and import

---

### 3. Configure Project

**Framework Preset:** Vite (auto-detected)

**Root Directory:** `./` (leave as default)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

**DO NOT CLICK DEPLOY YET!** ⚠️

---

### 4. Add Environment Variable (CRITICAL!)

**Before deploying**, scroll down to **"Environment Variables"**

Click **"Add"** or expand the section

**Add this variable:**

```
Name:  VITE_API_URL
Value: https://your-backend-url.onrender.com/api
```

**IMPORTANT:**
- ✅ Must start with `VITE_` (Vite requirement)
- ✅ Use YOUR backend URL (not example URL)
- ✅ Must include `/api` at the end
- ✅ Must be HTTPS (not HTTP)
- ✅ No trailing slash after `/api`

**Example correct values:**
```
https://budgeta-api.onrender.com/api
https://budgeta-api.up.railway.app/api
https://budgeta-backend.herokuapp.com/api
```

**Example WRONG values:**
```
❌ http://localhost:5001/api          (localhost)
❌ https://budgeta-api.onrender.com   (missing /api)
❌ https://budgeta-api.onrender.com/api/ (trailing slash)
```

**Select environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

### 5. Deploy!

Click **"Deploy"**

**Wait 1-3 minutes...**

You'll see:
- Building...
- Assigning domain...
- Deploying...
- **Success! ✅**

---

### 6. Get Your Frontend URL

After deployment:
- Copy your URL: `https://budgeta-app.vercel.app`
  (Your actual URL will be different)

---

### 7. Update Backend CORS

**Now go to your backend deployment:**

#### If on Render:
1. Go to https://dashboard.render.com
2. Click your backend service
3. Click **"Environment"**
4. Find `CLIENT_URL` variable (or add it)
5. Set value to: `https://budgeta-app.vercel.app`
   (Use YOUR Vercel URL)
6. Click **"Save Changes"**
7. Wait for auto-redeploy (2-3 min)

#### If on Railway:
1. Go to https://railway.app/dashboard
2. Click your backend service
3. Click **"Variables"**
4. Find or add `CLIENT_URL`
5. Set to: `https://budgeta-app.vercel.app`
6. Redeploy if needed

---

### 8. Test Your Deployment

#### Test 1: Open Your App
```
https://budgeta-app.vercel.app
```
(Use YOUR URL)

Should load without errors!

#### Test 2: Check Console
1. Press **F12** (Developer Tools)
2. Go to **Console** tab
3. Look for:
   ```
   [API] Using API_URL: https://budgeta-api.onrender.com/api
   ```
4. Should NOT say "localhost"! ✅

#### Test 3: Try Registration
1. Click **"Get Started"** or **"Register"**
2. Fill in form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test1234!
3. Click **"Create Account"**
4. Should work! ✅

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to server"

**Cause:** Environment variable not set or wrong

**Fix:**
1. Go to Vercel dashboard
2. Click your project
3. Click **"Settings"** → **"Environment Variables"**
4. Check `VITE_API_URL` is there
5. Check the value is correct
6. If missing or wrong, add/fix it
7. Go to **"Deployments"** tab
8. Click **"..."** on latest deployment
9. Click **"Redeploy"**
10. Wait 1-2 minutes

### Issue: "CORS policy error"

**Cause:** Backend doesn't allow your frontend URL

**Fix:**
1. Go to backend deployment (Render/Railway)
2. Check `CLIENT_URL` environment variable
3. Must match your Vercel URL exactly
4. Example: `https://budgeta-app.vercel.app`
5. No trailing slash!
6. Update and redeploy backend

### Issue: Still showing localhost

**Cause:** Environment variable not loaded

**Fix:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Try incognito window
4. Check console for actual API URL being used

### Issue: Build failed

**Cause:** Missing dependencies or build errors

**Fix:**
1. Check build logs in Vercel
2. Look for error messages
3. Make sure `package.json` is correct
4. Try building locally first:
   ```bash
   npm run build
   ```

---

## 📊 Environment Variables Reference

### What to Add in Vercel:

**Required:**
```
VITE_API_URL=https://your-backend-url.com/api
```

**Optional (if you have):**
```
VITE_APP_NAME=Budgeta
VITE_APP_VERSION=1.0.0
```

**Remember:**
- All Vite env vars must start with `VITE_`
- Set them BEFORE first deployment
- Or redeploy after adding them

---

## 🎯 Vercel Features

### Custom Domain:
1. Click **"Settings"** → **"Domains"**
2. Add your domain (e.g., `budgeta.com`)
3. Follow DNS instructions

### Preview Deployments:
- Every git push creates a preview
- Test before going to production
- Automatic!

### Analytics:
- Click **"Analytics"** tab
- See visitor stats
- Performance metrics

### Logs:
- Click **"Deployments"**
- Click deployment
- See build and runtime logs

---

## 🚀 Redeploy After Changes

### When to Redeploy:

**You MUST redeploy when you:**
- ✅ Change environment variables
- ✅ Update code (auto-deploys on git push)
- ✅ Fix configuration
- ✅ Change build settings

### How to Redeploy:

**Option 1: Git Push (Automatic)**
```bash
git add .
git commit -m "Update"
git push origin main
```
Vercel auto-deploys!

**Option 2: Manual Redeploy**
1. Go to Vercel dashboard
2. Click project
3. Click **"Deployments"**
4. Click **"..."** on latest
5. Click **"Redeploy"**

---

## ✅ Success Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] No console errors
- [ ] API URL is production (not localhost)
- [ ] Registration works
- [ ] Login works
- [ ] Data persists
- [ ] No CORS errors
- [ ] Backend connection successful

---

## 🎊 You're Done!

Your Budgeta app is now live on Vercel!

**Your URLs:**
```
Frontend: https://budgeta-app.vercel.app
Backend:  https://budgeta-api.onrender.com
API:      https://budgeta-api.onrender.com/api
```

**Share your app:**
- Send the Vercel URL to users
- Add to your portfolio
- Test on different devices

---

## 📚 Next Steps

### Recommended:

1. **Add Custom Domain**
   - Buy a domain (budgeta.com)
   - Add to Vercel
   - Professional look!

2. **Set up Analytics**
   - Track visitors
   - Monitor performance
   - Understand users

3. **Enable Preview Deployments**
   - Test changes before production
   - Automatic on pull requests

4. **Add README**
   - Document your project
   - Add live demo link
   - Show screenshots

---

## 🔗 Useful Links

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**Your Project:**
- Settings: `https://vercel.com/[your-username]/budgeta-app/settings`
- Deployments: `https://vercel.com/[your-username]/budgeta-app/deployments`
- Analytics: `https://vercel.com/[your-username]/budgeta-app/analytics`

---

## 💡 Pro Tips

1. **Use Preview URLs** for testing
2. **Set up GitHub integration** for auto-deploy
3. **Add environment variables** before first deploy
4. **Use Vercel CLI** for advanced features
5. **Monitor build times** in analytics

---

**Congratulations! Your Budgeta app is now live! 🎉**

