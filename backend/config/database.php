<?php
/**
 * Configurações do Banco de Dados
 * Usando PDO para conexão MySQL
 */

// Configurações do banco de dados
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'webside_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASSWORD') ?: '');
define('DB_CHARSET', 'utf8mb4');

// Configurações da API
define('API_PORT', getenv('PORT') ?: 5000);
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production');
define('JWT_EXPIRY', 86400); // 24 hours in seconds

// Configurações de CORS
define('CORS_ORIGINS', getenv('CORS_ORIGINS') ?: 'http://localhost:5173,http://localhost:3000,http://localhost:8080,http://127.0.0.1:8080');

// Modo de desenvolvimento
define('DEBUG_MODE', getenv('NODE_ENV') !== 'production');

// Configurações de segurança
define('RATE_LIMIT_REQUESTS', 100); // por minuto
define('RATE_LIMIT_AUTH_REQUESTS', 10); // por minuto

/**
 * Função para obter conexão PDO
 */
function getDBConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_PERSISTENT => true,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Database connection error: " . $e->getMessage());
            if (DEBUG_MODE) {
                die(json_encode(['error' => 'Erro de conexão com o banco de dados', 'details' => $e->getMessage()]));
            } else {
                die(json_encode(['error' => 'Erro de conexão com o banco de dados']));
            }
        }
    }
    
    return $pdo;
}

/**
 * Função para executar query simples
 */
function dbExecute($sql, $params = []) {
    $pdo = getDBConnection();
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        error_log("Database query error: " . $e->getMessage());
        throw $e;
    }
}

/**
 * Função para executar query SELECT e retornar todas as linhas
 */
function dbQuery($sql, $params = []) {
    $stmt = dbExecute($sql, $params);
    return $stmt->fetchAll();
}

/**
 * Função para executar query SELECT e retornar uma linha
 */
function dbQueryOne($sql, $params = []) {
    $stmt = dbExecute($sql, $params);
    return $stmt->fetch();
}

/**
 * Função para obter o último ID inserido
 */
function dbLastInsertId() {
    return getDBConnection()->lastInsertId();
}

