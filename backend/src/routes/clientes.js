const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all clientes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id_cliente as id,
        c.razao_social,
        c.nome_fantasia,
        c.cnpj,
        c.inscricao_estadual,
        c.data_fundacao,
        c.porte_empresa,
        c.ativo,
        c.data_cadastro,
        s.nome_status as status,
        s.cor_hex as status_cor,
        e.nome_fantasia as empresa_nome,
        col.nome_completo as responsavel
      FROM clientes c
      LEFT JOIN status s ON c.id_status = s.id_status
      LEFT JOIN empresas e ON c.id_empresa = e.id_empresa
      LEFT JOIN colaboradores col ON c.id_colaborador = col.id_colaborador
      ORDER BY c.data_cadastro DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get clientes error:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// Get cliente by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        s.nome_status as status,
        e.nome_fantasia as empresa_nome,
        col.nome_completo as responsavel
      FROM clientes c
      LEFT JOIN status s ON c.id_status = s.id_status
      LEFT JOIN empresas e ON c.id_empresa = e.id_empresa
      LEFT JOIN colaboradores col ON c.id_colaborador = col.id_colaborador
      WHERE c.id_cliente = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get cliente error:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// Create cliente
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_empresa, id_lead, observacoes } = req.body;

    if (!razao_social || !cnpj || !porte_empresa) {
      return res.status(400).json({ error: 'Razão social, CNPJ e porte da empresa são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO clientes (razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_empresa, id_colaborador, id_lead, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_empresa || 1, req.user.id, id_lead || null]
    );

    res.status(201).json({ id: result.insertId, message: 'Cliente criado com sucesso' });
  } catch (error) {
    console.error('Create cliente error:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// Update cliente
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status, observacoes } = req.body;

    const [existing] = await pool.query('SELECT id_cliente FROM clientes WHERE id_cliente = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await pool.query(
      `UPDATE clientes SET razao_social = ?, nome_fantasia = ?, cnpj = ?, inscricao_estadual = ?, data_fundacao = ?, porte_empresa = ?, id_status = ?, observacoes = ? WHERE id_cliente = ?`,
      [razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status, observacoes, id]
    );

    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    console.error('Update cliente error:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// Delete cliente
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_cliente FROM clientes WHERE id_cliente = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);

    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error('Delete cliente error:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

module.exports = router;

