const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const STATUSES = ['new', 'in_progress', 'closed'];

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const okUser = safeEqual(username || '', process.env.ADMIN_USER);
  const okPass = safeEqual(password || '', process.env.ADMIN_PASSWORD);

  if (!(okUser && okPass)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

router.get('/enquiries', requireAdmin, async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const where = [];
    const values = [];

    if (status) {
      values.push(status);
      where.push(`status = $${values.length}`);
    }
    if (type) {
      values.push(type);
      where.push(`type = $${values.length}`);
    }

    const sql = `SELECT * FROM enquiries
                 ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
                 ORDER BY created_at DESC LIMIT 200`;
    const { rows } = await pool.query(sql, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/stats', requireAdmin, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT status, COUNT(*)::int AS count FROM enquiries GROUP BY status'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.patch('/enquiries/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};

    if (!Number.isInteger(id) || !STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid id or status' });
    }

    const { rows } = await pool.query(
      'UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;