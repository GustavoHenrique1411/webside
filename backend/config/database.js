const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'webside_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

console.log('Database Configuration:');
console.log(`  Host: ${dbConfig.host}`);
console.log(`  User: ${dbConfig.user}`);
console.log(`  Database: ${dbConfig.database}`);
console.log(`  Password: ${dbConfig.password ? '***' : '(empty)'}`);

const pool = mysql.createPool(dbConfig);

// Test connection on startup with retry logic
const testConnection = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('✓ Database connected successfully');
      connection.release();
      return true;
    } catch (error) {
      console.error(`✗ Database connection attempt ${i + 1}/${retries} failed:`, error.message);
      
      if (i === retries - 1) {
        console.error('\n========================================');
        console.error('DATABASE CONNECTION FAILED');
        console.error('========================================');
        console.error('Please ensure:');
        console.error('1. MySQL is running (check with: docker-compose -f docker-compose.dev.yml ps)');
        console.error('2. Database credentials in .env file are correct');
        console.error('3. Database "' + dbConfig.database + '" exists');
        console.error('\nTo start MySQL with Docker, run:');
        console.error('  docker-compose -f docker-compose.dev.yml up -d');
        console.error('========================================\n');
        return false;
      }
      
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};

testConnection();

module.exports = pool;
