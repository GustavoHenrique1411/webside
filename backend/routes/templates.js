const express = require('express');
const Template = require('../models/Template');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/templates - List all active templates
router.get('/', auth, async (req, res) => {
  try {
    const templates = await Template.findAll();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Erro ao buscar templates' });
  }
});

// GET /api/templates/:id - Get template by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Erro ao buscar template' });
  }
});

// POST /api/templates - Create new template
router.post('/', auth, async (req, res) => {
  try {
    const id = await Template.create(req.body);
    res.status(201).json({ id, message: 'Template criado com sucesso' });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Erro ao criar template' });
  }
});

// PUT /api/templates/:id - Update template
router.put('/:id', auth, async (req, res) => {
  try {
    await Template.update(req.params.id, req.body);
    res.json({ message: 'Template atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Erro ao atualizar template' });
  }
});

// DELETE /api/templates/:id - Soft delete template
router.delete('/:id', auth, async (req, res) => {
  try {
    await Template.delete(req.params.id);
    res.json({ message: 'Template desativado com sucesso' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Erro ao desativar template' });
  }
});

module.exports = router;
