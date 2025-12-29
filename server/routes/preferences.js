import express from 'express';
import sql from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user preferences
router.get('/', async (req, res) => {
  try {
    const prefs = await sql`
      SELECT * FROM user_preferences
      WHERE user_id = ${req.user.userId}
    `;

    if (prefs.length === 0) {
      // Create default preferences if they don't exist
      const result = await sql`
        INSERT INTO user_preferences (user_id, mode, base_currency, display_currency, theme)
        VALUES (${req.user.userId}, 'personal', 'TZS', 'TZS', 'dark')
        RETURNING *
      `;
      return res.json(result[0]);
    }

    res.json(prefs[0]);
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update user preferences
router.put('/', async (req, res) => {
  try {
    const { mode, baseCurrency, displayCurrency, theme } = req.body;

    // Check if preferences exist
    const existing = await sql`
      SELECT id FROM user_preferences
      WHERE user_id = ${req.user.userId}
    `;

    let result;

    if (existing.length === 0) {
      // Create new preferences
      result = await sql`
        INSERT INTO user_preferences (user_id, mode, base_currency, display_currency, theme)
        VALUES (
          ${req.user.userId},
          ${mode || 'personal'},
          ${baseCurrency || 'TZS'},
          ${displayCurrency || 'TZS'},
          ${theme || 'dark'}
        )
        RETURNING *
      `;
    } else {
      // Update existing preferences
      result = await sql`
        UPDATE user_preferences
        SET
          mode = COALESCE(${mode}, mode),
          base_currency = COALESCE(${baseCurrency}, base_currency),
          display_currency = COALESCE(${displayCurrency}, display_currency),
          theme = COALESCE(${theme}, theme),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${req.user.userId}
        RETURNING *
      `;
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;
