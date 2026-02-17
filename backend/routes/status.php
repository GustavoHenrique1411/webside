<?php
/**
 * Rotas de Status
 * GET /api/status - Listar todos os status
 * GET /api/status/:id - Obter status por ID
 * POST /api/status - Criar novo status
 * PUT /api/status/:id - Atualizar status
 * DELETE /api/status/:id - Deletar status
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/status', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetStatusList();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetStatus($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateStatus();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateStatus($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteStatus($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/status
 */
function handleGetStatusList() {
    try {
        requireAuth();
        
        $status = dbQuery('SELECT * FROM status WHERE ativo = 1 ORDER BY tipo_entidade, ordem');
        jsonResponse($status);
        
    } catch (Exception $e) {
        error_log('Get status error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar status'], 500);
    }
}

/**
 * GET /api/status/:id
 */
function handleGetStatus($id) {
    try {
        requireAuth();
        
        $status = dbQueryOne('SELECT * FROM status WHERE id_status = ?', [$id]);
        
        if (!$status) {
            jsonResponse(['error' => 'Status não encontrado'], 404);
        }
        
        jsonResponse($status);
        
    } catch (Exception $e) {
        error_log('Get status error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar status'], 500);
    }
}

/**
 * POST /api/status
 */
function handleCreateStatus() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        if (empty($data['tipo_entidade']) || empty($data['codigo_status']) || empty($data['nome_status'])) {
            jsonResponse(['error' => 'Tipo de entidade, código e nome do status são obrigatórios'], 400);
        }
        
        $id = dbExecute(
            'INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex, ativo) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $data['tipo_entidade'],
                $data['codigo_status'],
                $data['nome_status'],
                $data['descricao'] ?? '',
                $data['ordem'] ?? 0,
                $data['cor_hex'] ?? '#000000',
                $data['ativo'] ?? 1
            ]
        );
        
        $statusId = dbLastInsertId();
        
        jsonResponse(['id' => $statusId, 'message' => 'Status criado com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create status error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar status'], 500);
    }
}

/**
 * PUT /api/status/:id
 */
function handleUpdateStatus($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        $status = dbQueryOne('SELECT id_status FROM status WHERE id_status = ?', [$id]);
        
        if (!$status) {
            jsonResponse(['error' => 'Status não encontrado'], 404);
        }
        
        dbExecute(
            'UPDATE status SET tipo_entidade = ?, codigo_status = ?, nome_status = ?, descricao = ?, ordem = ?, cor_hex = ?, ativo = ? WHERE id_status = ?',
            [
                $data['tipo_entidade'] ?? '',
                $data['codigo_status'] ?? '',
                $data['nome_status'] ?? '',
                $data['descricao'] ?? '',
                $data['ordem'] ?? 0,
                $data['cor_hex'] ?? '#000000',
                $data['ativo'] ?? 1,
                $id
            ]
        );
        
        jsonResponse(['message' => 'Status atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update status error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar status'], 500);
    }
}

/**
 * DELETE /api/status/:id
 */
function handleDeleteStatus($id) {
    try {
        requireAuth();
        
        $status = dbQueryOne('SELECT id_status FROM status WHERE id_status = ?', [$id]);
        
        if (!$status) {
            jsonResponse(['error' => 'Status não encontrado'], 404);
        }
        
        dbExecute('DELETE FROM status WHERE id_status = ?', [$id]);
        
        jsonResponse(['message' => 'Status deletado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete status error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar status'], 500);
    }
}

