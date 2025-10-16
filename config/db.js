const mysql = require('mysql2');

// Use a pool so the app can start even if DB is temporarily unavailable.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'lab_auth',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Try to acquire a connection once to log status but do NOT exit the process
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ DB connection failed (continuing without DB):', err.message);
    return;
  }
  console.log('✅ MySQL pool connected');
  connection.release();
});

module.exports = pool;
