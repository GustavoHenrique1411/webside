const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all colaboradores
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id_colaborador as id,
        c.cpf,
        c.nome_completo,
        c.email,
        c.telefone,
        c.tipo_colaborador,
        c.data_admissao,
        c.comissao_venda,
        c.comissao_recorrente,
        c.ativo,
        c.data_cadastro,
        p.nome_perfil as perfil
      FROM colaboradores c
      LEFT JOIN permissoes p ON c.id_permissao = p.id_permissao
      ORDER BY c.nome_completo ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get colaboradores error:', error);
    res.status(500).json({ error: 'Erro ao buscar colaboradores' });
  }
});

// Get colaborador by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        p.nome_perfil as perfil
      FROM colaboradores c
      LEFT JOIN permissoes p ON c.id_permissao = p.id_permissao
      WHERE c.id_colaborador = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get colaborador error:', error);
    res.status(500).json({ error: 'Erro ao buscar colaborador' });
  }
});

// Create colaborador
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { cpf, nome_completo, email, senha, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_permissao } = req.body;

    if (!cpf || !nome_completo || !email || !senha) {
      return res.status(400).json({ error: 'CPF, nome, email e senha são obrigatórios' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      `INSERT INTO colaboradores (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_permissao, id_usuario_criacao) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador || 'funcionario', data_admissao || new Date(), comissao_venda || 0, comissao_recorrente || 0, id_permissao || 1, req.user.id]
    );

    res.status(201).json({ id: result.insertId, message: 'Colaborador criado com sucesso' });
  } catch (error) {
    console.error('Create colaborador error:', error);
    res.status(500).json({ error: 'Erro ao criar colaborador' });
  }
});

// Update colaborador
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { cpf, nome_completo, email, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, ativo, id_permissao } = req.body;

    const [existing] = await pool.query('SELECT id_colaborador FROM colaboradores WHERE id_colaborador = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    await pool.query(
      `UPDATE colaboradores SET cpf = ?, nome_completo = ?, email = ?, telefone = ?, tipo_colaborador = ?, data_admissao = ?, comissao_venda = ?, comissao_recorrente = ?, ativo = ?, id_permissao = ? WHERE id_colaborador = ?`,
      [cpf, nome_completo, email, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, ativo, id_permissao, id]
    );

    res.json({ message: 'Colaborador atualizado com sucesso' });
  } catch (error) {
    console.error('Update colaborador error:', error);
    res.status(500).json({ error: 'Erro ao atualizar colaborador' });
  }
});

// Delete colaborador
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_colaborador FROM colaboradores WHERE id_colaborador = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    await pool.query('DELETE FROM colaboradores WHERE id_colaborador = ?', [id]);

    res.json({ message: 'Colaborador deletado com sucesso' });
  } catch (error) {
    console.error('Delete colaborador error:', error);
    res.status(500).json({ error: 'Erro ao deletar colaborador' });
  }
});

module.exports = router;

