const express = require('express');
const Contrato = require('../models/Contrato');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/contratos - List all contratos
router.get('/', auth, async (req, res) => {
  try {
    const contratos = await Contrato.findAll();
    res.json(contratos);
  } catch (error) {
    console.error('Error fetching contratos:', error);
    res.status(500).json({ error: 'Erro ao buscar contratos' });
  }
});

// GET /api/contratos/:id - Get contrato by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const contrato = await Contrato.findById(req.params.id);
    if (!contrato) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }
    res.json(contrato);
  } catch (error) {
    console.error('Error fetching contrato:', error);
    res.status(500).json({ error: 'Erro ao buscar contrato' });
  }
});

// POST /api/contratos - Create new contrato
router.post('/', auth, async (req, res) => {
  try {
    const id = await Contrato.create(req.body);
    res.status(201).json({ id, message: 'Contrato criado com sucesso' });
  } catch (error) {
    console.error('Error creating contrato:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Número do contrato já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro ao criar contrato' });
    }
  }
});

// PUT /api/contratos/:id - Update contrato
router.put('/:id', auth, async (req, res) => {
  try {
    await Contrato.update(req.params.id, req.body);
    res.json({ message: 'Contrato atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating contrato:', error);
    res.status(500).json({ error: 'Erro ao atualizar contrato' });
  }
});

// DELETE /api/contratos/:id - Delete contrato
router.delete('/:id', auth, async (req, res) => {
  try {
    await Contrato.delete(req.params.id);
    res.json({ message: 'Contrato deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting contrato:', error);
    res.status(500).json({ error: 'Erro ao deletar contrato' });
  }
});

module.exports = router;
