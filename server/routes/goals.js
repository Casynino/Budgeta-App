import express from 'express';
import sql from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all goals for user
router.get('/', async (req, res) => {
  try {
    const goals = await sql`
      SELECT * FROM goals
      WHERE user_id = ${req.user.userId}
      ORDER BY created_at DESC
    `;
    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Create goal
router.post('/', async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, category } = req.body;

    const result = await sql`
      INSERT INTO goals (user_id, name, target_amount, current_amount, deadline, category)
      VALUES (
        ${req.user.userId}, 
        ${name}, 
        ${targetAmount}, 
        ${currentAmount || 0},
        ${deadline || null},
        ${category || null}
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update goal
router.put('/:id', async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, category } = req.body;

    const result = await sql`
      UPDATE goals
      SET name = ${name},
          target_amount = ${targetAmount},
          current_amount = ${currentAmount},
          deadline = ${deadline},
          category = ${category},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete goal
router.delete('/:id', async (req, res) => {
  try {
    const result = await sql`
      DELETE FROM goals
      WHERE id = ${req.params.id} AND user_id = ${req.user.userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;
