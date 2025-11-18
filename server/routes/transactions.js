import express from 'express';
import sql from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all transactions for user
router.get('/', async (req, res) => {
  try {
    const { accountId, startDate, endDate, type, category } = req.query;

    let query = sql`
      SELECT t.*, a.name as account_name, a.icon as account_icon, a.color as account_color
      FROM transactions t
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.user_id = ${req.user.userId}
    `;

    // Add filters if provided
    if (accountId) {
      query = sql`${query} AND t.account_id = ${accountId}`;
    }
    if (startDate) {
      query = sql`${query} AND t.date >= ${startDate}`;
    }
    if (endDate) {
      query = sql`${query} AND t.date <= ${endDate}`;
    }
    if (type) {
      query = sql`${query} AND t.type = ${type}`;
    }
    if (category) {
      query = sql`${query} AND t.category = ${category}`;
    }

    const transactions = await sql`${query} ORDER BY t.date DESC, t.created_at DESC`;

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const transactions = await sql`
      SELECT t.*, a.name as account_name, a.icon as account_icon, a.color as account_color
      FROM transactions t
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.id = ${req.params.id} AND t.user_id = ${req.user.userId}
    `;

    if (transactions.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transactions[0]);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const { accountId, type, amount, category, description, date } = req.body;

    // Validate required fields
    if (!accountId || !type || !amount || !category || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify account belongs to user
    const accounts = await sql`
      SELECT id FROM accounts
      WHERE id = ${accountId} AND user_id = ${req.user.userId}
    `;

    if (accounts.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const result = await sql`
      INSERT INTO transactions (user_id, account_id, type, amount, category, description, date)
      VALUES (
        ${req.user.userId},
        ${accountId},
        ${type},
        ${amount},
        ${category},
        ${description || ''},
        ${date}
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { accountId, type, amount, category, description, date } = req.body;

    // Check if transaction belongs to user
    const existing = await sql`
      SELECT id FROM transactions
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
    `;

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // If updating account, verify it belongs to user
    if (accountId) {
      const accounts = await sql`
        SELECT id FROM accounts
        WHERE id = ${accountId} AND user_id = ${req.user.userId}
      `;

      if (accounts.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
    }

    const result = await sql`
      UPDATE transactions
      SET
        account_id = COALESCE(${accountId}, account_id),
        type = COALESCE(${type}, type),
        amount = COALESCE(${amount}, amount),
        category = COALESCE(${category}, category),
        description = COALESCE(${description}, description),
        date = COALESCE(${date}, date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING *
    `;

    res.json(result[0]);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    // Check if transaction belongs to user
    const existing = await sql`
      SELECT id FROM transactions
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
    `;

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await sql`
      DELETE FROM transactions
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
    `;

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Get transaction statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate, accountId } = req.query;

    let whereClause = sql`WHERE user_id = ${req.user.userId}`;

    if (startDate) {
      whereClause = sql`${whereClause} AND date >= ${startDate}`;
    }
    if (endDate) {
      whereClause = sql`${whereClause} AND date <= ${endDate}`;
    }
    if (accountId) {
      whereClause = sql`${whereClause} AND account_id = ${accountId}`;
    }

    const stats = await sql`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COUNT(*) as transaction_count
      FROM transactions
      ${whereClause}
    `;

    res.json(stats[0]);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
