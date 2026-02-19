const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all leads
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id_lead as id,
        l.nome_empresa as empresa,
        l.cnpj,
        l.contato_principal as nome,
        l.email_contato as email,
        l.telefone_contato as telefone,
        l.fonte_lead as origem,
        l.probabilidade,
        l.valor_estimado,
        l.observacoes,
        l.data_criacao,
        s.nome_status as status,
        s.cor_hex as status_cor,
        c.nome_completo as responsavel,
        e.nome_fantasia as empresa_nome
      FROM leads l
      LEFT JOIN status s ON l.id_status = s.id_status
      LEFT JOIN colaboradores c ON l.id_colaborador = c.id_colaborador
      LEFT JOIN empresas e ON l.id_empresa = e.id_empresa
      ORDER BY l.data_criacao DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

// Get lead by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        l.*,
        s.nome_status as status,
        c.nome_completo as responsavel
      FROM leads l
      LEFT JOIN status s ON l.id_status = s.id_status
      LEFT JOIN colaboradores c ON l.id_colaborador = c.id_colaborador
      WHERE l.id_lead = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Erro ao buscar lead' });
  }
});

// Create lead
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, observacoes, id_empresa } = req.body;

    if (!nome_empresa || !contato_principal) {
      return res.status(400).json({ error: 'Nome da empresa e contato principal são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO leads (nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, observacoes, id_empresa, id_colaborador, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 12)`,
      [nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade || 0, valor_estimado, observacoes, id_empresa || 1, req.user.id]
    );

    res.status(201).json({ id: result.insertId, message: 'Lead criado com sucesso' });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Erro ao criar lead' });
  }
});

// Update lead
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, observacoes, id_status } = req.body;

    const [existing] = await pool.query('SELECT id_lead FROM leads WHERE id_lead = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    await pool.query(
      `UPDATE leads SET nome_empresa = ?, cnpj = ?, contato_principal = ?, email_contato = ?, telefone_contato = ?, fonte_lead = ?, probabilidade = ?, valor_estimado = ?, observacoes = ?, id_status = ? WHERE id_lead = ?`,
      [nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, observacoes, id_status, id]
    );

    res.json({ message: 'Lead atualizado com sucesso' });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Erro ao atualizar lead' });
  }
});

// Delete lead
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_lead FROM leads WHERE id_lead = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    await pool.query('DELETE FROM leads WHERE id_lead = ?', [id]);

    res.json({ message: 'Lead deletado com sucesso' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Erro ao deletar lead' });
  }
});

module.exports = router;

