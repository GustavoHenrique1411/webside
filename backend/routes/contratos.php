<?php
/**
 * Rotas de Contratos
 * GET /api/contratos - Listar todos os contratos
 * GET /api/contratos/:id - Obter contrato por ID
 * POST /api/contratos - Criar novo contrato
 * PUT /api/contratos/:id - Atualizar contrato
 * DELETE /api/contratos/:id - Deletar contrato
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/contratos', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetContratos();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetContrato($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateContrato();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateContrato($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteContrato($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/contratos
 */
function handleGetContratos() {
    try {
        requireAuth();
        
        $contratos = dbQuery('
            SELECT c.*, cl.razao_social as cliente_nome 
            FROM contratos c 
            LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente 
            ORDER BY c.data_criacao DESC
        ');
        jsonResponse($contratos);
        
    } catch (Exception $e) {
        error_log('Get contratos error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar contratos'], 500);
    }
}

/**
 * GET /api/contratos/:id
 */
function handleGetContrato($id) {
    try {
        requireAuth();
        
        $contrato = dbQueryOne('SELECT * FROM contratos WHERE id_contrato = ?', [$id]);
        
        if (!$contrato) {
            jsonResponse(['error' => 'Contrato não encontrado'], 404);
        }
        
        // Buscar aditivos
        $aditivos = dbQuery('SELECT * FROM contratos_aditivos WHERE id_contrato = ?', [$id]);
        $contrato['aditivos'] = $aditivos;
        
        jsonResponse($contrato);
        
    } catch (Exception $e) {
        error_log('Get contrato error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar contrato'], 500);
    }
}

/**
 * POST /api/contratos
 */
function handleCreateContrato() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        if (empty($data['numero_contrato']) || empty($data['id_pedido']) || empty($data['id_cliente'])) {
            jsonResponse(['error' => 'Número do contrato, pedido e cliente são obrigatórios'], 400);
        }
        
        $id = dbExecute(
            'INSERT INTO contratos (numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [
                $data['numero_contrato'],
                $data['id_pedido'],
                $data['id_cliente'],
                $data['data_assinatura'] ?? date('Y-m-d'),
                $data['data_inicio_vigencia'] ?? date('Y-m-d'),
                $data['data_fim_vigencia'] ?? date('Y-m-d', strtotime('+1 year')),
                $data['valor_total'] ?? 0,
                $data['renovacao_automatica'] ?? 0,
                $data['periodicidade_reajuste'] ?? 'anual',
                $data['arquivo_url'] ?? '',
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1
            ]
        );
        
        $contratoId = dbLastInsertId();
        
        jsonResponse(['id' => $contratoId, 'message' => 'Contrato criado com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create contrato error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar contrato'], 500);
    }
}

/**
 * PUT /api/contratos/:id
 */
function handleUpdateContrato($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        $contrato = dbQueryOne('SELECT id_contrato FROM contratos WHERE id_contrato = ?', [$id]);
        
        if (!$contrato) {
            jsonResponse(['error' => 'Contrato não encontrado'], 404);
        }
        
        dbExecute(
            'UPDATE contratos SET numero_contrato = ?, data_assinatura = ?, data_inicio_vigencia = ?, data_fim_vigencia = ?, valor_total = ?, renovacao_automatica = ?, periodicidade_reajuste = ?, arquivo_url = ?, observacoes = ?, id_status = ? WHERE id_contrato = ?',
            [
                $data['numero_contrato'] ?? '',
                $data['data_assinatura'] ?? '',
                $data['data_inicio_vigencia'] ?? '',
                $data['data_fim_vigencia'] ?? '',
                $data['valor_total'] ?? 0,
                $data['renovacao_automatica'] ?? 0,
                $data['periodicidade_reajuste'] ?? 'anual',
                $data['arquivo_url'] ?? '',
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1,
                $id
            ]
        );
        
        jsonResponse(['message' => 'Contrato atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update contrato error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar contrato'], 500);
    }
}

/**
 * DELETE /api/contratos/:id
 */
function handleDeleteContrato($id) {
    try {
        requireAuth();
        
        $contrato = dbQueryOne('SELECT id_contrato FROM contratos WHERE id_contrato = ?', [$id]);
        
        if (!$contrato) {
            jsonResponse(['error' => 'Contrato não encontrado'], 404);
        }
        
        // Deletar aditivos primeiro
        dbExecute('DELETE FROM contratos_aditivos WHERE id_contrato = ?', [$id]);
        
        dbExecute('DELETE FROM contratos WHERE id_contrato = ?', [$id]);
        
        jsonResponse(['message' => 'Contrato deletado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete contrato error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar contrato'], 500);
    }
}

