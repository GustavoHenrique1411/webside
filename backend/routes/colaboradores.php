<?php
/**
 * Rotas de Colaboradores
 * GET /api/colaboradores - Listar todos os colaboradores
 * GET /api/colaboradores/:id - Obter colaborador por ID
 * POST /api/colaboradores - Criar novo colaborador
 * PUT /api/colaboradores/:id - Atualizar colaborador
 * DELETE /api/colaboradores/:id - Deletar colaborador
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/colaboradores', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetColaboradores();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetColaborador($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateColaborador();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateColaborador($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteColaborador($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/colaboradores
 */
function handleGetColaboradores() {
    try {
        requireAuth();
        
        $colaboradores = dbQuery('SELECT id_colaborador, cpf, nome_completo, email, telefone, tipo_colaborador, data_admissao, ativo, id_permissao FROM colaboradores ORDER BY nome_completo');
        jsonResponse($colaboradores);
        
    } catch (Exception $e) {
        error_log('Get colaboradores error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar colaboradores'], 500);
    }
}

/**
 * GET /api/colaboradores/:id
 */
function handleGetColaborador($id) {
    try {
        requireAuth();
        
        $colaborador = dbQueryOne('SELECT * FROM colaboradores WHERE id_colaborador = ?', [$id]);
        
        if (!$colaborador) {
            jsonResponse(['error' => 'Colaborador não encontrado'], 404);
        }
        
        jsonResponse($colaborador);
        
    } catch (Exception $e) {
        error_log('Get colaborador error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar colaborador'], 500);
    }
}

/**
 * POST /api/colaboradores
 */
function handleCreateColaborador() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Validação básica
        if (empty($data['cpf']) || empty($data['nome_completo']) || empty($data['email']) || empty($data['senha'])) {
            jsonResponse(['error' => 'CPF, nome, email e senha são obrigatórios'], 400);
        }
        
        $user = requireAuth();
        
        // Hash da senha
        $hashedPassword = hashPassword($data['senha']);
        
        $id = dbExecute(
            'INSERT INTO colaboradores (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, ativo, id_permissao, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $data['cpf'],
                $data['nome_completo'],
                $data['email'],
                $hashedPassword,
                $data['telefone'] ?? '',
                $data['tipo_colaborador'] ?? 'funcionario',
                $data['data_admissao'] ?? date('Y-m-d'),
                $data['comissao_venda'] ?? 0,
                $data['comissao_recorrente'] ?? 0,
                $data['ativo'] ?? 1,
                $data['id_permissao'] ?? 1,
                $user['id']
            ]
        );
        
        $colaboradorId = dbLastInsertId();
        
        jsonResponse(['id' => $colaboradorId, 'message' => 'Colaborador criado com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create colaborador error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar colaborador'], 500);
    }
}

/**
 * PUT /api/colaboradores/:id
 */
function handleUpdateColaborador($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Verificar se colaborador existe
        $colaborador = dbQueryOne('SELECT id_colaborador FROM colaboradores WHERE id_colaborador = ?', [$id]);
        
        if (!$colaborador) {
            jsonResponse(['error' => 'Colaborador não encontrado'], 404);
        }
        
        // Se senha for informada, fazer hash
        $senhaHash = '';
        $params = [];
        if (!empty($data['senha'])) {
            $senhaHash = ', senha_hash = ?';
            $params[] = hashPassword($data['senha']);
        }
        
        $query = 'UPDATE colaboradores SET cpf = ?, nome_completo = ?, email = ?, telefone = ?, tipo_colaborador = ?, comissao_venda = ?, comissao_recorrente = ?, ativo = ?, id_permissao = ?' . $senhaHash . ' WHERE id_colaborador = ?';
        
        $params = array_merge([
            $data['cpf'] ?? '',
            $data['nome_completo'] ?? '',
            $data['email'] ?? '',
            $data['telefone'] ?? '',
            $data['tipo_colaborador'] ?? 'funcionario',
            $data['comissao_venda'] ?? 0,
            $data['comissao_recorrente'] ?? 0,
            $data['ativo'] ?? 1,
            $data['id_permissao'] ?? 1,
            $id
        ], $params);
        
        dbExecute($query, $params);
        
        jsonResponse(['message' => 'Colaborador atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update colaborador error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar colaborador'], 500);
    }
}

/**
 * DELETE /api/colaboradores/:id
 */
function handleDeleteColaborador($id) {
    try {
        requireAuth();
        
        // Verificar se colaborador existe
        $colaborador = dbQueryOne('SELECT id_colaborador FROM colaboradores WHERE id_colaborador = ?', [$id]);
        
        if (!$colaborador) {
            jsonResponse(['error' => 'Colaborador não encontrado'], 404);
        }
        
        dbExecute('DELETE FROM colaboradores WHERE id_colaborador = ?', [$id]);
        
        jsonResponse(['message' => 'Colaborador deletado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete colaborador error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar colaborador'], 500);
    }
}

