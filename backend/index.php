<?php
/**
 * WebSide API - Main Entry Point
 * Backend em PHP
 */

// Configurações iniciais
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

// Carregar configurações
require_once __DIR__ . '/config/config.php';

// Configurar headers CORS e segurança
setCorsHeaders();
setSecurityHeaders();

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remover prefixo /api
$path = str_replace('/api', '', $requestUri);

// Router principal
$routes = [
    // Auth
    '/auth/login' => __DIR__ . '/routes/auth.php',
    '/auth/register' => __DIR__ . '/routes/auth.php',
    '/auth/create-first-admin' => __DIR__ . '/routes/auth.php',
    '/auth/reset-admin-password' => __DIR__ . '/routes/auth.php',
    '/auth/profile' => __DIR__ . '/routes/auth.php',
    '/auth/preferences' => __DIR__ . '/routes/auth.php',
    '/auth/test-db' => __DIR__ . '/routes/auth.php',
    
    // Leads
    '/leads' => __DIR__ . '/routes/leads.php',
    
    // Clientes
    '/clientes' => __DIR__ . '/routes/clientes.php',
    
    // Produtos
    '/produtos' => __DIR__ . '/routes/produtos.php',
    
    // Pedidos
    '/pedidos' => __DIR__ . '/routes/pedidos.php',
    
    // Colaboradores
    '/colaboradores' => __DIR__ . '/routes/colaboradores.php',
    
    // Empresas
    '/empresas' => __DIR__ . '/routes/empresas.php',
    
    // Contratos
    '/contratos' => __DIR__ . '/routes/contratos.php',
    
    // Faturas
    '/faturas' => __DIR__ . '/routes/faturas.php',
    
    // Implantações
    '/implantacoes' => __DIR__ . '/routes/implantacoes.php',
    
    // Orçamentos
    '/orcamentos' => __DIR__ . '/routes/orcamentos.php',
    
    // Status
    '/status' => __DIR__ . '/routes/status.php',
    
    // Templates
    '/templates' => __DIR__ . '/routes/templates.php',
    
    // Transações
    '/transacoes' => __DIR__ . '/routes/transacoes.php',
    
    // Parâmetros Empresa
    '/parametros-empresa' => __DIR__ . '/routes/parametros-empresa.php',
    
    // Health check
    '/health' => __DIR__ . '/routes/health.php',
];

// Encontrar rota correspondente
$routeFound = false;
foreach ($routes as $route => $file) {
    // Verificar se a rota começa com o caminho solicitado
    if (strpos($path, $route) === 0) {
        $routeFound = true;
        
        // Verificar se o arquivo existe
        if (file_exists($file)) {
            // Para rotas com ID, precisamos modificar o PATH_INFO
            if (preg_match('#(/[a-z-]+)/(\d+)#', $path, $matches)) {
                // Manter o caminho como está para as rotas processarem
            }
            
            require $file;
        } else {
            jsonResponse(['error' => 'Arquivo de rota não encontrado'], 500);
        }
        break;
    }
}

// Rota não encontrada
if (!$routeFound) {
    jsonResponse(['error' => 'Rota não encontrada: ' . $path], 404);
}

