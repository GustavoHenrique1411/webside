<?php
/**
 * Rotas de Produtos
 * GET /api/produtos - Listar todos os produtos
 * GET /api/produtos/:id - Obter produto por ID
 * POST /api/produtos - Criar novo produto
 * PUT /api/produtos/:id - Atualizar produto
 * DELETE /api/produtos/:id - Deletar produto
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/produtos', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetProdutos();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetProduto($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateProduto();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateProduto($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteProduto($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/produtos
 */
function handleGetProdutos() {
    try {
        requireAuth();
        
        $produtos = dbQuery('SELECT * FROM produtos ORDER BY data_criacao DESC');
        jsonResponse($produtos);
        
    } catch (Exception $e) {
        error_log('Get produtos error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar produtos'], 500);
    }
}

/**
 * GET /api/produtos/:id
 */
function handleGetProduto($id) {
    try {
        requireAuth();
        
        $produto = dbQueryOne('SELECT * FROM produtos WHERE id_produto = ?', [$id]);
        
        if (!$produto) {
            jsonResponse(['error' => 'Produto não encontrado'], 404);
        }
        
        jsonResponse($produto);
        
    } catch (Exception $e) {
        error_log('Get produto error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar produto'], 500);
    }
}

/**
 * POST /api/produtos
 */
function handleCreateProduto() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Validação básica
        if (empty($data['codigo_produto']) || empty($data['nome']) || empty($data['valor_base'])) {
            jsonResponse(['error' => 'Código, nome e valor base são obrigatórios'], 400);
        }
        
        $user = requireAuth();
        
        $id = dbExecute(
            'INSERT INTO produtos (codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, ativo, data_criacao, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
            [
                $data['codigo_produto'] ?? '',
                $data['nome'] ?? '',
                $data['descricao'] ?? '',
                $data['tipo_produto'] ?? 'produto',
                $data['categoria'] ?? '',
                $data['valor_base'] ?? 0,
                $data['unidade_medida'] ?? 'un',
                $data['estoque_minimo'] ?? null,
                $data['ativo'] ?? 1,
                $user['id']
            ]
        );
        
        $produtoId = dbLastInsertId();
        
        jsonResponse(['id' => $produtoId, 'message' => 'Produto criado com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create produto error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar produto'], 500);
    }
}

/**
 * PUT /api/produtos/:id
 */
function handleUpdateProduto($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Verificar se produto existe
        $produto = dbQueryOne('SELECT id_produto FROM produtos WHERE id_produto = ?', [$id]);
        
        if (!$produto) {
            jsonResponse(['error' => 'Produto não encontrado'], 404);
        }
        
        dbExecute(
            'UPDATE produtos SET codigo_produto = ?, nome = ?, descricao = ?, tipo_produto = ?, categoria = ?, valor_base = ?, unidade_medida = ?, estoque_minimo = ?, ativo = ? WHERE id_produto = ?',
            [
                $data['codigo_produto'] ?? '',
                $data['nome'] ?? '',
                $data['descricao'] ?? '',
                $data['tipo_produto'] ?? 'produto',
                $data['categoria'] ?? '',
                $data['valor_base'] ?? 0,
                $data['unidade_medida'] ?? 'un',
                $data['estoque_minimo'] ?? null,
                $data['ativo'] ?? 1,
                $id
            ]
        );
        
        jsonResponse(['message' => 'Produto atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update produto error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar produto'], 500);
    }
}

/**
 * DELETE /api/produtos/:id
 */
function handleDeleteProduto($id) {
    try {
        requireAuth();
        
        // Verificar se produto existe
        $produto = dbQueryOne('SELECT id_produto FROM produtos WHERE id_produto = ?', [$id]);
        
        if (!$produto) {
            jsonResponse(['error' => 'Produto não encontrado'], 404);
        }
        
        dbExecute('DELETE FROM produtos WHERE id_produto = ?', [$id]);
        
        jsonResponse(['message' => 'Produto deletado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete produto error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar produto'], 500);
    }
}

