<?php
/**
 * Rotas de Templates
 * GET /api/templates - Listar todos os templates
 * GET /api/templates/:id - Obter template por ID
 * POST /api/templates - Criar novo template
 * PUT /api/templates/:id - Atualizar template
 * DELETE /api/templates/:id - Deletar template
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/templates', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetTemplates();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetTemplate($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateTemplate();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateTemplate($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteTemplate($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/templates
 */
function handleGetTemplates() {
    try {
        requireAuth();
        
        $templates = dbQuery('SELECT * FROM templates WHERE ativo = 1 ORDER BY nome_template');
        jsonResponse($templates);
        
    } catch (Exception $e) {
        error_log('Get templates error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar templates'], 500);
    }
}

/**
 * GET /api/templates/:id
 */
function handleGetTemplate($id) {
    try {
        requireAuth();
        
        $template = dbQueryOne('SELECT * FROM templates WHERE id_template = ?', [$id]);
        
        if (!$template) {
            jsonResponse(['error' => 'Template não encontrado'], 404);
        }
        
        jsonResponse($template);
        
    } catch (Exception $e) {
        error_log('Get template error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar template'], 500);
    }
}

/**
 * POST /api/templates
 */
function handleCreateTemplate() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        if (empty($data['nome_template']) || empty($data['conteudo'])) {
            jsonResponse(['error' => 'Nome e conteúdo do template são obrigatórios'], 400);
        }
        
        $user = requireAuth();
        
        $id = dbExecute(
            'INSERT INTO templates (tipo_template, nome_template, assunto, conteudo, variaveis, ativo, data_criacao, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)',
            [
                $data['tipo_template'] ?? 'email',
                $data['nome_template'],
                $data['assunto'] ?? '',
                $data['conteudo'],
                isset($data['variaveis']) ? json_encode($data['variaveis']) : null,
                $data['ativo'] ?? 1,
                $user['id']
            ]
        );
        
        $templateId = dbLastInsertId();
        
        jsonResponse(['id' => $templateId, 'message' => 'Template criado com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create template error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar template'], 500);
    }
}

/**
 * PUT /api/templates/:id
 */
function handleUpdateTemplate($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        $template = dbQueryOne('SELECT id_template FROM templates WHERE id_template = ?', [$id]);
        
        if (!$template) {
            jsonResponse(['error' => 'Template não encontrado'], 404);
        }
        
        dbExecute(
            'UPDATE templates SET tipo_template = ?, nome_template = ?, assunto = ?, conteudo = ?, variaveis = ?, ativo = ? WHERE id_template = ?',
            [
                $data['tipo_template'] ?? 'email',
                $data['nome_template'] ?? '',
                $data['assunto'] ?? '',
                $data['conteudo'] ?? '',
                isset($data['variaveis']) ? json_encode($data['variaveis']) : null,
                $data['ativo'] ?? 1,
                $id
            ]
        );
        
        jsonResponse(['message' => 'Template atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update template error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar template'], 500);
    }
}

/**
 * DELETE /api/templates/:id
 */
function handleDeleteTemplate($id) {
    try {
        requireAuth();
        
        $template = dbQueryOne('SELECT id_template FROM templates WHERE id_template = ?', [$id]);
        
        if (!$template) {
            jsonResponse(['error' => 'Template não encontrado'], 404);
        }
        
        // Soft delete - apenas marcar como inativo
        dbExecute('UPDATE templates SET ativo = 0 WHERE id_template = ?', [$id]);
        
        jsonResponse(['message' => 'Template deletado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete template error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar template'], 500);
    }
}

