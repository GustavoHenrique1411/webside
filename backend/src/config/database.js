const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '162.241.2.103',
  user: process.env.DB_USER || 'websid23_dev',
  password: process.env.DB_PASSWORD || 'Web@132435*',
  database: process.env.DB_NAME || 'websid23_erp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

