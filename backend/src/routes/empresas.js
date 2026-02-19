const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all empresas
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id_empresa as id,
        e.cnpj,
        e.razao_social,
        e.nome_fantasia,
        e.telefone,
        e.email,
        e.ativo,
        e.data_criacao
      FROM empresas e
      ORDER BY e.nome_fantasia ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get empresas error:', error);
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
});

// Get empresa by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM empresas WHERE id_empresa = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get empresa error:', error);
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  }
});

// Create empresa
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { cnpj, razao_social, nome_fantasia, telefone, email } = req.body;

    if (!cnpj || !razao_social || !nome_fantasia) {
      return res.status(400).json({ error: 'CNPJ, razão social e nome fantasia são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO empresas (cnpj, razao_social, nome_fantasia, telefone, email) VALUES (?, ?, ?, ?, ?)`,
      [cnpj, razao_social, nome_fantasia, telefone, email]
    );

    res.status(201).json({ id: result.insertId, message: 'Empresa criada com sucesso' });
  } catch (error) {
    console.error('Create empresa error:', error);
    res.status(500).json({ error: 'Erro ao criar empresa' });
  }
});

// Update empresa
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { cnpj, razao_social, nome_fantasia, telefone, email, ativo } = req.body;

    const [existing] = await pool.query('SELECT id_empresa FROM empresas WHERE id_empresa = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    await pool.query(
      `UPDATE empresas SET cnpj = ?, razao_social = ?, nome_fantasia = ?, telefone = ?, email = ?, ativo = ? WHERE id_empresa = ?`,
      [cnpj, razao_social, nome_fantasia, telefone, email, ativo, id]
    );

    res.json({ message: 'Empresa atualizada com sucesso' });
  } catch (error) {
    console.error('Update empresa error:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
});

// Delete empresa
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_empresa FROM empresas WHERE id_empresa = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    await pool.query('DELETE FROM empresas WHERE id_empresa = ?', [id]);

    res.json({ message: 'Empresa deletada com sucesso' });
  } catch (error) {
    console.error('Delete empresa error:', error);
    res.status(500).json({ error: 'Erro ao deletar empresa' });
  }
});

module.exports = router;

