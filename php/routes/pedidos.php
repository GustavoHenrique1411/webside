<?php
/**
 * Rotas de Pedidos
 * GET /api/pedidos - Listar todos os pedidos
 * GET /api/pedidos/:id - Obter pedido por ID
 * POST /api/pedidos - Criar novo pedido
 * PUT /api/pedidos/:id - Atualizar pedido
 * DELETE /api/pedidos/:id - Deletar pedido
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/pedidos', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetPedidos();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetPedido($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreatePedido();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdatePedido($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeletePedido($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/pedidos
 */
function handleGetPedidos() {
    try {
        requireAuth();
        
        $pedidos = dbQuery('
            SELECT p.*, c.razao_social as cliente_nome 
            FROM pedidos p 
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente 
            ORDER BY p.data_criacao DESC
        ');
        jsonResponse($pedidos);
        
    } catch (Exception $e) {
        error_log('Get pedidos error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar pedidos'], 500);
    }
}

/**
 * GET /api/pedidos/:id
 */
function handleGetPedido($id) {
    try {
        requireAuth();
        
        $pedido = dbQueryOne('SELECT * FROM pedidos WHERE id_pedido = ?', [$id]);
        
        if (!$pedido) {
            jsonResponse(['error' => 'Pedido não encontrado'], 404);
        }
        
        // Buscar itens do pedido
        $itens = dbQuery('SELECT * FROM pedidos_itens WHERE id_pedido = ?', [$id]);
        $pedido['itens'] = $itens;
        
        jsonResponse($pedido);
        
    } catch (Exception $e) {
        error_log('Get pedido error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar pedido'], 500);
    }
}

/**
 * POST /api/pedidos
 */
function handleCreatePedido() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Validação básica
        if (empty($data['numero_pedido']) || empty($data['id_cliente'])) {
            jsonResponse(['error' => 'Número do pedido e cliente são obrigatórios'], 400);
        }
        
        $user = requireAuth();
        
        // Gerar número do pedido se não informado
        $numeroPedido = $data['numero_pedido'] ?? 'PED-' . date('YmdHis');
        
        $id = dbExecute(
            'INSERT INTO pedidos (numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [
                $numeroPedido,
                $data['id_orcamento'] ?? null,
                $data['id_cliente'],
                $user['id'],
                $data['id_empresa'] ?? 1,
                $data['data_pedido'] ?? date('Y-m-d'),
                $data['valor_total'] ?? 0,
                $data['data_prevista_entrega'] ?? null,
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1
            ]
        );
        
        $pedidoId = dbLastInsertId();
        
        // Inserir itens se informados
        if (!empty($data['itens'])) {
            foreach ($data['itens'] as $item) {
                dbExecute(
                    'INSERT INTO pedidos_itens (id_pedido, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, valor_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        $pedidoId,
                        $item['id_produto'] ?? null,
                        $item['descricao_item'] ?? '',
                        $item['quantidade'] ?? 1,
                        $item['valor_unitario'] ?? 0,
                        $item['desconto_percentual'] ?? 0,
                        $item['valor_total'] ?? 0
                    ]
                );
            }
        }
        
        jsonResponse(['id' => $pedidoId, 'message' => 'Pedido criado com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create pedido error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar pedido'], 500);
    }
}

/**
 * PUT /api/pedidos/:id
 */
function handleUpdatePedido($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Verificar se pedido existe
        $pedido = dbQueryOne('SELECT id_pedido FROM pedidos WHERE id_pedido = ?', [$id]);
        
        if (!$pedido) {
            jsonResponse(['error' => 'Pedido não encontrado'], 404);
        }
        
        dbExecute(
            'UPDATE pedidos SET numero_pedido = ?, id_orcamento = ?, id_cliente = ?, data_pedido = ?, valor_total = ?, data_prevista_entrega = ?, observacoes = ?, id_status = ? WHERE id_pedido = ?',
            [
                $data['numero_pedido'] ?? '',
                $data['id_orcamento'] ?? null,
                $data['id_cliente'] ?? '',
                $data['data_pedido'] ?? date('Y-m-d'),
                $data['valor_total'] ?? 0,
                $data['data_prevista_entrega'] ?? null,
                $data['observacoes'] ?? '',
                $data['id_status'] ?? 1,
                $id
            ]
        );
        
        jsonResponse(['message' => 'Pedido atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update pedido error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar pedido'], 500);
    }
}

/**
 * DELETE /api/pedidos/:id
 */
function handleDeletePedido($id) {
    try {
        requireAuth();
        
        // Verificar se pedido existe
        $pedido = dbQueryOne('SELECT id_pedido FROM pedidos WHERE id_pedido = ?', [$id]);
        
        if (!$pedido) {
            jsonResponse(['error' => 'Pedido não encontrado'], 404);
        }
        
        // Deletar itens primeiro
        dbExecute('DELETE FROM pedidos_itens WHERE id_pedido = ?', [$id]);
        
        // Deletar pedido
        dbExecute('DELETE FROM pedidos WHERE id_pedido = ?', [$id]);
        
        jsonResponse(['message' => 'Pedido deletado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete pedido error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar pedido'], 500);
    }
}

