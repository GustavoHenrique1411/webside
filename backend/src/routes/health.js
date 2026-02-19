const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Health check - no auth required
router.get('/', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

module.exports = router;

