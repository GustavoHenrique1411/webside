<?php
/**
 * Rotas de Transações
 * GET /api/transacoes - Listar todas as transações
 * GET /api/transacoes/:id - Obter transação por ID
 * POST /api/transacoes - Criar nova transação
 * PUT /api/transacoes/:id - Atualizar transação
 * DELETE /api/transacoes/:id - Deletar transação
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/transacoes', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetTransacoes();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetTransacao($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateTransacao();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateTransacao($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteTransacao($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/transacoes
 */
function handleGetTransacoes() {
    try {
        requireAuth();
        
        $transacoes = dbQuery('
            SELECT t.*, f.numero_fatura as fatura_numero
            FROM transacoes t
            LEFT JOIN faturas f ON t.id_fatura = f.id_fatura
            ORDER BY t.data_transacao DESC
        ');
        jsonResponse($transacoes);
        
    } catch (Exception $e) {
        error_log('Get transacoes error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar transações'], 500);
    }
}

/**
 * GET /api/transacoes/:id
 */
function handleGetTransacao($id) {
    try {
        requireAuth();
        
        $transacao = dbQueryOne('SELECT * FROM transacoes WHERE id_transacao = ?', [$id]);
        
        if (!$transacao) {
            jsonResponse(['error' => 'Transação não encontrada'], 404);
        }
        
        jsonResponse($transacao);
        
    } catch (Exception $e) {
        error_log('Get transacao error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar transação'], 500);
    }
}

/**
 * POST /api/transacoes
 */
function handleCreateTransacao() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        if (empty($data['tipo_transacao']) || empty($data['valor'])) {
            jsonResponse(['error' => 'Tipo e valor da transação são obrigatórios'], 400);
        }
        
        $user = requireAuth();
        
        $id = dbExecute(
            'INSERT INTO transacoes (id_fatura, tipo_transacao, valor, data_transacao, descricao, metodo_pagamento, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $data['id_fatura'] ?? null,
                $data['tipo_transacao'],
                $data['valor'],
                $data['data_transacao'] ?? date('Y-m-d H:i:s'),
                $data['descricao'] ?? '',
                $data['metodo_pagamento'] ?? '',
                $user['id']
            ]
        );
        
        $transacaoId = dbLastInsertId();
        
        jsonResponse(['id' => $transacaoId, 'message' => 'Transação criada com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create transacao error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar transação'], 500);
    }
}

/**
 * PUT /api/transacoes/:id
 */
function handleUpdateTransacao($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        $transacao = dbQueryOne('SELECT id_transacao FROM transacoes WHERE id_transacao = ?', [$id]);
        
        if (!$transacao) {
            jsonResponse(['error' => 'Transação não encontrada'], 404);
        }
        
        dbExecute(
            'UPDATE transacoes SET tipo_transacao = ?, valor = ?, data_transacao = ?, descricao = ?, metodo_pagamento = ? WHERE id_transacao = ?',
            [
                $data['tipo_transacao'] ?? '',
                $data['valor'] ?? 0,
                $data['data_transacao'] ?? '',
                $data['descricao'] ?? '',
                $data['metodo_pagamento'] ?? '',
                $id
            ]
        );
        
        jsonResponse(['message' => 'Transação atualizada com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update transacao error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar transação'], 500);
    }
}

/**
 * DELETE /api/transacoes/:id
 */
function handleDeleteTransacao($id) {
    try {
        requireAuth();
        
        $transacao = dbQueryOne('SELECT id_transacao FROM transacoes WHERE id_transacao = ?', [$id]);
        
        if (!$transacao) {
            jsonResponse(['error' => 'Transação não encontrada'], 404);
        }
        
        dbExecute('DELETE FROM transacoes WHERE id_transacao = ?', [$id]);
        
        jsonResponse(['message' => 'Transação deletada com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete transacao error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar transação'], 500);
    }
}

