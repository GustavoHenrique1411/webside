<?php
/**
 * Rotas de Implantações
 * GET /api/implantacoes - Listar todas as implantações
 * GET /api/implantacoes/:id - Obter implantação por ID
 * POST /api/implantacoes - Criar nova implantação
 * PUT /api/implantacoes/:id - Atualizar implantação
 * DELETE /api/implantacoes/:id - Deletar implantação
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/implantacoes', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetImplantacoes();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetImplantacao($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateImplantacao();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateImplantacao($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteImplantacao($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/implantacoes
 */
function handleGetImplantacoes() {
    try {
        requireAuth();
        
        $implantacoes = dbQuery('
            SELECT i.*, c.numero_contrato, cl.razao_social as cliente_nome
            FROM implantacoes i
            LEFT JOIN contratos c ON i.id_contrato = c.id_contrato
            LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
            ORDER BY i.data_criacao DESC
        ');
        jsonResponse($implantacoes);
        
    } catch (Exception $e) {
        error_log('Get implantacoes error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar implantações'], 500);
    }
}

/**
 * GET /api/implantacoes/:id
 */
function handleGetImplantacao($id) {
    try {
        requireAuth();
        
        $implantacao = dbQueryOne('SELECT * FROM implantacoes WHERE id_implantacao = ?', [$id]);
        
        if (!$implantacao) {
            jsonResponse(['error' => 'Implantação não encontrada'], 404);
        }
        
        // Buscar comprovações
        $comprovacoes = dbQuery('SELECT * FROM comprovacoes WHERE id_implantacao = ?', [$id]);
        $implantacao['comprovacoes'] = $comprovacoes;
        
        jsonResponse($implantacao);
        
    } catch (Exception $e) {
        error_log('Get implantacao error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar implantação'], 500);
    }
}

/**
 * POST /api/implantacoes
 */
function handleCreateImplantacao() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        if (empty($data['id_contrato'])) {
            jsonResponse(['error' => 'Contrato é obrigatório'], 400);
        }
        
        $user = requireAuth();
        
        $id = dbExecute(
            'INSERT INTO implantacoes (id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [
                $data['id_contrato'],
                $user['id'],
                $data['data_inicio_prevista'] ?? date('Y-m-d'),
                $data['data_fim_prevista'] ?? date('Y-m-d', strtotime('+30 days')),
                $data['data_inicio_real'] ?? null,
                $data['data_fim_real'] ?? null,
                $data['percentual_conclusao'] ?? 0,
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1
            ]
        );
        
        $implantacaoId = dbLastInsertId();
        
        jsonResponse(['id' => $implantacaoId, 'message' => 'Implantação criada com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create implantacao error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar implantação'], 500);
    }
}

/**
 * PUT /api/implantacoes/:id
 */
function handleUpdateImplantacao($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        $implantacao = dbQueryOne('SELECT id_implantacao FROM implantacoes WHERE id_implantacao = ?', [$id]);
        
        if (!$implantacao) {
            jsonResponse(['error' => 'Implantação não encontrada'], 404);
        }
        
        dbExecute(
            'UPDATE implantacoes SET data_inicio_prevista = ?, data_fim_prevista = ?, data_inicio_real = ?, data_fim_real = ?, percentual_conclusao = ?, observacoes = ?, id_status = ? WHERE id_implantacao = ?',
            [
                $data['data_inicio_prevista'] ?? '',
                $data['data_fim_prevista'] ?? '',
                $data['data_inicio_real'] ?? null,
                $data['data_fim_real'] ?? null,
                $data['percentual_conclusao'] ?? 0,
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1,
                $id
            ]
        );
        
        jsonResponse(['message' => 'Implantação atualizada com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update implantacao error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar implantação'], 500);
    }
}

/**
 * DELETE /api/implantacoes/:id
 */
function handleDeleteImplantacao($id) {
    try {
        requireAuth();
        
        $implantacao = dbQueryOne('SELECT id_implantacao FROM implantacoes WHERE id_implantacao = ?', [$id]);
        
        if (!$implantacao) {
            jsonResponse(['error' => 'Implantação não encontrada'], 404);
        }
        
        // Deletar comprovações primeiro
        dbExecute('DELETE FROM comprovacoes WHERE id_implantacao = ?', [$id]);
        
        dbExecute('DELETE FROM implantacoes WHERE id_implantacao = ?', [$id]);
        
        jsonResponse(['message' => 'Implantação deletada com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete implantacao error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar implantação'], 500);
    }
}

