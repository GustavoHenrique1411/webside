const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/leads - Get all leads
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id_lead as id, nome_empresa as empresa, contato_principal as nome, email_contato as email, telefone_contato as telefone, fonte_lead as origem, observacoes, data_criacao FROM leads ORDER BY data_criacao DESC');
    // Add default status since it's not in DB
    const leadsWithStatus = rows.map(lead => ({ ...lead, status: 'Novo' }));
    res.json(leadsWithStatus);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

// GET /api/leads/:id - Get lead by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM leads WHERE id_lead = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Lead não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Erro ao buscar lead' });
  }
});

// POST /api/leads - Create new lead
router.post('/', auth, async (req, res) => {
  try {
    const { nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, observacoes } = req.body;

    // Basic validation
    if (!nome_empresa || !contato_principal) {
      return res.status(400).json({ error: 'Nome da empresa e contato principal são obrigatórios' });
    }

    const [result] = await db.execute(
      'INSERT INTO leads (nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, observacoes, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, observacoes]
    );
    res.status(201).json({ id: result.insertId, message: 'Lead criado com sucesso' });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Erro ao criar lead' });
  }
});

// PUT /api/leads/:id - Update lead
router.put('/:id', auth, async (req, res) => {
  try {
    const { nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, observacoes } = req.body;

    if (!nome_empresa || !contato_principal) {
      return res.status(400).json({ error: 'Nome da empresa e contato principal são obrigatórios' });
    }

    await db.execute(
      'UPDATE leads SET nome_empresa = ?, cnpj = ?, contato_principal = ?, email_contato = ?, telefone_contato = ?, fonte_lead = ?, observacoes = ? WHERE id_lead = ?',
      [nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, observacoes, req.params.id]
    );
    res.json({ message: 'Lead atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Erro ao atualizar lead' });
  }
});

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM leads WHERE id_lead = ?', [req.params.id]);
    res.json({ message: 'Lead deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Erro ao deletar lead' });
  }
});

module.exports = router;
