const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/clientes - Get all clientes
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM clientes ORDER BY data_cadastro DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// GET /api/clientes/:id - Get cliente by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE id_cliente = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// POST /api/clientes - Create new cliente
router.post('/', auth, async (req, res) => {
  try {
    const { razao_social, nome_fantasia, cnpj, email, telefone, endereco, cidade, estado, cep } = req.body;

    // Basic validation
    if (!razao_social || !cnpj) {
      return res.status(400).json({ error: 'Razão social e CNPJ são obrigatórios' });
    }

    const [result] = await db.execute(
      'INSERT INTO clientes (razao_social, nome_fantasia, cnpj, email, telefone, endereco, cidade, estado, cep, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [razao_social, nome_fantasia, cnpj, email, telefone, endereco, cidade, estado, cep]
    );
    res.status(201).json({ id: result.insertId, message: 'Cliente criado com sucesso' });
  } catch (error) {
    console.error('Error creating cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// PUT /api/clientes/:id - Update cliente
router.put('/:id', auth, async (req, res) => {
  try {
    const { razao_social, nome_fantasia, cnpj, email, telefone, endereco, cidade, estado, cep } = req.body;

    if (!razao_social || !cnpj) {
      return res.status(400).json({ error: 'Razão social e CNPJ são obrigatórios' });
    }

    await db.execute(
      'UPDATE clientes SET razao_social = ?, nome_fantasia = ?, cnpj = ?, email = ?, telefone = ?, endereco = ?, cidade = ?, estado = ?, cep = ? WHERE id_cliente = ?',
      [razao_social, nome_fantasia, cnpj, email, telefone, endereco, cidade, estado, cep, req.params.id]
    );
    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// DELETE /api/clientes/:id - Delete cliente
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute('DELETE FROM clientes WHERE id_cliente = ?', [req.params.id]);
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting cliente:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

module.exports = router;
