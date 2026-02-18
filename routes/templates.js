const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all templates
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.id_template as id,
        t.tipo_template,
        t.nome_template,
        t.assunto,
        t.ativo,
        t.data_criacao
      FROM templates t
      ORDER BY t.nome_template ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Erro ao buscar templates' });
  }
});

// Get template by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM templates WHERE id_template = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Erro ao buscar template' });
  }
});

// Create template
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tipo_template, nome_template, assunto, conteudo, variaveis } = req.body;

    if (!tipo_template || !nome_template || !conteudo) {
      return res.status(400).json({ error: 'Tipo, nome e conteúdo são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO templates (tipo_template, nome_template, assunto, conteudo, variaveis, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?)`,
      [tipo_template, nome_template, assunto, conteudo, JSON.stringify(variaveis || []), req.user.id]
    );

    res.status(201).json({ id: result.insertId, message: 'Template criado com sucesso' });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Erro ao criar template' });
  }
});

// Update template
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_template, nome_template, assunto, conteudo, variaveis, ativo } = req.body;

    const [existing] = await pool.query('SELECT id_template FROM templates WHERE id_template = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    await pool.query(
      `UPDATE templates SET tipo_template = ?, nome_template = ?, assunto = ?, conteudo = ?, variaveis = ?, ativo = ? WHERE id_template = ?`,
      [tipo_template, nome_template, assunto, conteudo, JSON.stringify(variaveis || []), ativo, id]
    );

    res.json({ message: 'Template atualizado com sucesso' });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Erro ao atualizar template' });
  }
});

// Delete template
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_template FROM templates WHERE id_template = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    await pool.query('DELETE FROM templates WHERE id_template = ?', [id]);

    res.json({ message: 'Template deletado com sucesso' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Erro ao deletar template' });
  }
});

module.exports = router;

