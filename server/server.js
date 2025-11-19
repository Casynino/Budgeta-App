import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, initDatabase } from './config/db.js';
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/accounts.js';
import transactionRoutes from './routes/transactions.js';
import preferenceRoutes from './routes/preferences.js';
import budgetRoutes from './routes/budgets.js';
import debtRoutes from './routes/debts.js';
import investmentRoutes from './routes/investments.js';
import recurringRoutes from './routes/recurring.js';
import goalRoutes from './routes/goals.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000', // Development
  'http://localhost:5173', // Vite dev server alternative
  /^https:\/\/.*\.vercel\.app$/, // All Vercel deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed origins (string or regex)
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`⚠️  CORS blocked request from origin: ${origin}`);
      console.log(`✅ Allowed origins:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false, // Changed to false - we use Bearer tokens, not cookies (mobile-friendly)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours - reduce preflight requests on mobile
}));

console.log(`🔒 CORS enabled for: ${allowedOrigins.join(', ')}`);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/goals', goalRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Budgeta API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Budgeta API',
    version: '2.0.0',
    description: 'Production-ready backend - all data stored in database',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      accounts: '/api/accounts',
      transactions: '/api/transactions',
      preferences: '/api/preferences',
      budgets: '/api/budgets',
      debts: '/api/debts',
      investments: '/api/investments',
      recurring: '/api/recurring',
      goals: '/api/goals',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Budgeta API Server...');

    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Initialize database tables
    await initDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log('\n📚 Available endpoints:');
      console.log('   Authentication:');
      console.log('     POST   /api/auth/register');
      console.log('     POST   /api/auth/login');
      console.log('     GET    /api/auth/me');
      console.log('   Core Data:');
      console.log('     CRUD   /api/accounts');
      console.log('     CRUD   /api/transactions');
      console.log('   Financial Management:');
      console.log('     CRUD   /api/budgets');
      console.log('     CRUD   /api/debts');
      console.log('     CRUD   /api/investments');
      console.log('     CRUD   /api/recurring');
      console.log('     CRUD   /api/goals');
      console.log('   Settings:');
      console.log('     GET/PUT /api/preferences');
      console.log('\n✨ Production-ready: All data stored in database (no localStorage)');
      console.log('✨ Ready to accept requests!');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();
