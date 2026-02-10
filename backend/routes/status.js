const express = require('express');
const Status = require('../models/Status');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/status - List all active status
router.get('/', auth, async (req, res) => {
  try {
    const status = await Status.findAll();
    res.json(status);
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
});

// GET /api/status/:id - Get status by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const statusItem = await Status.findById(req.params.id);
    if (!statusItem) {
      return res.status(404).json({ error: 'Status não encontrado' });
    }
    res.json(statusItem);
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
});

// POST /api/status - Create new status
router.post('/', auth, async (req, res) => {
  try {
    const id = await Status.create(req.body);
    res.status(201).json({ id, message: 'Status criado com sucesso' });
  } catch (error) {
    console.error('Error creating status:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Código do status já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro ao criar status' });
    }
  }
});

// PUT /api/status/:id - Update status
router.put('/:id', auth, async (req, res) => {
  try {
    await Status.update(req.params.id, req.body);
    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// DELETE /api/status/:id - Soft delete status
router.delete('/:id', auth, async (req, res) => {
  try {
    await Status.delete(req.params.id);
    res.json({ message: 'Status desativado com sucesso' });
  } catch (error) {
    console.error('Error deleting status:', error);
    res.status(500).json({ error: 'Erro ao desativar status' });
  }
});

module.exports = router;
