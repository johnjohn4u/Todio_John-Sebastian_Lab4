require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Health Check
app.get('/api/health', (req, res) => {
  let dbStatus = 'unknown';
  try {
    // Pool exposes a `pool` object; check if we can get a ping function
    if (db && typeof db.query === 'function') dbStatus = 'available';
    else dbStatus = 'unavailable';
  } catch (e) {
    dbStatus = 'error';
  }
  res.json({ status: 'ok', db: dbStatus, time: new Date().toISOString() });
});

// basic error handler to avoid crashing on unhandled errors in routes
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'internal server error' });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', reportRoutes); // Added report routes

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
