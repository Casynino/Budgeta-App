# 🗄️ Database Setup Guide - Neon PostgreSQL Integration

## Overview

This guide will help you set up a **persistent Neon PostgreSQL database** for the Budgeta app, ensuring all user data (accounts, transactions, preferences) is saved and persists across sessions.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Node.js installed (v16 or higher)
- ✅ npm or yarn package manager
- ✅ A Neon account (free tier available)

---

## 🚀 Step-by-Step Setup

### **Step 1: Create Neon Database**

1. **Go to Neon**: https://neon.tech/
2. **Sign up/Login** to your account
3. **Create a new project**:
   - Click "New Project"
   - Give it a name (e.g., "Budgeta")
   - Select a region (choose closest to you)
   - Click "Create Project"

4. **Get Connection String**:
   - After creation, you'll see the connection details
   - Copy the **Connection String** (looks like):
     ```
     postgresql://[user]:[password]@[host]/[database]?sslmode=require
     ```
   - Save this - you'll need it soon!

---

### **Step 2: Set Up Backend Server**

#### **Install Backend Dependencies**

```bash
cd server
npm install
```

This will install:
- `express` - Web framework
- `@neondatabase/serverless` - Neon PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

#### **Configure Environment Variables**

1. **Create `.env` file** in `server/` folder:

```bash
cd server
cp .env.example .env
```

2. **Edit `.env` file** with your details:

```env
# Neon Database Connection (PASTE YOUR CONNECTION STRING HERE)
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# JWT Secret (Generate a random secure string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_abc123xyz

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

**Important:**
- Replace `DATABASE_URL` with your actual Neon connection string
- Generate a strong `JWT_SECRET` (random 32+ characters)
- Never commit `.env` file to version control!

---

### **Step 3: Start Backend Server**

```bash
cd server
npm run dev
```

**You should see:**
```
🚀 Starting Budgeta API Server...
✅ Database connected successfully: [timestamp]
📦 Initializing database tables...
✅ Database tables initialized successfully
✅ Server running on port 5000
📡 API URL: http://localhost:5000
🏥 Health check: http://localhost:5000/health

📚 Available endpoints:
   POST   /api/auth/register
   POST   /api/auth/login
   GET    /api/auth/me
   GET    /api/accounts
   POST   /api/accounts
   GET    /api/transactions
   POST   /api/transactions
   GET    /api/preferences
   PUT    /api/preferences

✨ Ready to accept requests!
```

**If you see this, your database is connected!** ✅

---

### **Step 4: Configure Frontend**

#### **Create Frontend Environment File**

1. **In project root** (not server folder):

```bash
cp .env.example .env
```

2. **Edit `.env` file**:

```env
VITE_API_URL=http://localhost:5000/api
```

#### **Install Any Missing Dependencies**

```bash
npm install
```

---

### **Step 5: Start Frontend**

In a **new terminal** (keep backend running):

```bash
npm run dev
```

**You should see:**
```
VITE v5.4.21  ready in 136 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

### **Step 6: Test the Integration**

1. **Open Browser**: http://localhost:3000
2. **Register a New Account**:
   - Click "Get Started"
   - Fill in email, password, name
   - Click "Register"
3. **Add Some Data**:
   - Create an account (e.g., "Chase Checking")
   - Add a transaction (income or expense)
4. **Refresh the Page** (Ctrl/Cmd + R)
5. **Verify Data Persists**: 
   - ✅ You should still be logged in
   - ✅ Your accounts should still be there
   - ✅ Your transactions should still be there

**If data persists after refresh, database integration is working!** 🎉

---

## 🗂️ Database Schema

The database automatically creates these tables:

### **1. users**
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password_hash
- first_name
- last_name
- created_at
- updated_at
```

### **2. accounts**
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- name
- type
- icon
- color
- currency
- initial_balance
- is_default
- created_at
- updated_at
```

### **3. transactions**
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- account_id (FOREIGN KEY → accounts.id)
- type (income/expense)
- amount
- category
- description
- date
- created_at
- updated_at
```

### **4. user_preferences**
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id, UNIQUE)
- mode (personal/business)
- base_currency
- display_currency
- theme
- created_at
- updated_at
```

All tables are created automatically when you start the server!

---

## 🔐 Security Features

✅ **Password Hashing**: Passwords are hashed with bcrypt (10 rounds)
✅ **JWT Authentication**: Secure token-based authentication
✅ **Token Expiration**: Tokens expire after 7 days
✅ **SQL Injection Protection**: Parameterized queries with Neon
✅ **CORS Protection**: Configured for localhost during development
✅ **Cascade Deletes**: When user deleted, all data automatically cleaned up

---

## 📡 API Endpoints

### **Authentication**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### **Accounts**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | Get all accounts |
| GET | `/api/accounts/:id` | Get single account |
| POST | `/api/accounts` | Create account |
| PUT | `/api/accounts/:id` | Update account |
| DELETE | `/api/accounts/:id` | Delete account |
| PATCH | `/api/accounts/:id/set-default` | Set as default |

### **Transactions**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/:id` | Get single transaction |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/stats/summary` | Get statistics |

### **Preferences**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/preferences` | Get user preferences |
| PUT | `/api/preferences` | Update preferences |

---

## 🧪 Testing the Database

### **Test 1: Registration**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

### **Test 2: Login**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### **Test 3: Create Account**

```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Chase Checking",
    "type": "bank",
    "icon": "🏦",
    "color": "#3b82f6",
    "currency": "USD",
    "initialBalance": 1000,
    "isDefault": true
  }'
```

---

## 🔧 Troubleshooting

### **Problem: "Database connection failed"**

**Solutions:**
1. Check DATABASE_URL in server/.env
2. Verify Neon database is active (check Neon dashboard)
3. Check internet connection
4. Ensure connection string includes `?sslmode=require`

### **Problem: "Port 5000 already in use"**

**Solutions:**
1. Change PORT in server/.env to different port (e.g., 5001)
2. Kill process using port 5000:
   ```bash
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID [PID_NUMBER] /F
   ```

### **Problem: "Cannot connect to API from frontend"**

**Solutions:**
1. Verify backend is running (http://localhost:5000/health)
2. Check VITE_API_URL in .env (project root)
3. Restart frontend server
4. Check browser console for errors

### **Problem: "Token expired" errors**

**Solution:**
- Logout and login again
- Token expires after 7 days (configurable in server/middleware/auth.js)

---

## 📊 Monitoring Your Database

### **Via Neon Dashboard**

1. Go to https://console.neon.tech/
2. Select your project
3. Click "SQL Editor"
4. Run queries to see your data:

```sql
-- See all users
SELECT * FROM users;

-- See all accounts
SELECT * FROM accounts;

-- See all transactions
SELECT * FROM transactions;

-- Count transactions by type
SELECT type, COUNT(*) as count, SUM(amount) as total
FROM transactions
GROUP BY type;
```

---

## 🚀 Next Steps

After successful setup:

1. **Migrate Existing Data** (if any)
   - Export from localStorage
   - Import via API endpoints

2. **Configure Production**
   - Set up production Neon database
   - Update environment variables
   - Deploy backend to Heroku/Render/Railway
   - Deploy frontend to Vercel/Netlify

3. **Add Features**
   - Email verification
   - Password reset
   - Data export/import
   - Backup/restore

---

## 📚 Additional Resources

- **Neon Docs**: https://neon.tech/docs/
- **Express.js**: https://expressjs.com/
- **JWT**: https://jwt.io/
- **PostgreSQL**: https://www.postgresql.org/docs/

---

## ✅ Success Checklist

- [ ] Neon database created
- [ ] Connection string obtained
- [ ] Backend `.env` configured
- [ ] Backend server starts without errors
- [ ] Database tables created automatically
- [ ] Frontend `.env` configured
- [ ] Frontend connects to backend
- [ ] Can register new user
- [ ] Can login
- [ ] Can create account
- [ ] Can add transaction
- [ ] **Data persists after page reload** ✨

---

## 🎉 Congratulations!

If you've completed all steps and data persists after reload, your database integration is complete! 

Your Budgeta app now has:
✅ Persistent data storage
✅ Secure authentication
✅ Multi-user support
✅ Real-time data synchronization
✅ Professional backend API

**Your app is now production-ready!** 🚀

