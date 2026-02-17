<?php
/**
 * Rotas de Empresas
 * GET /api/empresas - Listar todas as empresas
 * GET /api/empresas/:id - Obter empresa por ID
 * POST /api/empresas - Criar nova empresa
 * PUT /api/empresas/:id - Atualizar empresa
 * DELETE /api/empresas/:id - Deletar empresa
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/empresas', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetEmpresas();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetEmpresa($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateEmpresa();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateEmpresa($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteEmpresa($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/empresas
 */
function handleGetEmpresas() {
    try {
        requireAuth();
        
        $empresas = dbQuery('SELECT * FROM empresas ORDER BY razao_social');
        jsonResponse($empresas);
        
    } catch (Exception $e) {
        error_log('Get empresas error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar empresas'], 500);
    }
}

/**
 * GET /api/empresas/:id
 */
function handleGetEmpresa($id) {
    try {
        requireAuth();
        
        $empresa = dbQueryOne('SELECT * FROM empresas WHERE id_empresa = ?', [$id]);
        
        if (!$empresa) {
            jsonResponse(['error' => 'Empresa não encontrada'], 404);
        }
        
        jsonResponse($empresa);
        
    } catch (Exception $e) {
        error_log('Get empresa error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar empresa'], 500);
    }
}

/**
 * POST /api/empresas
 */
function handleCreateEmpresa() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        if (empty($data['cnpj']) || empty($data['razao_social']) || empty($data['nome_fantasia'])) {
            jsonResponse(['error' => 'CNPJ, razão social e nome fantasia são obrigatórios'], 400);
        }
        
        $id = dbExecute(
            'INSERT INTO empresas (cnpj, razao_social, nome_fantasia, telefone, email, ativo, data_criacao) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [
                $data['cnpj'],
                $data['razao_social'],
                $data['nome_fantasia'],
                $data['telefone'] ?? '',
                $data['email'] ?? '',
                $data['ativo'] ?? 1
            ]
        );
        
        $empresaId = dbLastInsertId();
        
        jsonResponse(['id' => $empresaId, 'message' => 'Empresa criada com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create empresa error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar empresa'], 500);
    }
}

/**
 * PUT /api/empresas/:id
 */
function handleUpdateEmpresa($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        $empresa = dbQueryOne('SELECT id_empresa FROM empresas WHERE id_empresa = ?', [$id]);
        
        if (!$empresa) {
            jsonResponse(['error' => 'Empresa não encontrada'], 404);
        }
        
        dbExecute(
            'UPDATE empresas SET cnpj = ?, razao_social = ?, nome_fantasia = ?, telefone = ?, email = ?, ativo = ? WHERE id_empresa = ?',
            [
                $data['cnpj'] ?? '',
                $data['razao_social'] ?? '',
                $data['nome_fantasia'] ?? '',
                $data['telefone'] ?? '',
                $data['email'] ?? '',
                $data['ativo'] ?? 1,
                $id
            ]
        );
        
        jsonResponse(['message' => 'Empresa atualizada com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update empresa error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar empresa'], 500);
    }
}

/**
 * DELETE /api/empresas/:id
 */
function handleDeleteEmpresa($id) {
    try {
        requireAuth();
        
        $empresa = dbQueryOne('SELECT id_empresa FROM empresas WHERE id_empresa = ?', [$id]);
        
        if (!$empresa) {
            jsonResponse(['error' => 'Empresa não encontrada'], 404);
        }
        
        dbExecute('DELETE FROM empresas WHERE id_empresa = ?', [$id]);
        
        jsonResponse(['message' => 'Empresa deletada com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete empresa error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar empresa'], 500);
    }
}

