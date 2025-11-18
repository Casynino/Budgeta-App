import express from 'express';
import sql from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all accounts for user
router.get('/', async (req, res) => {
  try {
    const accounts = await sql`
      SELECT * FROM accounts
      WHERE user_id = ${req.user.userId}
      ORDER BY created_at ASC
    `;

    res.json(accounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Get single account
router.get('/:id', async (req, res) => {
  try {
    const accounts = await sql`
      SELECT * FROM accounts
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
    `;

    if (accounts.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(accounts[0]);
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// Create new account
router.post('/', async (req, res) => {
  try {
    const { name, type, icon, color, currency, initialBalance, isDefault } = req.body;

    // If this is set as default, remove default from other accounts
    if (isDefault) {
      await sql`
        UPDATE accounts
        SET is_default = false
        WHERE user_id = ${req.user.userId}
      `;
    }

    const result = await sql`
      INSERT INTO accounts (user_id, name, type, icon, color, currency, initial_balance, is_default)
      VALUES (
        ${req.user.userId},
        ${name},
        ${type},
        ${icon || ''},
        ${color || '#3b82f6'},
        ${currency || 'USD'},
        ${initialBalance || 0},
        ${isDefault || false}
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Update account
router.put('/:id', async (req, res) => {
  try {
    const { name, type, icon, color, currency, isDefault } = req.body;

    // Check if account belongs to user
    const existing = await sql`
      SELECT id FROM accounts
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
    `;

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // If setting as default, remove default from other accounts
    if (isDefault) {
      await sql`
        UPDATE accounts
        SET is_default = false
        WHERE user_id = ${req.user.userId} AND id != ${req.params.id}
      `;
    }

    const result = await sql`
      UPDATE accounts
      SET
        name = COALESCE(${name}, name),
        type = COALESCE(${type}, type),
        icon = COALESCE(${icon}, icon),
        color = COALESCE(${color}, color),
        currency = COALESCE(${currency}, currency),
        is_default = COALESCE(${isDefault}, is_default),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING *
    `;

    res.json(result[0]);
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

// Delete account
router.delete('/:id', async (req, res) => {
  try {
    // Check if account belongs to user
    const existing = await sql`
      SELECT id FROM accounts
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
    `;

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Delete account (transactions will be cascade deleted)
    await sql`
      DELETE FROM accounts
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
    `;

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Set default account
router.patch('/:id/set-default', async (req, res) => {
  try {
    // Check if account belongs to user
    const existing = await sql`
      SELECT id FROM accounts
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
    `;

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Remove default from all accounts
    await sql`
      UPDATE accounts
      SET is_default = false
      WHERE user_id = ${req.user.userId}
    `;

    // Set this account as default
    const result = await sql`
      UPDATE accounts
      SET is_default = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING *
    `;

    res.json(result[0]);
  } catch (error) {
    console.error('Set default account error:', error);
    res.status(500).json({ error: 'Failed to set default account' });
  }
});

export default router;
