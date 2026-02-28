const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all faturas
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        f.id_fatura as id,
        f.numero_fatura,
        f.data_emissao,
        f.data_vencimento,
        f.valor_original,
        f.valor_final,
        f.data_pagamento,
        f.valor_pago,
        f.observacoes,
        s.nome_status as status,
        s.cor_hex as status_cor,
        c.numero_contrato,
        cl.razao_social as cliente_nome
      FROM faturas f
      LEFT JOIN status s ON f.id_status = s.id_status
      LEFT JOIN contratos c ON f.id_contrato = c.id_contrato
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      ORDER BY f.data_vencimento DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get faturas error:', error);
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
});

// Get fatura by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        f.*,
        s.nome_status as status,
        c.numero_contrato,
        cl.razao_social as cliente_nome
      FROM faturas f
      LEFT JOIN status s ON f.id_status = s.id_status
      LEFT JOIN contratos c ON f.id_contrato = c.id_contrato
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      WHERE f.id_fatura = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get fatura error:', error);
    res.status(500).json({ error: 'Erro ao buscar fatura' });
  }
});

// Create fatura
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { numero_fatura, id_contrato, data_emissao, data_vencimento, valor_original, valor_final, observacoes } = req.body;

    if (!numero_fatura || !id_contrato || !valor_original) {
      return res.status(400).json({ error: 'Número da fatura, contrato e valor são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO faturas (numero_fatura, id_contrato, data_emissao, data_vencimento, valor_original, valor_final, observacoes, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 11)`,
      [numero_fatura, id_contrato, data_emissao, data_vencimento, valor_original, valor_final || valor_original, observacoes]
    );

    res.status(201).json({ id: result.insertId, message: 'Fatura criada com sucesso' });
  } catch (error) {
    console.error('Create fatura error:', error);
    res.status(500).json({ error: 'Erro ao criar fatura' });
  }
});

// Update fatura
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status } = req.body;

    const [existing] = await pool.query('SELECT id_fatura FROM faturas WHERE id_fatura = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }

    await pool.query(
      `UPDATE faturas SET numero_fatura = ?, data_emissao = ?, data_vencimento = ?, valor_original = ?, valor_final = ?, data_pagamento = ?, valor_pago = ?, observacoes = ?, id_status = ? WHERE id_fatura = ?`,
      [numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status, id]
    );

    res.json({ message: 'Fatura atualizada com sucesso' });
  } catch (error) {
    console.error('Update fatura error:', error);
    res.status(500).json({ error: 'Erro ao atualizar fatura' });
  }
});

// Delete fatura
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_fatura FROM faturas WHERE id_fatura = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }

    await pool.query('DELETE FROM faturas WHERE id_fatura = ?', [id]);

    res.json({ message: 'Fatura deletada com sucesso' });
  } catch (error) {
    console.error('Delete fatura error:', error);
    res.status(500).json({ error: 'Erro ao deletar fatura' });
  }
});

module.exports = router;

