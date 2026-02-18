const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all transacoes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.id_transacao as id,
        t.tipo_transacao,
        t.descricao,
        t.valor,
        t.data_transacao,
        t.data_criacao,
        c.razao_social as cliente_nome,
        f.numero_fatura
      FROM transacoes t
      LEFT JOIN clientes c ON t.id_cliente = c.id_cliente
      LEFT JOIN faturas f ON t.id_fatura = f.id_fatura
      ORDER BY t.data_transacao DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get transacoes error:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// Get transacao by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        t.*,
        c.razao_social as cliente_nome,
        f.numero_fatura
      FROM transacoes t
      LEFT JOIN clientes c ON t.id_cliente = c.id_cliente
      LEFT JOIN faturas f ON t.id_fatura = f.id_fatura
      WHERE t.id_transacao = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get transacao error:', error);
    res.status(500).json({ error: 'Erro ao buscar transação' });
  }
});

// Create transacao
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tipo_transacao, descricao, valor, data_transacao, id_cliente, id_fatura } = req.body;

    if (!tipo_transacao || !descricao || !valor) {
      return res.status(400).json({ error: 'Tipo, descrição e valor são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO transacoes (tipo_transacao, descricao, valor, data_transacao, id_cliente, id_fatura) VALUES (?, ?, ?, ?, ?, ?)`,
      [tipo_transacao, descricao, valor, data_transacao || new Date(), id_cliente, id_fatura]
    );

    res.status(201).json({ id: result.insertId, message: 'Transação criada com sucesso' });
  } catch (error) {
    console.error('Create transacao error:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Update transacao
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_transacao, descricao, valor, data_transacao, id_cliente, id_fatura } = req.body;

    const [existing] = await pool.query('SELECT id_transacao FROM transacoes WHERE id_transacao = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    await pool.query(
      `UPDATE transacoes SET tipo_transacao = ?, descricao = ?, valor = ?, data_transacao = ?, id_cliente = ?, id_fatura = ? WHERE id_transacao = ?`,
      [tipo_transacao, descricao, valor, data_transacao, id_cliente, id_fatura, id]
    );

    res.json({ message: 'Transação atualizada com sucesso' });
  } catch (error) {
    console.error('Update transacao error:', error);
    res.status(500).json({ error: 'Erro ao atualizar transação' });
  }
});

// Delete transacao
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_transacao FROM transacoes WHERE id_transacao = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    await pool.query('DELETE FROM transacoes WHERE id_transacao = ?', [id]);

    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    console.error('Delete transacao error:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
});

module.exports = router;

