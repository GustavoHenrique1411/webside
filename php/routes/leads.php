<?php
/**
 * Rotas de Leads
 * GET /api/leads - Listar todos os leads
 * GET /api/leads/:id - Obter lead por ID
 * POST /api/leads - Criar novo lead
 * PUT /api/leads/:id - Atualizar lead
 * DELETE /api/leads/:id - Deletar lead
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/leads', '', $requestUri);

// Extrair ID se presente
$id = null;
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    $path = '/:id';
}

// Router
if ($method === 'GET' && $path === '/') {
    handleGetLeads();
} elseif ($method === 'GET' && $path === '/:id') {
    handleGetLead($id);
} elseif ($method === 'POST' && $path === '/') {
    handleCreateLead();
} elseif ($method === 'PUT' && $path === '/:id') {
    handleUpdateLead($id);
} elseif ($method === 'DELETE' && $path === '/:id') {
    handleDeleteLead($id);
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/leads
 */
function handleGetLeads() {
    try {
        requireAuth();
        
        $leads = dbQuery('
            SELECT 
                id_lead as id, 
                nome_empresa as empresa, 
                contato_principal as nome, 
                email_contato as email, 
                telefone_contato as telefone, 
                fonte_lead as origem, 
                observacoes, 
                data_criacao 
            FROM leads 
            ORDER BY data_criacao DESC
        ');
        
        // Adicionar status padrão
        $leadsWithStatus = array_map(function($lead) {
            $lead['status'] = 'Novo';
            return $lead;
        }, $leads);
        
        jsonResponse($leadsWithStatus);
        
    } catch (Exception $e) {
        error_log('Get leads error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar leads'], 500);
    }
}

/**
 * GET /api/leads/:id
 */
function handleGetLead($id) {
    try {
        requireAuth();
        
        $lead = dbQueryOne('SELECT * FROM leads WHERE id_lead = ?', [$id]);
        
        if (!$lead) {
            jsonResponse(['error' => 'Lead não encontrado'], 404);
        }
        
        jsonResponse($lead);
        
    } catch (Exception $e) {
        error_log('Get lead error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar lead'], 500);
    }
}

/**
 * POST /api/leads
 */
function handleCreateLead() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Validação básica
        if (empty($data['nome_empresa']) || empty($data['contato_principal'])) {
            jsonResponse(['error' => 'Nome da empresa e contato principal são obrigatórios'], 400);
        }
        
        $id = dbExecute(
            'INSERT INTO leads (nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, observacoes, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [
                $data['nome_empresa'] ?? '',
                $data['cnpj'] ?? '',
                $data['contato_principal'] ?? '',
                $data['email_contato'] ?? '',
                $data['telefone_contato'] ?? '',
                $data['fonte_lead'] ?? '',
                $data['observacoes'] ?? ''
            ]
        );
        
        $leadId = dbLastInsertId();
        
        jsonResponse(['id' => $leadId, 'message' => 'Lead criado com sucesso'], 201);
        
    } catch (Exception $e) {
        error_log('Create lead error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao criar lead'], 500);
    }
}

/**
 * PUT /api/leads/:id
 */
function handleUpdateLead($id) {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Validação básica
        if (empty($data['nome_empresa']) || empty($data['contato_principal'])) {
            jsonResponse(['error' => 'Nome da empresa e contato principal são obrigatórios'], 400);
        }
        
        // Verificar se lead existe
        $lead = dbQueryOne('SELECT id_lead FROM leads WHERE id_lead = ?', [$id]);
        
        if (!$lead) {
            jsonResponse(['error' => 'Lead não encontrado'], 404);
        }
        
        dbExecute(
            'UPDATE leads SET nome_empresa = ?, cnpj = ?, contato_principal = ?, email_contato = ?, telefone_contato = ?, fonte_lead = ?, observacoes = ? WHERE id_lead = ?',
            [
                $data['nome_empresa'] ?? '',
                $data['cnpj'] ?? '',
                $data['contato_principal'] ?? '',
                $data['email_contato'] ?? '',
                $data['telefone_contato'] ?? '',
                $data['fonte_lead'] ?? '',
                $data['observacoes'] ?? '',
                $id
            ]
        );
        
        jsonResponse(['message' => 'Lead atualizado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Update lead error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar lead'], 500);
    }
}

/**
 * DELETE /api/leads/:id
 */
function handleDeleteLead($id) {
    try {
        requireAuth();
        
        // Verificar se lead existe
        $lead = dbQueryOne('SELECT id_lead FROM leads WHERE id_lead = ?', [$id]);
        
        if (!$lead) {
            jsonResponse(['error' => 'Lead não encontrado'], 404);
        }
        
        dbExecute('DELETE FROM leads WHERE id_lead = ?', [$id]);
        
        jsonResponse(['message' => 'Lead deletado com sucesso']);
        
    } catch (Exception $e) {
        error_log('Delete lead error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao deletar lead'], 500);
    }
}

