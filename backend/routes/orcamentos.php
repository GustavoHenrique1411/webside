<?php
/**
 * Rotas de Orçamentos
 * GET /api/orcamentos - Listar todos os orçamentos
 * GET /api/orcamentos/:id - Obter orçamento por ID
 * POST /api/orcamentos - Criar novo orçamento
 * PUT /api/orcamentos/:id - Atualizar orçamento
 * PUT /api/orcamentos/:id/status - Atualizar status
 * DELETE /api/orcamentos/:id - Deletar orçamento
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/orcamentos', '', $requestUri);

// Extrair ID e rota específica
$id = null;
$statusPath = '';
if (preg_match('/^\/(\d+)(\/status)?$/', $path, $matches)) {
    $id = $matches[1];
    $statusPath = isset($matches[2]) ? '/status' : '/:id';
    $path = $statusPath === '/status' ? '/:id/status' : '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetOrcamentos();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetOrcamento($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateOrcamento();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateOrcamento($id);
} elseif ($method === 'PUT' && $path === '/:id/status') {
    handleUpdateOrcamentoStatus($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteOrcamento($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/orcamentos
 */
function handleGetOrcamentos() {
    try {
        requireAuth();
        
        $orcamentos = dbQuery('
            SELECT o.*, c.razao_social as cliente_nome
            FROM orcamentos o 
            LEFT JOIN clientes c ON o.id_cliente = c.id_cliente 
            ORDER BY o.data_criacao DESC
        ');
        jsonResponse($orcamentos);
        
    } catch (Exception $e) {
        error_log('Get orcamentos error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar orçamentos'], 500);
    }
}

/**
 * GET /api/orcamentos/:id
 */
function handleGetOrcamento($id) {
    try {
        requireAuth();
        
        $orcamento = dbQueryOne('SELECT * FROM orcamentos WHERE id_orcamento = ?', [$id]);
        
        if (!$orcamento) {
            jsonResponse(['error' => 'Orçamento não encontrado'], 404);
        }
        
        // Buscar itens
        $itens = dbQuery('SELECT * FROM orcamentos_itens WHERE id_orcamento = ?', [$id]);
        $orcamento['itens'] = $itens;
        
        jsonResponse($orcamento);
        
    } catch (Exception $e) {
        error_log('Get orcamento error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar orçamento'], 500);
    }
}

/**
 * POST /api/orcamentos
 */
function handleCreateOrcamento() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        if (empty($data['numero_orcamento']) || empty($data['valor_total'])) {
            jsonResponse(['error' => 'Número do orçamento e valor total são obrigatórios'], 400);
        }
        
        $user = requireAuth();
        
        // Calcular data de validade
        $validadeDias = $data['validade_dias'] ?? 30;
        $dataValidade = date('Y-m-d', strtotime("+{$validadeDias} days"));
        
        $id = dbExecute(
            'INSERT INTO orcamentos (numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_criacao, data_validade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
            [
                $data['numero_orcamento'],
                $data['id_lead'] ?? null,
                $data['id_cliente'] ?? null,
                $user['id'],
                $data['id_empresa'] ?? 1,
                $data['valor_total'],
                $validadeDias,
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1,
                $dataValidade
            ]
        );
        
        $orcamentoId = dbLastInsertId();
        
        // Inserir itens se informados
        if (!empty($data['itens'])) {
            foreach ($data['itens'] as $item) {
                dbExecute(
                    'INSERT INTO orcamentos_itens (id_orcamento, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, desconto_valor, valor_total, ordem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        $orcamentoId,
                        $item['id_produto'] ?? null,
                        $item['descricao_item'] ?? '',
                        $item['quantidade'] ?? 1,
                        $item['valor_unitario'] ?? 0,
                        $item['desconto_percentual'] ?? 0,
                        $item['desconto_valor'] ?? 0,
                        $item['valor_total'] ?? 0,
                        $item['ordem'] ?? 0
                    ]
                );
            }
        }
        
        jsonResponse(['id' => $orcamentoId, 'message' => 'Orçamento criado com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create orcamento error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar orçamento'], 500);
    }
}

/**
 * PUT /api/orcamentos/:id
 */
function handleUpdateOrcamento($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        $orcamento = dbQueryOne('SELECT id_orcamento FROM orcamentos WHERE id_orcamento = ?', [$id]);
        
        if (!$orcamento) {
            jsonResponse(['error' => 'Orçamento não encontrado'], 404);
        }
        
        // Calcular data de validade se validade_dias for alterado
        $validadeDias = $data['validade_dias'] ?? 30;
        $dataValidade = date('Y-m-d', strtotime("+{$validadeDias} days"));
        
        dbExecute(
            'UPDATE orcamentos SET numero_orcamento = ?, valor_total = ?, validade_dias = ?, observacoes = ?, id_status = ?, data_validade = ? WHERE id_orcamento = ?',
            [
                $data['numero_orcamento'] ?? '',
                $data['valor_total'] ?? 0,
                $validadeDias,
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1,
                $dataValidade,
                $id
            ]
        );
        
        // Atualizar itens se informados
        if (isset($data['itens'])) {
            // Deletar itens existentes
            dbExecute('DELETE FROM orcamentos_itens WHERE id_orcamento = ?', [$id]);
            
            // Inserir novos itens
            foreach ($data['itens'] as $item) {
                dbExecute(
                    'INSERT INTO orcamentos_itens (id_orcamento, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, desconto_valor, valor_total, ordem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        $id,
                        $item['id_produto'] ?? null,
                        $item['descricao_item'] ?? '',
                        $item['quantidade'] ?? 1,
                        $item['valor_unitario'] ?? 0,
                        $item['desconto_percentual'] ?? 0,
                        $item['desconto_valor'] ?? 0,
                        $item['valor_total'] ?? 0,
                        $item['ordem'] ?? 0
                    ]
                );
            }
        }
        
        jsonResponse(['message' => 'Orçamento atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update orcamento error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar orçamento'], 500);
    }
}

/**
 * PUT /api/orcamentos/:id/status
 */
function handleUpdateOrcamentoStatus($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        $orcamento = dbQueryOne('SELECT id_orcamento FROM orcamentos WHERE id_orcamento = ?', [$id]);
        
        if (!$orcamento) {
            jsonResponse(['error' => 'Orçamento não encontrado'], 404);
        }
        
        $status = $data['status'] ?? '';
        
        // Buscar ID do status
        $statusData = dbQueryOne('SELECT id_status FROM status WHERE nome_status = ? AND tipo_entidade = ?', [$status, 'orcamento']);
        
        if (!$statusData) {
            jsonResponse(['error' => 'Status não encontrado'], 404);
        }
        
        // Se for aprovado, definir data de aprovação
        $dataAprovacao = null;
        if (stripos($status, 'aprovado') !== false) {
            $dataAprovacao = date('Y-m-d');
        }
        
        dbExecute('UPDATE orcamentos SET id_status = ?, data_aprovacao = ? WHERE id_orcamento = ?', [
            $statusData['id_status'],
            $dataAprovacao,
            $id
        ]);
        
        jsonResponse(['message' => 'Status do orçamento atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update orcamento status error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar status do orçamento'], 500);
    }
}

/**
 * DELETE /api/orcamentos/:id
 */
function handleDeleteOrcamento($id) {
    try {
        requireAuth();
        
        $orcamento = dbQueryOne('SELECT id_orcamento FROM orcamentos WHERE id_orcamento = ?', [$id]);
        
        if (!$orcamento) {
            jsonResponse(['error' => 'Orçamento não encontrado'], 404);
        }
        
        // Deletar itens primeiro
        dbExecute('DELETE FROM orcamentos_itens WHERE id_orcamento = ?', [$id]);
        
        dbExecute('DELETE FROM orcamentos WHERE id_orcamento = ?', [$id]);
        
        jsonResponse(['message' => 'Orçamento deletado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete orcamento error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar orçamento'], 500);
    }
}

