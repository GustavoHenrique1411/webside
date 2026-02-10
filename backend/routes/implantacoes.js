const express = require('express');
const router = express.Router();
const Implantacao = require('../models/Implantacao');
const auth = require('../middleware/auth');

// GET /api/implantacoes - List all implantacoes
router.get('/', auth, async (req, res) => {
  try {
    const implantacoes = await Implantacao.findAll();
    res.json(implantacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/implantacoes/:id - Get implantacao by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const implantacao = await Implantacao.findById(req.params.id);
    if (!implantacao) {
      return res.status(404).json({ error: 'Implantacao not found' });
    }
    res.json(implantacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/implantacoes - Create new implantacao
router.post('/', auth, async (req, res) => {
  try {
    const id = await Implantacao.create(req.body);
    res.status(201).json({ id, message: 'Implantacao created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/implantacoes/:id - Update implantacao
router.put('/:id', auth, async (req, res) => {
  try {
    await Implantacao.update(req.params.id, req.body);
    res.json({ message: 'Implantacao updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/implantacoes/:id - Delete implantacao
router.delete('/:id', auth, async (req, res) => {
  try {
    await Implantacao.delete(req.params.id);
    res.json({ message: 'Implantacao deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
