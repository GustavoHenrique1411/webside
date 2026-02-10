const express = require('express');
const Empresa = require('../models/Empresa');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/empresas - List all active empresas
router.get('/', auth, async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    res.json(empresas);
  } catch (error) {
    console.error('Error fetching empresas:', error);
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
});

// GET /api/empresas/:id - Get empresa by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    res.json(empresa);
  } catch (error) {
    console.error('Error fetching empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  }
});

// POST /api/empresas - Create new empresa
router.post('/', auth, async (req, res) => {
  try {
    const id = await Empresa.create(req.body);
    res.status(201).json({ id, message: 'Empresa criada com sucesso' });
  } catch (error) {
    console.error('Error creating empresa:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'CNPJ já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro ao criar empresa' });
    }
  }
});

// PUT /api/empresas/:id - Update empresa
router.put('/:id', auth, async (req, res) => {
  try {
    await Empresa.update(req.params.id, req.body);
    res.json({ message: 'Empresa atualizada com sucesso' });
  } catch (error) {
    console.error('Error updating empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
});

// DELETE /api/empresas/:id - Soft delete empresa
router.delete('/:id', auth, async (req, res) => {
  try {
    await Empresa.delete(req.params.id);
    res.json({ message: 'Empresa desativada com sucesso' });
  } catch (error) {
    console.error('Error deleting empresa:', error);
    res.status(500).json({ error: 'Erro ao desativar empresa' });
  }
});

module.exports = router;
