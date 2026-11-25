const express = require('express');
const pool = require('../db');

const router = express.Router();
const TYPES = ['quote', 'raw_wood', 'deal', 'consultation', 'other'];
const str = (v) => (typeof v === 'string' ? v.trim() : '');

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const name = str(body.name);
    const company = str(body.company);
    const email = str(body.email);
    const phone = str(body.phone);
    const message = str(body.message);
    const type = str(body.type);
    const language = body.language === 'ar' ? 'ar' : 'en';

    if (!name || !message || !TYPES.includes(type)) {
      return res.status(400).json({ error: 'Name, message and a valid type are required' });
    }
    if (!email && !phone) {
      return res.status(400).json({ error: 'Please provide an email or a phone number' });
    }
    if (name.length > 200 || message.length > 5000) {
      return res.status(400).json({ error: 'Input too long' });
    }

    const { rows } = await pool.query(
      `INSERT INTO enquiries (name, company, email, phone, type, message, language)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [name, company || null, email || null, phone || null, type, message, language]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;