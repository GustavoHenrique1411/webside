const mysql = require('mysql2/promise');

async function healthCheck() {
  try {
    // Test database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'webside',
      connectTimeout: 5000
    });

    await connection.execute('SELECT 1');
    await connection.end();

    console.log('Health check passed');
    process.exit(0);
  } catch (error) {
    console.error('Health check failed:', error.message);
    process.exit(1);
  }
}

healthCheck();
