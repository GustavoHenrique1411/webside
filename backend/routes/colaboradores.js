const express = require('express');
const Colaborador = require('../models/Colaborador');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/colaboradores - List all active colaboradores
router.get('/', auth, async (req, res) => {
  try {
    const colaboradores = await Colaborador.findAll();
    res.json(colaboradores);
  } catch (error) {
    console.error('Error fetching colaboradores:', error);
    res.status(500).json({ error: 'Erro ao buscar colaboradores' });
  }
});

// GET /api/colaboradores/:id - Get colaborador by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const colaborador = await Colaborador.findById(req.params.id);
    if (!colaborador) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }
    res.json(colaborador);
  } catch (error) {
    console.error('Error fetching colaborador:', error);
    res.status(500).json({ error: 'Erro ao buscar colaborador' });
  }
});

// POST /api/colaboradores - Create new colaborador
router.post('/', auth, async (req, res) => {
  try {
    const id = await Colaborador.create(req.body);
    res.status(201).json({ id, message: 'Colaborador criado com sucesso' });
  } catch (error) {
    console.error('Error creating colaborador:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'CPF ou email já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro ao criar colaborador' });
    }
  }
});

// PUT /api/colaboradores/:id - Update colaborador
router.put('/:id', auth, async (req, res) => {
  try {
    await Colaborador.update(req.params.id, req.body);
    res.json({ message: 'Colaborador atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating colaborador:', error);
    res.status(500).json({ error: 'Erro ao atualizar colaborador' });
  }
});

// DELETE /api/colaboradores/:id - Soft delete colaborador
router.delete('/:id', auth, async (req, res) => {
  try {
    await Colaborador.delete(req.params.id);
    res.json({ message: 'Colaborador desativado com sucesso' });
  } catch (error) {
    console.error('Error deleting colaborador:', error);
    res.status(500).json({ error: 'Erro ao desativar colaborador' });
  }
});

module.exports = router;
