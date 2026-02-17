<?php
/**
 * Rotas de Faturas
 * GET /api/faturas - Listar todas as faturas
 * GET /api/faturas/:id - Obter fatura por ID
 * POST /api/faturas - Criar nova fatura
 * PUT /api/faturas/:id - Atualizar fatura
 * DELETE /api/faturas/:id - Deletar fatura
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/faturas', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetFaturas();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetFatura($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateFatura();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateFatura($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteFatura($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/faturas
 */
function handleGetFaturas() {
    try {
        requireAuth();
        
        $faturas = dbQuery('
            SELECT f.*, c.numero_contrato as contrato_numero
            FROM faturas f 
            LEFT JOIN contratos c ON f.id_contrato = c.id_contrato 
            ORDER BY f.data_emissao DESC
        ');
        jsonResponse($faturas);
        
    } catch (Exception $e) {
        error_log('Get faturas error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar faturas'], 500);
    }
}

/**
 * GET /api/faturas/:id
 */
function handleGetFatura($id) {
    try {
        requireAuth();
        
        $fatura = dbQueryOne('SELECT * FROM faturas WHERE id_fatura = ?', [$id]);
        
        if (!$fatura) {
            jsonResponse(['error' => 'Fatura não encontrada'], 404);
        }
        
        jsonResponse($fatura);
        
    } catch (Exception $e) {
        error_log('Get fatura error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar fatura'], 500);
    }
}

/**
 * POST /api/faturas
 */
function handleCreateFatura() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        if (empty($data['numero_fatura']) || empty($data['id_contrato'])) {
            jsonResponse(['error' => 'Número da fatura e contrato são obrigatórios'], 400);
        }
        
        $id = dbExecute(
            'INSERT INTO faturas (id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $data['id_contrato'],
                $data['numero_fatura'],
                $data['data_emissao'] ?? date('Y-m-d'),
                $data['data_vencimento'] ?? date('Y-m-d', strtotime('+30 days')),
                $data['valor_original'] ?? 0,
                $data['valor_final'] ?? $data['valor_original'] ?? 0,
                $data['data_pagamento'] ?? null,
                $data['valor_pago'] ?? null,
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1
            ]
        );
        
        $faturaId = dbLastInsertId();
        
        jsonResponse(['id' => $faturaId, 'message' => 'Fatura criada com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create fatura error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar fatura'], 500);
    }
}

/**
 * PUT /api/faturas/:id
 */
function handleUpdateFatura($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        $fatura = dbQueryOne('SELECT id_fatura FROM faturas WHERE id_fatura = ?', [$id]);
        
        if (!$fatura) {
            jsonResponse(['error' => 'Fatura não encontrada'], 404);
        }
        
        dbExecute(
            'UPDATE faturas SET data_emissao = ?, data_vencimento = ?, valor_original = ?, valor_final = ?, data_pagamento = ?, valor_pago = ?, observacoes = ?, id_status = ? WHERE id_fatura = ?',
            [
                $data['data_emissao'] ?? '',
                $data['data_vencimento'] ?? '',
                $data['valor_original'] ?? 0,
                $data['valor_final'] ?? 0,
                $data['data_pagamento'] ?? null,
                $data['valor_pago'] ?? null,
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1,
                $id
            ]
        );
        
        jsonResponse(['message' => 'Fatura atualizada com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update fatura error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar fatura'], 500);
    }
}

/**
 * DELETE /api/faturas/:id
 */
function handleDeleteFatura($id) {
    try {
        requireAuth();
        
        $fatura = dbQueryOne('SELECT id_fatura FROM faturas WHERE id_fatura = ?', [$id]);
        
        if (!$fatura) {
            jsonResponse(['error' => 'Fatura não encontrada'], 404);
        }
        
        dbExecute('DELETE FROM faturas WHERE id_fatura = ?', [$id]);
        
        jsonResponse(['message' => 'Fatura deletada com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete fatura error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar fatura'], 500);
    }
}

