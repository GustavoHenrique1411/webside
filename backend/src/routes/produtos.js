const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all produtos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id_produto as id,
        p.codigo_produto,
        p.nome,
        p.descricao,
        p.tipo_produto,
        p.categoria,
        p.valor_base,
        p.unidade_medida,
        p.estoque_minimo,
        p.ativo,
        p.data_criacao
      FROM produtos p
      ORDER BY p.nome ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get produtos error:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Get produto by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM produtos WHERE id_produto = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get produto error:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Create produto
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo } = req.body;

    if (!codigo_produto || !nome || !tipo_produto || !categoria || !valor_base || !unidade_medida) {
      return res.status(400).json({ error: 'Código, nome, tipo, categoria, valor e unidade são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO produtos (codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, id_usuario_criacao) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, req.user.id]
    );

    res.status(201).json({ id: result.insertId, message: 'Produto criado com sucesso' });
  } catch (error) {
    console.error('Create produto error:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Update produto
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, ativo } = req.body;

    const [existing] = await pool.query('SELECT id_produto FROM produtos WHERE id_produto = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await pool.query(
      `UPDATE produtos SET codigo_produto = ?, nome = ?, descricao = ?, tipo_produto = ?, categoria = ?, valor_base = ?, unidade_medida = ?, estoque_minimo = ?, ativo = ? WHERE id_produto = ?`,
      [codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, ativo, id]
    );

    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Update produto error:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Delete produto
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_produto FROM produtos WHERE id_produto = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await pool.query('DELETE FROM produtos WHERE id_produto = ?', [id]);

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Delete produto error:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

module.exports = router;

