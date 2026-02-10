const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/pedidos - Get all pedidos
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pedidos ORDER BY data_pedido DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// GET /api/pedidos/:id - Get pedido by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pedidos WHERE id_pedido = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// POST /api/pedidos - Create new pedido
router.post('/', auth, async (req, res) => {
  try {
    const { id_cliente, produtos, valor_total, observacoes } = req.body;

    // Basic validation
    if (!id_cliente || !produtos || valor_total === undefined) {
      return res.status(400).json({ error: 'Cliente, produtos e valor total são obrigatórios' });
    }

    const [result] = await db.execute(
      'INSERT INTO pedidos (id_cliente, produtos, valor_total, observacoes, data_pedido) VALUES (?, ?, ?, ?, NOW())',
      [id_cliente, JSON.stringify(produtos), valor_total, observacoes]
    );
    res.status(201).json({ id: result.insertId, message: 'Pedido criado com sucesso' });
  } catch (error) {
    console.error('Error creating pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

// PUT /api/pedidos/:id - Update pedido
router.put('/:id', auth, async (req, res) => {
  try {
    const { id_cliente, produtos, valor_total, observacoes } = req.body;

    if (!id_cliente || !produtos || valor_total === undefined) {
      return res.status(400).json({ error: 'Cliente, produtos e valor total são obrigatórios' });
    }

    await db.execute(
      'UPDATE pedidos SET id_cliente = ?, produtos = ?, valor_total = ?, observacoes = ? WHERE id_pedido = ?',
      [id_cliente, JSON.stringify(produtos), valor_total, observacoes, req.params.id]
    );
    res.json({ message: 'Pedido atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

// DELETE /api/pedidos/:id - Delete pedido
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM pedidos WHERE id_pedido = ?', [req.params.id]);
    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting pedido:', error);
    res.status(500).json({ error: 'Erro ao deletar pedido' });
  }
});

module.exports = router;
