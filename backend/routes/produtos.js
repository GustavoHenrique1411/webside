const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/produtos - Get all produtos
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM produtos ORDER BY nome_produto');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// GET /api/produtos/:id - Get produto by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM produtos WHERE id_produto = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// POST /api/produtos - Create new produto
router.post('/', auth, async (req, res) => {
  try {
    const { nome_produto, descricao, preco, categoria } = req.body;

    // Basic validation
    if (!nome_produto || preco === undefined) {
      return res.status(400).json({ error: 'Nome do produto e preço são obrigatórios' });
    }

    const [result] = await db.execute(
      'INSERT INTO produtos (nome_produto, descricao, preco, categoria, data_criacao) VALUES (?, ?, ?, ?, NOW())',
      [nome_produto, descricao, preco, categoria]
    );
    res.status(201).json({ id: result.insertId, message: 'Produto criado com sucesso' });
  } catch (error) {
    console.error('Error creating produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// PUT /api/produtos/:id - Update produto
router.put('/:id', auth, async (req, res) => {
  try {
    const { nome_produto, descricao, preco, categoria } = req.body;

    if (!nome_produto || preco === undefined) {
      return res.status(400).json({ error: 'Nome do produto e preço são obrigatórios' });
    }

    await db.execute(
      'UPDATE produtos SET nome_produto = ?, descricao = ?, preco = ?, categoria = ? WHERE id_produto = ?',
      [nome_produto, descricao, preco, categoria, req.params.id]
    );
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// DELETE /api/produtos/:id - Delete produto
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM produtos WHERE id_produto = ?', [req.params.id]);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

module.exports = router;
