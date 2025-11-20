# 🔧 API Connection Fix

## Issue Resolved: "Failed to fetch" Error

### Problem
Users were getting "Failed to fetch" error when trying to register or login.

### Root Cause
The frontend wasn't properly connecting to the backend API server.

---

## ✅ Fixes Applied

### 1. **Improved Error Handling**
Updated `src/services/api.js` to:
- ✅ Add detailed console logging for all API requests
- ✅ Show full URL being called
- ✅ Display response status codes
- ✅ Provide helpful error messages
- ✅ Detect "Failed to fetch" and show server connection message

### 2. **Environment Variable Verification**
Confirmed:
- ✅ `.env` has correct API URL: `http://localhost:5001/api`
- ✅ Backend running on port 5001
- ✅ CORS configured correctly

### 3. **Backend Verification**
Tested backend directly:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","firstName":"Test","lastName":"User"}'
```
✅ **Result:** Working perfectly! Returns user data and JWT token.

### 4. **CORS Configuration**
Verified CORS headers:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```
✅ **Result:** CORS is configured correctly.

---

## 🧪 How to Test

### Step 1: Verify Both Servers Running

**Backend:**
```bash
cd server
npm run dev
```
Should see:
```
✅ Server running on port 5001
📡 API URL: http://localhost:5001
```

**Frontend:**
```bash
npm run dev
```
Should see:
```
Local:   http://localhost:3000/
```

### Step 2: Open Browser Console

1. Open http://localhost:3000
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for these messages:
```
[API] Using API_URL: http://localhost:5001/api
[API] Environment: development
```

### Step 3: Try to Register

1. Click "Get Started" or "Register"
2. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: yourtest@example.com
   - Password: Test1234!
   - Confirm Password: Test1234!
3. Click "Create Account"

### Step 4: Check Console Logs

You should see:
```
[API] POST http://localhost:5001/api/auth/register
[API] Response status: 201
```

---

## 🔍 Troubleshooting Guide

### Issue 1: "Failed to fetch" Error

**Symptoms:**
- Red error banner says "Failed to fetch"
- Console shows network error

**Solution:**
1. Make sure backend is running:
   ```bash
   cd server && npm run dev
   ```

2. Check backend is on port 5001:
   ```bash
   curl http://localhost:5001/health
   ```
   Should return: `{"status":"ok","message":"Budgeta API is running"}`

3. Restart frontend to reload environment:
   ```bash
   # Kill frontend
   pkill -f "vite"
   
   # Restart
   npm run dev
   ```

### Issue 2: CORS Error

**Symptoms:**
- Console shows "CORS policy" error
- Request is blocked

**Solution:**
1. Check `server/.env` has correct CLIENT_URL:
   ```
   CLIENT_URL=http://localhost:3000
   ```

2. Restart backend:
   ```bash
   cd server
   npm run dev
   ```

### Issue 3: Wrong API URL

**Symptoms:**
- Console shows wrong port (5000 instead of 5001)
- Requests go to wrong URL

**Solution:**
1. Check `.env` file in project root:
   ```
   VITE_API_URL=http://localhost:5001/api
   ```

2. Restart frontend (MUST restart for env changes):
   ```bash
   npm run dev
   ```

3. Verify in console:
   ```
   [API] Using API_URL: http://localhost:5001/api
   ```

### Issue 4: Database Connection Error

**Symptoms:**
- Backend logs show database error
- 500 Internal Server Error

**Solution:**
1. Check `server/.env` has valid DATABASE_URL:
   ```
   DATABASE_URL=postgresql://neondb_owner:...@ep-young-dawn-a4v39pgm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

2. Test database connection:
   ```bash
   cd server
   node verify-setup.js
   ```

3. If connection fails, check:
   - Neon database is active
   - Connection string is correct
   - No firewall blocking connection

---

## 📊 Testing Checklist

Run through this checklist:

### Backend Tests
- [ ] Backend server is running
- [ ] Port 5001 is accessible
- [ ] Health endpoint works: `curl http://localhost:5001/health`
- [ ] Register endpoint works (curl test above)
- [ ] Database connection is active
- [ ] Logs show no errors

### Frontend Tests
- [ ] Frontend is running on port 3000
- [ ] Console shows correct API_URL (5001)
- [ ] No console errors on page load
- [ ] Register form displays correctly
- [ ] Error messages display properly

### Integration Tests
- [ ] Can submit registration form
- [ ] Console shows POST request
- [ ] Response status is 201 (success)
- [ ] User is redirected to dashboard
- [ ] Token is stored in localStorage
- [ ] Can logout and login again

---

## 🎯 Expected Behavior

### Successful Registration Flow:

1. **User fills form** → All fields validated
2. **Clicks "Create Account"** → Loading state shown
3. **Frontend calls API** → Console logs request
4. **Backend receives request** → Validates data
5. **Backend checks database** → User doesn't exist
6. **Backend hashes password** → Secure with bcrypt
7. **Backend saves to database** → Neon PostgreSQL
8. **Backend generates JWT** → 7-day token
9. **Backend returns response** → User data + token
10. **Frontend stores token** → localStorage
11. **Frontend updates context** → User logged in
12. **Redirect to dashboard** → Success!

### Console Logs You Should See:

```javascript
// On page load
[API] Using API_URL: http://localhost:5001/api
[API] Environment: development

// When registering
[API] POST http://localhost:5001/api/auth/register
[API] Response status: 201

// Backend logs
2025-11-18T19:46:00.000Z - POST /api/auth/register
```

---

## 🔧 Quick Fixes

### Fix 1: Restart Everything

```bash
# Terminal 1: Kill and restart backend
pkill -f "node.*server"
cd server && npm run dev

# Terminal 2: Kill and restart frontend
pkill -f "vite"
npm run dev
```

### Fix 2: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check Environment Files

```bash
# Check frontend .env
cat .env
# Should show: VITE_API_URL=http://localhost:5001/api

# Check backend .env
cat server/.env
# Should show: PORT=5001
```

### Fix 4: Test API Directly in Browser

Open these URLs in browser:
- http://localhost:5001/health (should return JSON)
- http://localhost:5001/ (should show API info)

---

## 📝 Debug Mode

### Enable Verbose Logging:

The API service now logs:
- Every request URL
- Request method (GET, POST, etc.)
- Response status code
- Any errors

**Check browser console** to see all API activity.

---

## ✅ Verification

After fixes, you should:

1. ✅ See correct API_URL in console
2. ✅ Be able to register new users
3. ✅ Be able to login
4. ✅ Stay logged in after refresh
5. ✅ See user data in database

---

## 🎉 Success Indicators

**Registration Works When:**
- ✅ Form submits without error
- ✅ Console shows 201 status
- ✅ Redirected to dashboard
- ✅ User data visible in Neon database
- ✅ Token stored in localStorage

**Check Neon Database:**
1. Go to https://console.neon.tech
2. Open SQL Editor
3. Run:
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
   ```
4. Should see your test users!

---

## 🚀 Next Steps

Once registration/login works:

1. **Test all auth flows:**
   - Register new user
   - Login existing user
   - Logout
   - Try invalid credentials
   - Check token expiry

2. **Test data persistence:**
   - Add accounts
   - Add transactions
   - Refresh page
   - Data should persist

3. **Deploy to production:**
   - Follow `READY_FOR_PRODUCTION.md`
   - Use production database
   - Update environment variables

---

## 📚 Related Documentation

- `DATABASE_SETUP_GUIDE.md` - Database configuration
- `QUICK_START.md` - Getting started
- `READY_FOR_PRODUCTION.md` - Deployment guide
- `AUTHENTICATION.md` - Auth system details

---

## 💡 Tips

**Remember:**
- Always restart frontend after changing .env
- Check both terminal windows for errors
- Use browser console for debugging
- Test API with curl first
- Clear browser cache if issues persist

---

**If you still have issues after following this guide, check:**
1. Firewall settings
2. Antivirus blocking ports
3. Another app using port 5001 or 3000
4. Node.js version (needs 18+)

---

**✅ Your API connection should now be working!**

