<?php
/**
 * Configurações Principais da API
 */

// Carregar configurações do banco de dados
require_once __DIR__ . '/database.php';

/**
 * Configurações de CORS
 */
function setCorsHeaders() {
    $origins = explode(',', CORS_ORIGINS);
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Allow requests with no origin
    if (empty($origin)) {
        header('Access-Control-Allow-Origin: *');
    } elseif (in_array(trim($origin), $origins) || in_array('*', $origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
    }
    
    // Allow methods
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    
    // Handle preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

/**
 * Configurações de segurança
 */
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}

/**
 * Função para responder com JSON
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Função para resposta de erro
 */
function errorResponse($message, $statusCode = 500, $details = null) {
    $response = ['error' => $message];
    if ($details !== null && DEBUG_MODE) {
        $response['details'] = $details;
    }
    jsonResponse($response, $statusCode);
}

/**
 * Função para resposta de sucesso
 */
function successResponse($message, $data = null) {
    $response = ['message' => $message];
    if ($data !== null) {
        $response = array_merge($response, $data);
    }
    jsonResponse($response, 200);
}

/**
 * Função para validar dados recebidos
 */
function validateRequired($data, $fields) {
    $missing = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $missing[] = $field;
        }
    }
    if (!empty($missing)) {
        errorResponse('Campos obrigatórios faltando: ' . implode(', ', $missing), 400);
    }
    return true;
}

/**
 * Obter input como array
 */
function getJsonInput() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        errorResponse('JSON inválido', 400);
    }
    return $data ?? [];
}

