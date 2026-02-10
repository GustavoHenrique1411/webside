const express = require('express');
const Fatura = require('../models/Fatura');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/faturas - List all faturas
router.get('/', auth, async (req, res) => {
  try {
    const faturas = await Fatura.findAll();
    res.json(faturas);
  } catch (error) {
    console.error('Error fetching faturas:', error);
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
});

// GET /api/faturas/:id - Get fatura by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const fatura = await Fatura.findById(req.params.id);
    if (!fatura) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }
    res.json(fatura);
  } catch (error) {
    console.error('Error fetching fatura:', error);
    res.status(500).json({ error: 'Erro ao buscar fatura' });
  }
});

// POST /api/faturas - Create new fatura
router.post('/', auth, async (req, res) => {
  try {
    const id = await Fatura.create(req.body);
    res.status(201).json({ id, message: 'Fatura criada com sucesso' });
  } catch (error) {
    console.error('Error creating fatura:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Número da fatura já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro ao criar fatura' });
    }
  }
});

// PUT /api/faturas/:id - Update fatura
router.put('/:id', auth, async (req, res) => {
  try {
    await Fatura.update(req.params.id, req.body);
    res.json({ message: 'Fatura atualizada com sucesso' });
  } catch (error) {
    console.error('Error updating fatura:', error);
    res.status(500).json({ error: 'Erro ao atualizar fatura' });
  }
});

// DELETE /api/faturas/:id - Delete fatura
router.delete('/:id', auth, async (req, res) => {
  try {
    await Fatura.delete(req.params.id);
    res.json({ message: 'Fatura deletada com sucesso' });
  } catch (error) {
    console.error('Error deleting fatura:', error);
    res.status(500).json({ error: 'Erro ao deletar fatura' });
  }
});

module.exports = router;
