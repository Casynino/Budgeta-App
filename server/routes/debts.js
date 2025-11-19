import express from 'express';
import sql from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all debts for user
router.get('/', async (req, res) => {
  try {
    const debts = await sql`
      SELECT * FROM debts
      WHERE user_id = ${req.user.userId}
      ORDER BY created_at DESC
    `;
    res.json(debts);
  } catch (error) {
    console.error('Get debts error:', error);
    res.status(500).json({ error: 'Failed to fetch debts' });
  }
});

// Create debt
router.post('/', async (req, res) => {
  try {
    const { type, name, totalAmount, remainingAmount, interestRate, dueDate } = req.body;

    const result = await sql`
      INSERT INTO debts (user_id, type, name, total_amount, remaining_amount, interest_rate, due_date)
      VALUES (
        ${req.user.userId}, 
        ${type}, 
        ${name}, 
        ${totalAmount}, 
        ${remainingAmount || totalAmount}, 
        ${interestRate || 0},
        ${dueDate || null}
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create debt error:', error);
    res.status(500).json({ error: 'Failed to create debt' });
  }
});

// Update debt
router.put('/:id', async (req, res) => {
  try {
    const { type, name, totalAmount, remainingAmount, interestRate, dueDate } = req.body;

    const result = await sql`
      UPDATE debts
      SET type = ${type},
          name = ${name},
          total_amount = ${totalAmount},
          remaining_amount = ${remainingAmount},
          interest_rate = ${interestRate},
          due_date = ${dueDate},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Debt not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Update debt error:', error);
    res.status(500).json({ error: 'Failed to update debt' });
  }
});

// Delete debt
router.delete('/:id', async (req, res) => {
  try {
    const result = await sql`
      DELETE FROM debts
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Debt not found' });
    }

    res.json({ message: 'Debt deleted successfully' });
  } catch (error) {
    console.error('Delete debt error:', error);
    res.status(500).json({ error: 'Failed to delete debt' });
  }
});

export default router;
