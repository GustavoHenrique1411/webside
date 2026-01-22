const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const Colaborador = require('../models/Colaborador');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/test-db', authController.testDatabase);

router.post('/reset-admin-password', authController.resetAdminPassword);
router.post('/register', authController.register);
// POST /api/auth/create-first-admin - Create first admin user if none exists
router.post('/create-first-admin', async (req, res) => {
  try {
    console.log('=== CREATING FIRST ADMIN USER ===');
    
    const email = 'admin@empresa.com';
    const password = 'admin123';
    
    // Check if any user exists
    const [existingUsers] = await db.execute('SELECT COUNT(*) as total FROM colaboradores');
    
    if (existingUsers[0].total > 0) {
      // Check if admin user exists
      const [adminExists] = await db.execute('SELECT id_colaborador FROM colaboradores WHERE email = ?', [email]);
      
      if (adminExists.length > 0) {
        // Update password with fresh hash
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('UPDATE colaboradores SET senha_hash = ?, ativo = 1 WHERE email = ?', [hashedPassword, email]);
        console.log('Admin password updated with new hash');
        
        // Verify the hash works
        const [verifyUser] = await db.execute('SELECT senha_hash FROM colaboradores WHERE email = ?', [email]);
        const isValid = await bcrypt.compare(password, verifyUser[0].senha_hash);
        console.log('Password verification:', isValid ? 'SUCCESS' : 'FAILED');
        
        return res.json({ 
          message: 'Admin user password updated', 
          email, 
          password,
          verified: isValid
        });
      }
      
      return res.status(400).json({ error: 'Users already exist. Use create-admin script instead.' });
    }
    
    // Create first admin - no foreign key constraints needed
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // First create permission
    let [permissions] = await db.execute('SELECT id_permissao FROM permissoes WHERE nome_perfil = ? LIMIT 1', ['Administrador']);
    let idPermissao;
    
    if (permissions.length === 0) {
      try {
        const [permResult] = await db.execute(
          'INSERT INTO permissoes (nome_perfil, descricao, nivel_acesso, permissoes_json) VALUES (?, ?, ?, ?)',
          ['Administrador', 'Acesso total ao sistema', 10, JSON.stringify({ all: true })]
        );
        idPermissao = permResult.insertId;
        console.log('Created permission:', idPermissao);
      } catch (permError) {
        // If permissions table doesn't exist, try without foreign key
        console.log('Permission table issue, trying without foreign key...');
        idPermissao = 1; // Default
      }
    } else {
      idPermissao = permissions[0].id_permissao;
    }
    
    // Create admin user
    const [result] = await db.execute(
      `INSERT INTO colaboradores 
      (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, ativo, id_permissao, id_usuario_criacao) 
      VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
      ['00000000000', 'Administrador', email, hashedPassword, '00000000000', 'funcionario', 1, idPermissao, 1]
    );
    
    const userId = result.insertId;
    
    // Update self-reference
    await db.execute('UPDATE colaboradores SET id_usuario_criacao = ? WHERE id_colaborador = ?', [userId, userId]);
    
    console.log('First admin user created successfully!');
    console.log(`User ID: ${userId}`);
    
    res.json({
      message: 'First admin user created successfully',
      userId,
      email,
      password,
      note: 'Please change the password after first login'
    });
  } catch (error) {
    console.error('Error creating first admin:', error);
    res.status(500).json({
      error: 'Error creating admin user',
      message: error.message,
      details: error.sqlMessage || error.message
    });
  }
});

// POST /api/auth/reset-admin-password - Reset admin password (useful for fixing login issues)
router.post('/reset-admin-password', async (req, res) => {
  try {
    console.log('=== RESETTING ADMIN PASSWORD ===');
    
    const email = 'admin@empresa.com';
    const password = 'admin123';
    
    // Check if admin exists
    const [adminExists] = await db.execute('SELECT id_colaborador FROM colaboradores WHERE email = ?', [email]);
    
    if (adminExists.length === 0) {
      return res.status(404).json({ error: 'Admin user not found. Use /create-first-admin instead.' });
    }
    
    // Generate new hash
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('New hash generated');
    
    // Update password
    await db.execute(
      'UPDATE colaboradores SET senha_hash = ?, ativo = 1 WHERE email = ?',
      [hashedPassword, email]
    );
    
    // Verify the hash
    const [verifyUser] = await db.execute('SELECT senha_hash FROM colaboradores WHERE email = ?', [email]);
    const isValid = await bcrypt.compare(password, verifyUser[0].senha_hash);
    
    console.log('Password reset completed. Verification:', isValid ? 'SUCCESS' : 'FAILED');
    
    res.json({
      message: 'Admin password reset successfully',
      email,
      password,
      verified: isValid,
      note: 'You can now login with these credentials'
    });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    res.status(500).json({
      error: 'Error resetting admin password',
      message: error.message
    });
  }
});

// POST /api/auth/register - Register new colaborador
router.post('/register', async (req, res) => {
  try {
    const { cpf, nome_completo, email, senha, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_permissao } = req.body;

    // Basic validation
    if (!cpf || !nome_completo || !email || !senha) {
      return res.status(400).json({ error: 'CPF, nome completo, email e senha são obrigatórios' });
    }

    // Check if colaborador already exists
    const existing = await Colaborador.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Colaborador já existe' });
    }

    // Create colaborador
    const id = await Colaborador.create({
      cpf,
      nome_completo,
      email,
      senha,
      telefone,
      tipo_colaborador: tipo_colaborador || 'vendedor',
      data_admissao: data_admissao || new Date(),
      comissao_venda,
      comissao_recorrente,
      id_permissao,
      id_usuario_criacao: null
    });

    res.status(201).json({ message: 'Colaborador registrado com sucesso', userId: id });
  } catch (error) {
    console.error('Error registering colaborador:', error);
    res.status(500).json({ error: 'Erro ao registrar colaborador' });
  }
});

// POST /api/auth/login - Login colaborador
router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Request body:', { email: req.body.email, hasPassword: !!(req.body.senha || req.body.password) });
    
    const { email, senha, password } = req.body;
    // Aceita tanto 'senha' (do frontend) quanto 'password' (compatibilidade)
    const userPassword = senha || password;

    if (!email || !userPassword) {
      console.log('Validation failed: missing email or password');
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // ============================================================================
    // MODO TESTE: Login sem banco de dados (sempre ativo para facilitar testes)
    // ============================================================================
    // Usuários de teste que funcionam sem banco de dados
    const TEST_USERS = {
      'admin@empresa.com': { password: 'admin123', id: 1, nome: 'Administrador', tipo: 'funcionario' },
      'admin@empresa': { password: 'admin123', id: 1, nome: 'Administrador', tipo: 'funcionario' },
      'test@test.com': { password: 'test123', id: 999, nome: 'Usuário Teste', tipo: 'funcionario' },
      'demo@demo.com': { password: 'demo123', id: 998, nome: 'Usuário Demo', tipo: 'funcionario' }
    };

    // Verificar primeiro se é um usuário de teste (sempre verifica, não precisa de banco)
    if (TEST_USERS[email] && TEST_USERS[email].password === userPassword) {
      console.log('=== LOGIN TESTE (SEM BANCO DE DADOS) ===');
      console.log(`Test user login: ${email}`);
      
      const testUser = TEST_USERS[email];
      const token = jwt.sign(
        { id: testUser.id, email: email, tipo_colaborador: testUser.tipo },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('Test login successful!');
      console.log('=== END LOGIN ATTEMPT ===\n');

      return res.json({
        token,
        user: {
          id: testUser.id,
          nome: testUser.nome,
          email: email,
          tipo: testUser.tipo
        },
        testMode: true,
        note: 'Login em modo teste - banco de dados não foi consultado'
      });
    }
    // ============================================================================

    console.log(`Searching for user with email: ${email}`);

    // Test database connection first
    try {
      const [testResult] = await db.execute('SELECT 1 as test');
      console.log('Database connection OK, test query result:', testResult);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
    }

    // Check if table exists and has data
    try {
      const [tableCheck] = await db.execute('SELECT COUNT(*) as total FROM colaboradores');
      console.log(`Total colaboradores in database: ${tableCheck[0].total}`);
    } catch (tableError) {
      console.error('Error checking colaboradores table:', tableError);
      return res.status(500).json({ error: 'Erro ao acessar tabela de colaboradores' });
    }

    // Find colaborador
    console.log('Calling Colaborador.findByEmail...');
    const colaborador = await Colaborador.findByEmail(email);
    console.log('Colaborador found:', colaborador ? 'YES' : 'NO');
    
    if (!colaborador) {
      // Try to find without active filter to see if user exists but is inactive
      try {
        const [inactiveCheck] = await db.execute('SELECT * FROM colaboradores WHERE email = ?', [email]);
        if (inactiveCheck.length > 0) {
          console.log(`User found but inactive. Active status: ${inactiveCheck[0].ativo}`);
          return res.status(401).json({ error: 'Usuário inativo. Entre em contato com o administrador.' });
        } else {
          console.log(`No user found with email: ${email}`);
          // Check if this is the first login attempt and no users exist
          const [userCount] = await db.execute('SELECT COUNT(*) as total FROM colaboradores');
          if (userCount[0].total === 0) {
            console.log('No users in database. Suggest creating first admin.');
            return res.status(401).json({ 
              error: 'Nenhum usuário cadastrado. Crie o primeiro administrador acessando: POST /api/auth/create-first-admin' 
            });
          }
        }
      } catch (err) {
        console.error('Error checking inactive user:', err);
      }
      
      console.log(`Login attempt failed: User not found for email: ${email}`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    console.log(`User found: ID=${colaborador.id_colaborador}, Email=${colaborador.email}, Active=${colaborador.ativo}`);
    console.log('Password hash exists:', !!colaborador.senha_hash);

    // Check password
    console.log('Comparing passwords...');
    const isValidPassword = await bcrypt.compare(userPassword, colaborador.senha_hash);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log(`Login attempt failed: Invalid password for email: ${email}`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Update last login
    console.log('Updating last login...');
    await Colaborador.updateLastLogin(colaborador.id_colaborador);

    // Generate JWT
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { id: colaborador.id_colaborador, email: colaborador.email, tipo_colaborador: colaborador.tipo_colaborador },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful!');
    console.log('=== END LOGIN ATTEMPT ===\n');

    res.json({
      token,
      user: {
        id: colaborador.id_colaborador,
        nome: colaborador.nome_completo,
        email: colaborador.email,
        tipo: colaborador.tipo_colaborador
      }
    });
  } catch (error) {
    console.error('=== ERROR IN LOGIN ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR ===\n');
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// GET /api/auth/profile - Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Get user data from database
    const [userData] = await db.execute(
      'SELECT id_colaborador, cpf, nome_completo, email, telefone, tipo_colaborador, data_admissao, ativo, id_permissao FROM colaboradores WHERE id_colaborador = ? AND ativo = 1',
      [decoded.id]
    );

    if (userData.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userData[0];

    res.json({
      id: user.id_colaborador,
      nome: user.nome_completo,
      email: user.email,
      tipo: user.tipo_colaborador,
      telefone: user.telefone,
      cpf: user.cpf,
      data_admissao: user.data_admissao,
      ativo: user.ativo,
      id_permissao: user.id_permissao
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    res.status(500).json({ error: 'Erro ao obter perfil do usuário' });
  }
});

// GET /api/auth/preferences - Get user preferences
router.get('/preferences', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // For now, return default preferences
    // In a real implementation, you would fetch from a user_preferences table
    const preferences = {
      emailNotifications: true,
      pushNotifications: false,
      darkTheme: false,
      compactMenu: false,
      dailySummary: true,
      expiryAlerts: true
    };

    res.json(preferences);
  } catch (error) {
    console.error('Error getting preferences:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    res.status(500).json({ error: 'Erro ao obter preferências do usuário' });
  }
});
router.get('/test-db', authController.testDatabase);

module.exports = router;
