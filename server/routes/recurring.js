import express from 'express';
import sql from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all recurring payments for user
router.get('/', async (req, res) => {
  try {
    const payments = await sql`
      SELECT * FROM recurring_payments
      WHERE user_id = ${req.user.userId}
      ORDER BY next_date ASC
    `;
    res.json(payments);
  } catch (error) {
    console.error('Get recurring payments error:', error);
    res.status(500).json({ error: 'Failed to fetch recurring payments' });
  }
});

// Create recurring payment
router.post('/', async (req, res) => {
  try {
    const { name, amount, category, frequency, nextDate, isActive } = req.body;

    const result = await sql`
      INSERT INTO recurring_payments (user_id, name, amount, category, frequency, next_date, is_active)
      VALUES (
        ${req.user.userId}, 
        ${name}, 
        ${amount}, 
        ${category}, 
        ${frequency},
        ${nextDate},
        ${isActive !== undefined ? isActive : true}
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create recurring payment error:', error);
    res.status(500).json({ error: 'Failed to create recurring payment' });
  }
});

// Update recurring payment
router.put('/:id', async (req, res) => {
  try {
    const { name, amount, category, frequency, nextDate, isActive } = req.body;

    const result = await sql`
      UPDATE recurring_payments
      SET name = ${name},
          amount = ${amount},
          category = ${category},
          frequency = ${frequency},
          next_date = ${nextDate},
          is_active = ${isActive},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Recurring payment not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Update recurring payment error:', error);
    res.status(500).json({ error: 'Failed to update recurring payment' });
  }
});

// Delete recurring payment
router.delete('/:id', async (req, res) => {
  try {
    const result = await sql`
      DELETE FROM recurring_payments
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Recurring payment not found' });
    }

    res.json({ message: 'Recurring payment deleted successfully' });
  } catch (error) {
    console.error('Delete recurring payment error:', error);
    res.status(500).json({ error: 'Failed to delete recurring payment' });
  }
});

export default router;
