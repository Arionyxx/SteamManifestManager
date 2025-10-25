import pool from '../db/config.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { username, password, adminSecret } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    // Check if username already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role - admin if correct secret provided
    const isAdmin = adminSecret === process.env.ADMIN_SECRET;
    const role = isAdmin ? 'admin' : 'user';

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
      [username, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        user: { id: user.id, username: user.username, role: user.role },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        user: { id: user.id, username: user.username, role: user.role },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, role, created_at, username_changed_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ success: false, error: 'New username required' });
    }

    // Get current user data
    const userResult = await pool.query(
      'SELECT username_changed_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = userResult.rows[0];
    const lastChanged = user.username_changed_at ? new Date(user.username_changed_at) : null;
    const now = new Date();

    // Check if 30 days have passed since last change
    if (lastChanged) {
      const daysSinceLastChange = (now - lastChanged) / (1000 * 60 * 60 * 24);
      if (daysSinceLastChange < 30) {
        const daysRemaining = Math.ceil(30 - daysSinceLastChange);
        return res.status(400).json({
          success: false,
          error: `You can change your username again in ${daysRemaining} days`
        });
      }
    }

    // Check if new username already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND id != $2',
      [newUsername, req.user.id]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Username already taken' });
    }

    // Update username
    const result = await pool.query(
      'UPDATE users SET username = $1, username_changed_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, role, created_at, username_changed_at',
      [newUsername, req.user.id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current and new password required' });
    }

    // Get current user
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = result.rows[0];

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
