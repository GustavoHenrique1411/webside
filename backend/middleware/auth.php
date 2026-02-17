<?php
/**
 * Middleware de Autenticação JWT
 */

require_once __DIR__ . '/../config/database.php';

/**
 * Criar token JWT
 */
function createJWT($payload) {
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payloadEncoded = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET);
    
    return "$header.$payloadEncoded." . base64_encode($signature);
}

/**
 * Verificar token JWT
 */
function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header, $payload, $signature) = $parts;
    
    $expectedSignature = hash_hmac('sha256', "$header.$payload", JWT_SECRET);
    $expectedSignatureEncoded = base64_encode($expectedSignature);
    
    // Timing-safe comparison
    if (!hash_equals($expectedSignatureEncoded, base64_decode($signature))) {
        return false;
    }
    
    $payloadData = json_decode(base64_decode($payload), true);
    
    // Check expiration
    if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
        return false;
    }
    
    return $payloadData;
}

/**
 * Obter token do header Authorization
 */
function getBearerToken() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
        return $matches[1];
    }
    
    return null;
}

/**
 * Middleware para verificar autenticação
 */
function requireAuth() {
    $token = getBearerToken();
    
    if (!$token) {
        jsonResponse(['error' => 'Token não fornecido'], 401);
    }
    
    $payload = verifyJWT($token);
    
    if (!$payload) {
        jsonResponse(['error' => 'Token inválido ou expirado'], 401);
    }
    
    return $payload;
}

/**
 * Verificar se é usuário de teste
 */
function isTestUser($userId) {
    return in_array($userId, [1, 998, 999]);
}

/**
 * Hash de senha usando bcrypt
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

/**
 * Verificar senha
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Obter dados do usuário logado
 */
function getCurrentUser() {
    return requireAuth();
}

/**
 * Verificar permissão de admin
 */
function requireAdmin($user) {
    if (!isset($user['tipo_colaborador']) || $user['tipo_colaborador'] !== 'admin') {
        jsonResponse(['error' => 'Acesso restrito a administradores'], 403);
    }
    return true;
}

