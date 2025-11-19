import express from 'express';
import sql from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all investments for user
router.get('/', async (req, res) => {
  try {
    const investments = await sql`
      SELECT * FROM investments
      WHERE user_id = ${req.user.userId}
      ORDER BY created_at DESC
    `;
    res.json(investments);
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// Create investment
router.post('/', async (req, res) => {
  try {
    const { name, type, amount, currentValue, returnRate } = req.body;

    const result = await sql`
      INSERT INTO investments (user_id, name, type, amount, current_value, return_rate)
      VALUES (
        ${req.user.userId}, 
        ${name}, 
        ${type}, 
        ${amount}, 
        ${currentValue || amount},
        ${returnRate || 0}
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Failed to create investment' });
  }
});

// Update investment
router.put('/:id', async (req, res) => {
  try {
    const { name, type, amount, currentValue, returnRate } = req.body;

    const result = await sql`
      UPDATE investments
      SET name = ${name},
          type = ${type},
          amount = ${amount},
          current_value = ${currentValue},
          return_rate = ${returnRate},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({ error: 'Failed to update investment' });
  }
});

// Delete investment
router.delete('/:id', async (req, res) => {
  try {
    const result = await sql`
      DELETE FROM investments
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Delete investment error:', error);
    res.status(500).json({ error: 'Failed to delete investment' });
  }
});

export default router;
