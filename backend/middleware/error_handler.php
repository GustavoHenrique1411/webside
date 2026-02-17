<?php
/**
 * Middleware de Tratamento de Erros
 */

// Configurar handler de erros
error_reporting(E_ALL);
ini_set('display_errors', DEBUG_MODE ? '1' : '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../../logs/error.log');

/**
 * Handler de erros
 */
function errorHandler($errno, $errstr, $errfile, $errline) {
    $errorTypes = [
        E_ERROR => 'Error',
        E_WARNING => 'Warning',
        E_PARSE => 'Parse Error',
        E_NOTICE => 'Notice',
        E_CORE_ERROR => 'Core Error',
        E_CORE_WARNING => 'Core Warning',
        E_COMPILE_ERROR => 'Compile Error',
        E_COMPILE_WARNING => 'Compile Warning',
        E_USER_ERROR => 'User Error',
        E_USER_WARNING => 'User Warning',
        E_USER_NOTICE => 'User Notice',
        E_STRICT => 'Strict Notice',
        E_RECOVERABLE_ERROR => 'Recoverable Error',
        E_DEPRECATED => 'Deprecated',
        E_USER_DEPRECATED => 'User Deprecated',
    ];
    
    $type = $errorTypes[$errno] ?? 'Unknown Error';
    $message = "$type: $errstr in $errfile on line $errline";
    
    error_log($message);
    
    if (DEBUG_MODE) {
        echo json_encode([
            'error' => 'Erro interno do servidor',
            'debug' => [
                'type' => $type,
                'message' => $errstr,
                'file' => $errfile,
                'line' => $errline
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['error' => 'Erro interno do servidor'], JSON_UNESCAPED_UNICODE);
    }
    
    if ($errno === E_ERROR || $errno === E_USER_ERROR) {
        exit(1);
    }
    
    return true;
}

/**
 * Handler de exceções não capturadas
 */
function exceptionHandler($exception) {
    $message = $exception->getMessage();
    $file = $exception->getFile();
    $line = $exception->getLine();
    $trace = $exception->getTraceAsString();
    
    error_log("Uncaught Exception: $message in $file on line $line\nTrace: $trace");
    
    http_response_code(500);
    header('Content-Type: application/json');
    
    if (DEBUG_MODE) {
        echo json_encode([
            'error' => 'Erro interno do servidor',
            'message' => $message,
            'file' => $file,
            'line' => $line,
            'trace' => $trace
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['error' => 'Erro interno do servidor'], JSON_UNESCAPED_UNICODE);
    }
    
    exit(1);
}

// Registrar handlers
set_error_handler('errorHandler');
set_exception_handler('exceptionHandler');

// Criar diretório de logs se não existir
$logDir = __DIR__ . '/../../logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

/**
 * Função para tratar erros de banco de dados
 */
function handleDatabaseError($e) {
    error_log("Database Error: " . $e->getMessage());
    
    if (DEBUG_MODE) {
        errorResponse('Erro no banco de dados', 500, $e->getMessage());
    } else {
        errorResponse('Erro no banco de dados', 500);
    }
}

/**
 * Função para tratar erros de validação
 */
function handleValidationError($errors) {
    errorResponse('Dados inválidos', 400, $errors);
}

/**
 * Função para tratar erros de não encontrado
 */
function handleNotFound($resource = 'Recurso') {
    errorResponse("$resource não encontrado", 404);
}

/**
 * Função para tratar erros de autorização
 */
function handleUnauthorized($message = 'Não autorizado') {
    errorResponse($message, 401);
}

/**
 * Função para tratar erros de acesso proibido
 */
function handleForbidden($message = 'Acesso proibido') {
    errorResponse($message, 403);
}

