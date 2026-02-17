<?php
/**
 * Health Check Route
 * GET /api/health
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Only handle GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Método não permitido'], 405);
}

try {
    // Test database connection
    $result = dbQuery('SELECT 1 as test');
    
    if ($result) {
        jsonResponse([
            'status' => 'OK',
            'message' => 'API is running (PHP)',
            'timestamp' => date('Y-m-d H:i:s'),
            'database' => 'connected'
        ]);
    } else {
        jsonResponse(['error' => 'Database query failed'], 500);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => 'Health check failed', 'message' => $e->getMessage()], 500);
}

