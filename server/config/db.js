import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Create Neon SQL connection
const sql = neon(process.env.DATABASE_URL);

// Test database connection
export const testConnection = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected successfully:', result[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
export const initDatabase = async () => {
  try {
    console.log('📦 Initializing database tables...');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create accounts table
    await sql`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        icon VARCHAR(50),
        color VARCHAR(20),
        currency VARCHAR(10) DEFAULT 'USD',
        initial_balance DECIMAL(15, 2) DEFAULT 0,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create user_preferences table
    await sql`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        mode VARCHAR(20) DEFAULT 'personal',
        base_currency VARCHAR(10) DEFAULT 'TZS',
        display_currency VARCHAR(10) DEFAULT 'TZS',
        theme VARCHAR(20) DEFAULT 'dark',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create budgets table
    await sql`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        spent DECIMAL(15, 2) DEFAULT 0,
        period VARCHAR(20) DEFAULT 'monthly',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create debts table
    await sql`
      CREATE TABLE IF NOT EXISTS debts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        name VARCHAR(100) NOT NULL,
        total_amount DECIMAL(15, 2) NOT NULL,
        remaining_amount DECIMAL(15, 2) NOT NULL,
        interest_rate DECIMAL(5, 2) DEFAULT 0,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create investments table
    await sql`
      CREATE TABLE IF NOT EXISTS investments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        current_value DECIMAL(15, 2) NOT NULL,
        return_rate DECIMAL(5, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create recurring_payments table
    await sql`
      CREATE TABLE IF NOT EXISTS recurring_payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        frequency VARCHAR(20) NOT NULL,
        next_date DATE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create goals table
    await sql`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        target_amount DECIMAL(15, 2) NOT NULL,
        current_amount DECIMAL(15, 2) DEFAULT 0,
        deadline DATE,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better query performance
    // CRITICAL: Index on users.email for fast login lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_recurring_payments_user_id ON recurring_payments(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id)
    `;

    console.log('✅ Database tables initialized successfully');
    console.log('   - users, accounts, transactions');
    console.log('   - budgets, debts, investments');
    console.log('   - recurring_payments, goals');
    console.log('   - user_preferences');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

export default sql;
