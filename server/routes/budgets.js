import express from 'express';
import sql from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all budgets for user
router.get('/', async (req, res) => {
  try {
    const budgets = await sql`
      SELECT * FROM budgets
      WHERE user_id = ${req.user.userId}
      ORDER BY created_at DESC
    `;
    res.json(budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Create budget
router.post('/', async (req, res) => {
  try {
    const { category, amount, spent, period } = req.body;

    const result = await sql`
      INSERT INTO budgets (user_id, category, amount, spent, period)
      VALUES (${req.user.userId}, ${category}, ${amount}, ${spent || 0}, ${period || 'monthly'})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const { category, amount, spent, period } = req.body;

    const result = await sql`
      UPDATE budgets
      SET category = ${category}, 
          amount = ${amount}, 
          spent = ${spent},
          period = ${period},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const result = await sql`
      DELETE FROM budgets
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

export default router;
