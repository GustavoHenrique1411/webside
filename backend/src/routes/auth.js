const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authMiddleware, generateToken } = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM colaboradores WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(senha, user.senha_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id_colaborador,
        nome: user.nome_completo,
        email: user.email,
        nivel_acesso: user.nivel_acesso
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { nome_completo, email, senha, cpf, tipo_colaborador, data_admissao } = req.body;

    if (!nome_completo || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const [existing] = await pool.query(
      'SELECT id_colaborador FROM colaboradores WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      `INSERT INTO colaboradores (nome_completo, email, senha_hash, cpf, tipo_colaborador, data_admissao, id_permissao) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [nome_completo, email, senha_hash, cpf || null, tipo_colaborador || 'funcionario', data_admissao || new Date()]
    );

    res.status(201).json({ message: 'Usuário criado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Get profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_colaborador, nome_completo, email, cpf, telefone, tipo_colaborador, data_admissao, ativo FROM colaboradores WHERE id_colaborador = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { nome_completo, telefone } = req.body;

    await pool.query(
      'UPDATE colaboradores SET nome_completo = ?, telefone = ? WHERE id_colaborador = ?',
      [nome_completo, telefone, req.user.id]
    );

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [rows] = await pool.query(
      'SELECT senha_hash FROM colaboradores WHERE id_colaborador = ?',
      [req.user.id]
    );

    const isValid = await bcrypt.compare(currentPassword, rows[0].senha_hash);

    if (!isValid) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE colaboradores SET senha_hash = ? WHERE id_colaborador = ?',
      [newHash, req.user.id]
    );

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

module.exports = router;

