const express = require('express');
const rateLimit = require('express-rate-limit');
const enquiriesRouter = require('./routes/enquiries');
const adminRouter = require('./routes/admin');

const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'ADMIN_USER', 'ADMIN_PASSWORD', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error('Missing environment variables: ' + missing.join(', '));
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '50kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/enquiries', limiter, enquiriesRouter);
app.use('/api/admin/login', limiter);
app.use('/api/admin', adminRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.API_PORT || 3000;
app.listen(port, () => console.log('API listening on port ' + port));