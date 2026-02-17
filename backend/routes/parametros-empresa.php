<?php
/**
 * Rotas de Parâmetros de Empresa
 * GET /api/parametros-empresa - Obter parâmetros
 * PUT /api/parametros-empresa - Atualizar parâmetros
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/parametros-empresa', '', $requestUri);

// Router
if ($method === 'GET' && $path === '/') {
    handleGetParametros();
} elseif ($method === 'PUT' && $path === '/') {
    handleUpdateParametros();
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * GET /api/parametros-empresa
 */
function handleGetParametros() {
    try {
        requireAuth();
        
        $parametros = dbQuery('SELECT * FROM parametros_empresa ORDER BY id_parametro DESC LIMIT 1');
        
        if (empty($parametros)) {
            // Retornar parâmetros padrão se não existirem
            jsonResponse([
                'id_parametro' => null,
                'salario_minimo' => 1412.00,
                'percentual_reajuste' => 0.00,
                'dias_vencimento_fatura' => 30,
                'taxa_juros_mora' => 1.00,
                'data_vigencia' => date('Y-01-01')
            ]);
            return;
        }
        
        jsonResponse($parametros[0]);
        
    } catch (Exception $e) {
        error_log('Get parametros error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao buscar parâmetros'], 500);
    }
}

/**
 * PUT /api/parametros-empresa
 */
function handleUpdateParametros() {
    try {
        requireAuth();
        
        $data = getJsonInput();
        
        // Verificar se já existem parâmetros
        $existing = dbQueryOne('SELECT id_parametro FROM parametros_empresa ORDER BY id_parametro DESC LIMIT 1');
        
        if ($existing) {
            // Atualizar parâmetros existentes
            dbExecute(
                'UPDATE parametros_empresa SET salario_minimo = ?, percentual_reajuste = ?, dias_vencimento_fatura = ?, taxa_juros_mora = ?, data_vigencia = ? WHERE id_parametro = ?',
                [
                    $data['salario_minimo'] ?? 1412.00,
                    $data['percentual_reajuste'] ?? 0.00,
                    $data['dias_vencimento_fatura'] ?? 30,
                    $data['taxa_juros_mora'] ?? 1.00,
                    $data['data_vigencia'] ?? date('Y-01-01'),
                    $existing['id_parametro']
                ]
            );
            
            jsonResponse(['message' => 'Parâmetros atualizados com sucesso']);
        } else {
            // Criar novos parâmetros
            dbExecute(
                'INSERT INTO parametros_empresa (salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia) VALUES (?, ?, ?, ?, ?)',
                [
                    $data['salario_minimo'] ?? 1412.00,
                    $data['percentual_reajuste'] ?? 0.00,
                    $data['dias_vencimento_fatura'] ?? 30,
                    $data['taxa_juros_mora'] ?? 1.00,
                    $data['data_vigencia'] ?? date('Y-01-01')
                ]
            );
            
            $id = dbLastInsertId();
            jsonResponse(['id' => $id, 'message' => 'Parâmetros criados com sucesso'], 201);
        }
        
    } catch (Exception $e) {
        error_log('Update parametros error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao atualizar parâmetros'], 500);
    }
}

