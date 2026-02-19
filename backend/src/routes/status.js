const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all status
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id_status as id,
        s.tipo_entidade,
        s.codigo_status,
        s.nome_status,
        s.descricao,
        s.ordem,
        s.cor_hex,
        s.ativo
      FROM status s
      ORDER BY s.tipo_entidade, s.ordem
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
});

// Get status by type
router.get('/tipo/:tipo', authMiddleware, async (req, res) => {
  try {
    const { tipo } = req.params;
    const [rows] = await pool.query(`
      SELECT * FROM status WHERE tipo_entidade = ? AND ativo = 1 ORDER BY ordem
    `, [tipo]);

    res.json(rows);
  } catch (error) {
    console.error('Get status by tipo error:', error);
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
});

// Create status
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex } = req.body;

    if (!tipo_entidade || !codigo_status || !nome_status || !cor_hex) {
      return res.status(400).json({ error: 'Tipo, código, nome e cor são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES (?, ?, ?, ?, ?, ?)`,
      [tipo_entidade, codigo_status, nome_status, descricao, ordem || 0, cor_hex]
    );

    res.status(201).json({ id: result.insertId, message: 'Status criado com sucesso' });
  } catch (error) {
    console.error('Create status error:', error);
    res.status(500).json({ error: 'Erro ao criar status' });
  }
});

// Update status
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex, ativo } = req.body;

    const [existing] = await pool.query('SELECT id_status FROM status WHERE id_status = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Status não encontrado' });
    }

    await pool.query(
      `UPDATE status SET tipo_entidade = ?, codigo_status = ?, nome_status = ?, descricao = ?, ordem = ?, cor_hex = ?, ativo = ? WHERE id_status = ?`,
      [tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex, ativo, id]
    );

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// Delete status
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_status FROM status WHERE id_status = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Status não encontrado' });
    }

    await pool.query('DELETE FROM status WHERE id_status = ?', [id]);

    res.json({ message: 'Status deletado com sucesso' });
  } catch (error) {
    console.error('Delete status error:', error);
    res.status(500).json({ error: 'Erro ao deletar status' });
  }
});

module.exports = router;

