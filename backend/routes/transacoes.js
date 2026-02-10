const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get all transacoes
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM transacoes ORDER BY data_criacao DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching transacoes:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// Get transacao by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM transacoes WHERE id_transacao = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching transacao:', error);
    res.status(500).json({ error: 'Erro ao buscar transação' });
  }
});

// Create new transacao
router.post('/', auth, async (req, res) => {
  try {
    const { tipo, valor, data, descricao, categoria, forma_pagamento, status } = req.body;

    const [result] = await db.execute(
      'INSERT INTO transacoes (tipo, valor, data, descricao, categoria, forma_pagamento, status, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [tipo, valor, data, descricao, categoria, forma_pagamento, status, req.user.id]
    );

    res.status(201).json({ id: result.insertId, message: 'Transação criada com sucesso' });
  } catch (error) {
    console.error('Error creating transacao:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Update transacao
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, valor, data, descricao, categoria, forma_pagamento, status } = req.body;

    const [result] = await db.execute(
      'UPDATE transacoes SET tipo = ?, valor = ?, data = ?, descricao = ?, categoria = ?, forma_pagamento = ?, status = ? WHERE id_transacao = ?',
      [tipo, valor, data, descricao, categoria, forma_pagamento, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json({ message: 'Transação atualizada com sucesso' });
  } catch (error) {
    console.error('Error updating transacao:', error);
    res.status(500).json({ error: 'Erro ao atualizar transação' });
  }
});

// Delete transacao
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM transacoes WHERE id_transacao = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    console.error('Error deleting transacao:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
});

module.exports = router;
