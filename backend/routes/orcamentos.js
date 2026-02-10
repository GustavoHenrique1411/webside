const express = require('express');
const Orcamento = require('../models/Orcamento');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/orcamentos - List all orcamentos
router.get('/', auth, async (req, res) => {
  try {
    const orcamentos = await Orcamento.findAll();
    res.json(orcamentos);
  } catch (error) {
    console.error('Error fetching orcamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar orçamentos' });
  }
});

// GET /api/orcamentos/:id - Get orcamento by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const orcamento = await Orcamento.findById(req.params.id);
    if (!orcamento) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }
    res.json(orcamento);
  } catch (error) {
    console.error('Error fetching orcamento:', error);
    res.status(500).json({ error: 'Erro ao buscar orçamento' });
  }
});

// POST /api/orcamentos - Create new orcamento
router.post('/', auth, async (req, res) => {
  try {
    const id = await Orcamento.create(req.body);
    res.status(201).json({ id, message: 'Orçamento criado com sucesso' });
  } catch (error) {
    console.error('Error creating orcamento:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Número do orçamento já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro ao criar orçamento' });
    }
  }
});

// PUT /api/orcamentos/:id - Update orcamento
router.put('/:id', auth, async (req, res) => {
  try {
    await Orcamento.update(req.params.id, req.body);
    res.json({ message: 'Orçamento atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating orcamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar orçamento' });
  }
});

// DELETE /api/orcamentos/:id - Delete orcamento
router.delete('/:id', auth, async (req, res) => {
  try {
    await Orcamento.delete(req.params.id);
    res.json({ message: 'Orçamento deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting orcamento:', error);
    res.status(500).json({ error: 'Erro ao deletar orçamento' });
  }
});

module.exports = router;
