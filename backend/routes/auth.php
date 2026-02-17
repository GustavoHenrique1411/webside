<?php
/**
 * Rotas de Autenticação
 * POST /api/auth/login
 * POST /api/auth/register
 * POST /api/auth/create-first-admin
 * POST /api/auth/reset-admin-password
 * GET /api/auth/profile
 * GET /api/auth/preferences
 * GET /api/auth/test-db
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/error_handler.php';

// Usuários de teste (sem banco de dados)
$TEST_USERS = [
    'admin@empresa.com' => ['password' => 'admin123', 'id' => 1, 'nome' => 'Administrador', 'tipo' => 'funcionario'],
    'admin@empresa' => ['password' => 'admin123', 'id' => 1, 'nome' => 'Administrador', 'tipo' => 'funcionario'],
    'test@test.com' => ['password' => 'test123', 'id' => 999, 'nome' => 'Usuário Teste', 'tipo' => 'funcionario'],
    'demo@demo.com' => ['password' => 'demo123', 'id' => 998, 'nome' => 'Usuário Demo', 'tipo' => 'funcionario']
];

// Usuários de teste por ID
$TEST_USERS_BY_ID = [
    1 => ['nome' => 'Administrador', 'email' => 'admin@empresa.com', 'tipo' => 'funcionario'],
    998 => ['nome' => 'Usuário Demo', 'email' => 'demo@demo.com', 'tipo' => 'funcionario'],
    999 => ['nome' => 'Usuário Teste', 'email' => 'test@test.com', 'tipo' => 'funcionario']
];

// Obter método e caminho da requisição
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/auth', '', $requestUri);

// Router
if ($method === 'POST' && $path === '/login') {
    handleLogin();
} elseif ($method === 'POST' && $path === '/register') {
    handleRegister();
} elseif ($method === 'POST' && $path === '/create-first-admin') {
    handleCreateFirstAdmin();
} elseif ($method === 'POST' && $path === '/reset-admin-password') {
    handleResetAdminPassword();
} elseif ($method === 'GET' && $path === '/profile') {
    handleProfile();
} elseif ($method === 'GET' && $path === '/preferences') {
    handlePreferences();
} elseif ($method === 'GET' && $path === '/test-db') {
    handleTestDb();
} else {
    jsonResponse(['error' => 'Rota não encontrada'], 404);
}

/**
 * POST /api/auth/login
 */
function handleLogin() {
    global $TEST_USERS, $TEST_USERS_BY_ID;
    
    $data = getJsonInput();
    $email = $data['email'] ?? '';
    $password = $data['senha'] ?? $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        jsonResponse(['error' => 'Email e senha são obrigatórios'], 400);
    }
    
    // Verificar usuários de teste primeiro
    if (isset($TEST_USERS[$email]) && $TEST_USERS[$email]['password'] === $password) {
        $testUser = $TEST_USERS[$email];
        
        $payload = [
            'id' => $testUser['id'],
            'email' => $email,
            'tipo_colaborador' => $testUser['tipo']
        ];
        
        $token = createJWT($payload);
        
        jsonResponse([
            'token' => $token,
            'user' => [
                'id' => $testUser['id'],
                'nome' => $testUser['nome'],
                'email' => $email,
                'tipo' => $testUser['tipo']
            ],
            'testMode' => true,
            'note' => 'Login em modo teste - banco de dados não foi consultado'
        ]);
    }
    
    // Tentar login no banco de dados
    try {
        // Verificar conexão
        $testResult = dbQuery('SELECT 1 as test');
        if (empty($testResult)) {
            jsonResponse(['error' => 'Erro de conexão com o banco de dados'], 500);
        }
        
        // Buscar usuário
        $user = dbQueryOne('SELECT * FROM colaboradores WHERE email = ?', [$email]);
        
        if (!$user) {
            // Verificar se existe mas está inativo
            $inactiveUser = dbQueryOne('SELECT * FROM colaboradores WHERE email = ?', [$email]);
            if ($inactiveUser && !$inactiveUser['ativo']) {
                jsonResponse(['error' => 'Usuário inativo. Entre em contato com o administrador.'], 401);
            }
            
            // Verificar se há usuários no banco
            $count = dbQueryOne('SELECT COUNT(*) as total FROM colaboradores');
            if ($count['total'] == 0) {
                jsonResponse(['error' => 'Nenhum usuário cadastrado. Crie o primeiro administrador acessando: POST /api/auth/create-first-admin'], 401);
            }
            
            jsonResponse(['error' => 'Credenciais inválidas'], 401);
        }
        
        // Verificar senha
        if (!verifyPassword($password, $user['senha_hash'])) {
            jsonResponse(['error' => 'Credenciais inválidas'], 401);
        }
        
        // Atualizar último login
        dbExecute('UPDATE colaboradores SET data_ultimo_login = NOW() WHERE id_colaborador = ?', [$user['id_colaborador']]);
        
        // Gerar token
        $payload = [
            'id' => $user['id_colaborador'],
            'email' => $user['email'],
            'tipo_colaborador' => $user['tipo_colaborador']
        ];
        
        $token = createJWT($payload);
        
        jsonResponse([
            'token' => $token,
            'user' => [
                'id' => $user['id_colaborador'],
                'nome' => $user['nome_completo'],
                'email' => $user['email'],
                'tipo' => $user['tipo_colaborador']
            ]
        ]);
        
    } catch (Exception $e) {
        error_log('Login error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao fazer login'], 500);
    }
}

/**
 * POST /api/auth/register
 */
function handleRegister() {
    $data = getJsonInput();
    
    $required = ['cpf', 'nome_completo', 'email', 'senha'];
    $errors = validateRequiredFields($data, $required);
    
    if (!empty($errors)) {
        jsonResponse(['error' => implode(', ', $errors)], 400);
    }
    
    try {
        // Verificar se usuário já existe
        $existing = dbQueryOne('SELECT id_colaborador FROM colaboradores WHERE email = ? OR cpf = ?', [$data['email'], $data['cpf']]);
        
        if ($existing) {
            jsonResponse(['error' => 'Colaborador já existe'], 400);
        }
        
        // Buscar permissão padrão
        $permissao = dbQueryOne('SELECT id_permissao FROM permissoes WHERE nome_perfil = ? LIMIT 1', ['Vendedor']);
        
        if (!$permissao) {
            // Criar permissão padrão se não existir
            dbExecute(
                'INSERT INTO permissoes (nome_perfil, descricao, nivel_acesso, permissoes_json) VALUES (?, ?, ?, ?)',
                ['Vendedor', 'Acesso básico ao sistema', 1, json_encode(['leads' => true, 'orcamentos' => true])]
            );
            $permissao['id_permissao'] = dbLastInsertId();
        }
        
        // Hash da senha
        $hashedPassword = hashPassword($data['senha']);
        
        // Criar colaborador
        dbExecute(
            'INSERT INTO colaboradores (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, ativo, id_permissao, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)',
            [
                $data['cpf'],
                $data['nome_completo'],
                $data['email'],
                $hashedPassword,
                $data['telefone'] ?? '',
                $data['tipo_colaborador'] ?? 'vendedor',
                1,
                $permissao['id_permissao'],
                $data['id_usuario_criacao'] ?? 1
            ]
        );
        
        $userId = dbLastInsertId();
        
        jsonResponse(['message' => 'Colaborador registrado com sucesso', 'userId' => $userId], 201);
        
    } catch (Exception $e) {
        error_log('Register error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao registrar colaborador'], 500);
    }
}

/**
 * POST /api/auth/create-first-admin
 */
function handleCreateFirstAdmin() {
    $email = 'admin@empresa.com';
    $password = 'admin123';
    
    try {
        // Verificar se existem usuários
        $result = dbQueryOne('SELECT COUNT(*) as total FROM colaboradores');
        
        if ($result['total'] > 0) {
            // Verificar se admin existe
            $adminExists = dbQueryOne('SELECT id_colaborador FROM colaboradores WHERE email = ?', [$email]);
            
            if ($adminExists) {
                // Atualizar senha
                $hashedPassword = hashPassword($password);
                dbExecute('UPDATE colaboradores SET senha_hash = ?, ativo = 1 WHERE email = ?', [$hashedPassword, $email]);
                
                // Verificar
                $user = dbQueryOne('SELECT senha_hash FROM colaboradores WHERE email = ?', [$email]);
                $isValid = verifyPassword($password, $user['senha_hash']);
                
                jsonResponse([
                    'message' => 'Admin user password updated',
                    'email' => $email,
                    'password' => $password,
                    'verified' => $isValid
                ]);
            }
            
            jsonResponse(['error' => 'Users already exist. Use create-admin script instead.'], 400);
        }
        
        // Criar primeiro admin
        $hashedPassword = hashPassword($password);
        
        // Buscar ou criar permissão de administrador
        $permissions = dbQueryOne('SELECT id_permissao FROM permissoes WHERE nome_perfil = ? LIMIT 1', ['Administrador']);
        
        if (!$permissions) {
            dbExecute(
                'INSERT INTO permissoes (nome_perfil, descricao, nivel_acesso, permissoes_json) VALUES (?, ?, ?, ?)',
                ['Administrador', 'Acesso total ao sistema', 10, json_encode(['all' => true])]
            );
            $idPermissao = dbLastInsertId();
        } else {
            $idPermissao = $permissions['id_permissao'];
        }
        
        // Criar admin
        dbExecute(
            'INSERT INTO colaboradores (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, ativo, id_permissao, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)',
            ['00000000000', 'Administrador', $email, $hashedPassword, '00000000000', 'funcionario', 1, $idPermissao, 1]
        );
        
        $userId = dbLastInsertId();
        
        // Atualizar auto-referência
        dbExecute('UPDATE colaboradores SET id_usuario_criacao = ? WHERE id_colaborador = ?', [$userId, $userId]);
        
        jsonResponse([
            'message' => 'First admin user created successfully',
            'userId' => $userId,
            'email' => $email,
            'password' => $password,
            'note' => 'Please change the password after first login'
        ], 201);
        
    } catch (Exception $e) {
        error_log('Create first admin error: ' . $e->getMessage());
        jsonResponse(['error' => 'Error creating admin user', 'message' => $e->getMessage()], 500);
    }
}

/**
 * POST /api/auth/reset-admin-password
 */
function handleResetAdminPassword() {
    $email = 'admin@empresa.com';
    $password = 'admin123';
    
    try {
        // Verificar se admin existe
        $adminExists = dbQueryOne('SELECT id_colaborador FROM colaboradores WHERE email = ?', [$email]);
        
        if (!$adminExists) {
            jsonResponse(['error' => 'Admin user not found. Use /create-first-admin instead.'], 404);
        }
        
        // Gerar novo hash
        $hashedPassword = hashPassword($password);
        
        // Atualizar senha
        dbExecute('UPDATE colaboradores SET senha_hash = ?, ativo = 1 WHERE email = ?', [$hashedPassword, $email]);
        
        // Verificar
        $user = dbQueryOne('SELECT senha_hash FROM colaboradores WHERE email = ?', [$email]);
        $isValid = verifyPassword($password, $user['senha_hash']);
        
        jsonResponse([
            'message' => 'Admin password reset successfully',
            'email' => $email,
            'password' => $password,
            'verified' => $isValid,
            'note' => 'You can now login with these credentials'
        ]);
        
    } catch (Exception $e) {
        error_log('Reset admin password error: ' . $e->getMessage());
        jsonResponse(['error' => 'Error resetting admin password'], 500);
    }
}

/**
 * GET /api/auth/profile
 */
function handleProfile() {
    global $TEST_USERS_BY_ID;
    
    try {
        $user = requireAuth();
        
        // Verificar se é usuário de teste
        if (isTestUser($user['id'])) {
            $testUser = $TEST_USERS_BY_ID[$user['id']] ?? $TEST_USERS_BY_ID[1];
            
            jsonResponse([
                'id' => $user['id'],
                'nome' => $testUser['nome'],
                'email' => $user['email'] ?? $testUser['email'],
                'tipo' => $user['tipo_colaborador'] ?? $testUser['tipo'],
                'telefone' => '00000000000',
                'cpf' => '00000000000',
                'data_admissao' => date('Y-m-d'),
                'ativo' => 1,
                'id_permissao' => 1,
                'testMode' => true
            ]);
        }
        
        // Buscar dados do usuário no banco
        $userData = dbQueryOne(
            'SELECT id_colaborador, cpf, nome_completo, email, telefone, tipo_colaborador, data_admissao, ativo, id_permissao FROM colaboradores WHERE id_colaborador = ? AND ativo = 1',
            [$user['id']]
        );
        
        if (!$userData) {
            jsonResponse(['error' => 'Usuário não encontrado'], 404);
        }
        
        jsonResponse([
            'id' => $userData['id_colaborador'],
            'nome' => $userData['nome_completo'],
            'email' => $userData['email'],
            'tipo' => $userData['tipo_colaborador'],
            'telefone' => $userData['telefone'],
            'cpf' => $userData['cpf'],
            'data_admissao' => $userData['data_admissao'],
            'ativo' => $userData['ativo'],
            'id_permissao' => $userData['id_permissao']
        ]);
        
    } catch (Exception $e) {
        error_log('Profile error: ' . $e->getMessage());
        
        if ($e->getMessage() === 'Token inválido ou expirado') {
            jsonResponse(['error' => 'Token inválido ou expirado'], 401);
        }
        
        jsonResponse(['error' => 'Erro ao obter perfil do usuário'], 500);
    }
}

/**
 * GET /api/auth/preferences
 */
function handlePreferences() {
    try {
        requireAuth();
        
        // Preferências padrão
        $preferences = [
            'emailNotifications' => true,
            'pushNotifications' => false,
            'darkTheme' => false,
            'compactMenu' => false,
            'dailySummary' => true,
            'expiryAlerts' => true
        ];
        
        jsonResponse($preferences);
        
    } catch (Exception $e) {
        error_log('Preferences error: ' . $e->getMessage());
        jsonResponse(['error' => 'Erro ao obter preferências do usuário'], 500);
    }
}

/**
 * GET /api/auth/test-db
 */
function handleTestDb() {
    try {
        $result = dbQuery('SELECT 1 as test');
        
        if ($result) {
            jsonResponse([
                'status' => 'OK',
                'message' => 'Database connection successful',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        } else {
            jsonResponse(['error' => 'Database query failed'], 500);
        }
        
    } catch (Exception $e) {
        jsonResponse(['error' => 'Database connection failed', 'message' => $e->getMessage()], 500);
    }
}

