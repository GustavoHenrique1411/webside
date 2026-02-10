const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

class AuthService {
  async login(email, password) {
    // Test users for development
    const TEST_USERS = {
      'admin@empresa.com': { password: 'admin123', id: 1, nome: 'Administrador', tipo: 'funcionario' },
      'test@test.com': { password: 'test123', id: 999, nome: 'Usuário Teste', tipo: 'funcionario' }
    };

    // Check test users first
    if (TEST_USERS[email] && TEST_USERS[email].password === password) {
      const token = this.generateToken(TEST_USERS[email]);
      return {
        token,
        user: {
          id: TEST_USERS[email].id,
          nome: TEST_USERS[email].nome,
          email,
          tipo: TEST_USERS[email].tipo
        },
        testMode: true
      };
    }

    try {
      // Find user in database
      const [users] = await db.execute(
        'SELECT * FROM colaboradores WHERE email = ? AND ativo = 1',
        [email]
      );

      if (users.length === 0) {
        return { error: 'Credenciais inválidas', status: 401 };
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.senha_hash);
      if (!isValidPassword) {
        return { error: 'Credenciais inválidas', status: 401 };
      }

      // Update last login
      await this.updateLastLogin(user.id_colaborador);

      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id_colaborador,
          nome: user.nome_completo,
          email: user.email,
          tipo: user.tipo_colaborador
        }
      };
    } catch (error) {
      console.error('Database login error:', error);
      return { error: 'Erro interno do servidor', status: 500 };
    }
  }

  async register(userData) {
    try {
      // Check if user exists
      const existing = await this.findByEmail(userData.email);
      if (existing) {
        return { error: 'Usuário já existe', status: 400 };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.senha, 10);

      // Create user
      const [result] = await db.execute(
        `INSERT INTO colaboradores
        (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, ativo)
        VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 1)`,
        [
          userData.cpf,
          userData.nome_completo,
          userData.email,
          hashedPassword,
          userData.telefone,
          userData.tipo_colaborador || 'vendedor'
        ]
      );

      return { message: 'Usuário registrado com sucesso', userId: result.insertId };
    } catch (error) {
      console.error('Register error:', error);
      return { error: 'Erro ao registrar usuário', status: 500 };
    }
  }

  async getProfile(userId) {
    try {
      const [users] = await db.execute(
        'SELECT id_colaborador, cpf, nome_completo, email, telefone, tipo_colaborador, data_admissao, ativo FROM colaboradores WHERE id_colaborador = ? AND ativo = 1',
        [userId]
      );

      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async getPreferences(userId) {
    // Default preferences - in real app, fetch from database
    return {
      emailNotifications: true,
      pushNotifications: false,
      darkTheme: false,
      compactMenu: false,
      dailySummary: true,
      expiryAlerts: true
    };
  }

  async createFirstAdmin() {
    try {
      const email = 'admin@empresa.com';
      const password = 'admin123';

      // Check if admin exists
      const existing = await this.findByEmail(email);
      if (existing) {
        // Update password
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
          'UPDATE colaboradores SET senha_hash = ?, ativo = 1 WHERE email = ?',
          [hashedPassword, email]
        );
        return { message: 'Senha do admin atualizada', email, password };
      }

      // Create admin
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.execute(
        `INSERT INTO colaboradores
        (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, ativo)
        VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 1)`,
        ['00000000000', 'Administrador', email, hashedPassword, '00000000000', 'funcionario']
      );

      return { message: 'Admin criado com sucesso', email, password, userId: result.insertId };
    } catch (error) {
      console.error('Create first admin error:', error);
      throw error;
    }
  }

  async resetAdminPassword() {
    const email = 'admin@empresa.com';
    const password = 'admin123';

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'UPDATE colaboradores SET senha_hash = ? WHERE email = ?',
      [hashedPassword, email]
    );

    return { message: 'Senha resetada com sucesso', email, password };
  }

  async testDatabase() {
    const [testResult] = await db.execute('SELECT 1 as test, NOW() as current_time');
    const [userCount] = await db.execute('SELECT COUNT(*) as total FROM colaboradores');

    return {
      connection: 'OK',
      totalUsers: userCount[0].total,
      testQuery: testResult[0]
    };
  }

  async findByEmail(email) {
    try {
      const [users] = await db.execute(
        'SELECT * FROM colaboradores WHERE email = ?',
        [email]
      );
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Find by email error:', error);
      return null;
    }
  }

  async updateLastLogin(userId) {
    try {
      await db.execute(
        'UPDATE colaboradores SET ultimo_login = NOW() WHERE id_colaborador = ?',
        [userId]
      );
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id_colaborador || user.id, email: user.email, tipo_colaborador: user.tipo_colaborador || user.tipo },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }
}

module.exports = new AuthService();
