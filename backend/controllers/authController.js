const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, senha, password } = req.body;
      const userPassword = senha || password;

      if (!email || !userPassword) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const result = await authService.login(email, userPassword);

      if (result.error) {
        return res.status(result.status || 401).json({ error: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async register(req, res) {
    try {
      const userData = req.body;

      if (!userData.cpf || !userData.nome_completo || !userData.email || !userData.senha) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando' });
      }

      const result = await authService.register(userData);

      if (result.error) {
        return res.status(result.status || 400).json({ error: result.error });
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await authService.getProfile(userId);

      if (!profile) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(profile);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = await authService.getPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error('Get preferences error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async createFirstAdmin(req, res) {
    try {
      const result = await authService.createFirstAdmin();
      res.json(result);
    } catch (error) {
      console.error('Create first admin error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async resetAdminPassword(req, res) {
    try {
      const result = await authService.resetAdminPassword();
      res.json(result);
    } catch (error) {
      console.error('Reset admin password error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async testDatabase(req, res) {
    try {
      const result = await authService.testDatabase();
      res.json(result);
    } catch (error) {
      console.error('Test database error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = new AuthController();
