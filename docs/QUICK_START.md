# ⚡ Quick Start - Database Integration

## 🎯 Goal
Get your Budgeta app running with persistent database storage in **5 minutes**.

---

## 📝 Quick Setup Steps

### 1. **Install Backend Dependencies**
```bash
cd server
npm install
```

### 2. **Get Neon Database Connection**
1. Go to: https://neon.tech/
2. Sign up (free)
3. Create new project → Copy connection string

### 3. **Configure Backend**
```bash
# In server/ folder
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL=your_neon_connection_string_here
JWT_SECRET=generate_random_32_char_secret_here
PORT=5000
NODE_ENV=development
```

### 4. **Start Backend**
```bash
cd server
npm run dev
```

Should see: ✅ Database connected successfully

### 5. **Configure Frontend**
```bash
# In project root
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 6. **Start Frontend**
```bash
# In project root (new terminal)
npm run dev
```

### 7. **Test It!**
1. Open: http://localhost:3000
2. Register new account
3. Add data (account + transaction)
4. **Refresh page**
5. ✅ Data still there? **SUCCESS!**

---

## 🔍 Verify Database Connection

```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status":"ok","message":"Budgeta API is running"}
```

---

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in server/.env |
| Database connection failed | Check DATABASE_URL in server/.env |
| Frontend can't connect | Verify backend is running |
| Token expired | Logout and login again |

---

## 📁 File Structure

```
Budgeta-App/
├── server/              ← Backend API
│   ├── .env            ← Database config (YOU CREATE THIS)
│   ├── server.js       ← Main server file
│   ├── config/db.js    ← Database connection
│   ├── routes/         ← API endpoints
│   └── middleware/     ← Authentication
├── src/                ← Frontend
│   └── services/api.js ← API client
└── .env                ← Frontend config (YOU CREATE THIS)
```

---

## 🎉 What's Next?

After setup works:
1. Read full guide: `DATABASE_SETUP_GUIDE.md`
2. Explore API endpoints
3. Deploy to production

---

## 💡 Key Features

✅ **Persistent Storage** - Data saved in database  
✅ **Multi-User** - Each user has own data  
✅ **Secure** - JWT auth + password hashing  
✅ **Real-time** - Instant updates  
✅ **Scalable** - Production-ready

---

## 🆘 Need Help?

1. Check: `DATABASE_SETUP_GUIDE.md` (detailed guide)
2. Test endpoints: `curl http://localhost:5000/health`
3. Check logs: Look at terminal running backend
4. Verify .env files: Make sure both exist and are configured

---

**Ready? Let's go!** 🚀

```bash
cd server && npm install && npm run dev
```

Then in new terminal:
```bash
npm run dev
```
