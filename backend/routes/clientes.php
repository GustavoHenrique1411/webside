<?php
/**
 * Rotas de Clientes
 * GET /api/clientes - Listar todos os clientes
 * GET /api/clientes/:id - Obter cliente por ID
 * POST /api/clientes - Criar novo cliente
 * PUT /api/clientes/:id - Atualizar cliente
 * DELETE /api/clientes/:id - Deletar cliente
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/clientes', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetClientes();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetCliente($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateCliente();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateCliente($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteCliente($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/clientes
 */
function handleGetClientes() {
    try {
        requireAuth();
        
        $clientes = dbQuery('SELECT * FROM clientes ORDER BY data_cadastro DESC');
        jsonResponse($clientes);
        
    } catch (Exception $e) {
        error_log('Get clientes error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar clientes'], 500);
    }
}

/**
 * GET /api/clientes/:id
 */
function handleGetCliente($id) {
    try {
        requireAuth();
        
        $cliente = dbQueryOne('SELECT * FROM clientes WHERE id_cliente = ?', [$id]);
        
        if (!$cliente) {
            jsonResponse(['error' => 'Cliente não encontrado'], 404);
        }
        
        jsonResponse($cliente);
        
    } catch (Exception $e) {
        error_log('Get cliente error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar cliente'], 500);
    }
}

/**
 * POST /api/clientes
 */
function handleCreateCliente() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Validação básica
        if (empty($data['razao_social']) || empty($data['cnpj'])) {
            jsonResponse(['error' => 'Razão social e CNPJ são obrigatórios'], 400);
        }
        
        $id = dbExecute(
            'INSERT INTO clientes (razao_social, nome_fantasia, cnpj, email, telefone, endereco, cidade, estado, cep, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [
                $data['razao_social'] ?? '',
                $data['nome_fantasia'] ?? '',
                $data['cnpj'] ?? '',
                $data['email'] ?? '',
                $data['telefone'] ?? '',
                $data['endereco'] ?? '',
                $data['cidade'] ?? '',
                $data['estado'] ?? '',
                $data['cep'] ?? ''
            ]
        );
        
        $clienteId = dbLastInsertId();
        
        jsonResponse(['id' => $clienteId, 'message' => 'Cliente criado com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create cliente error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar cliente'], 500);
    }
}

/**
 * PUT /api/clientes/:id
 */
function handleUpdateCliente($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Validação básica
        if (empty($data['razao_social']) || empty($data['cnpj'])) {
            jsonResponse(['error' => 'Razão social e CNPJ são obrigatórios'], 400);
        }
        
        // Verificar se cliente existe
        $cliente = dbQueryOne('SELECT id_cliente FROM clientes WHERE id_cliente = ?', [$id]);
        
        if (!$cliente) {
            jsonResponse(['error' => 'Cliente não encontrado'], 404);
        }
        
        dbExecute(
            'UPDATE clientes SET razao_social = ?, nome_fantasia = ?, cnpj = ?, email = ?, telefone = ?, endereco = ?, cidade = ?, estado = ?, cep = ? WHERE id_cliente = ?',
            [
                $data['razao_social'] ?? '',
                $data['nome_fantasia'] ?? '',
                $data['cnpj'] ?? '',
                $data['email'] ?? '',
                $data['telefone'] ?? '',
                $data['endereco'] ?? '',
                $data['cidade'] ?? '',
                $data['estado'] ?? '',
                $data['cep'] ?? '',
                $id
            ]
        );
        
        jsonResponse(['message' => 'Cliente atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update cliente error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar cliente'], 500);
    }
}

/**
 * DELETE /api/clientes/:id
 */
function handleDeleteCliente($id) {
    try {
        requireAuth();
        
        // Verificar se cliente existe
        $cliente = dbQueryOne('SELECT id_cliente FROM clientes WHERE id_cliente = ?', [$id]);
        
        if (!$cliente) {
            jsonResponse(['error' => 'Cliente não encontrado'], 404);
        }
        
        dbExecute('DELETE FROM clientes WHERE id_cliente = ?', [$id]);
        
        jsonResponse(['message' => 'Cliente deletado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete cliente error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar cliente'], 500);
    }
}

