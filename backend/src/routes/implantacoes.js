const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all implantacoes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        i.id_implantacao as id,
        i.data_inicio_prevista,
        i.data_fim_prevista,
        i.data_inicio_real,
        i.data_fim_real,
        i.percentual_conclusao,
        i.observacoes,
        i.data_criacao,
        s.nome_status as status,
        s.cor_hex as status_cor,
        c.numero_contrato,
        cl.razao_social as cliente_nome,
        col.nome_completo as responsavel
      FROM implantacoes i
      LEFT JOIN status s ON i.id_status = s.id_status
      LEFT JOIN contratos c ON i.id_contrato = c.id_contrato
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN colaboradores col ON i.id_colaborador = col.id_colaborador
      ORDER BY i.data_criacao DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get implantacoes error:', error);
    res.status(500).json({ error: 'Erro ao buscar implantações' });
  }
});

// Get implantacao by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        i.*,
        s.nome_status as status,
        c.numero_contrato,
        cl.razao_social as cliente_nome,
        col.nome_completo as responsavel
      FROM implantacoes i
      LEFT JOIN status s ON i.id_status = s.id_status
      LEFT JOIN contratos c ON i.id_contrato = c.id_contrato
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN colaboradores col ON i.id_colaborador = col.id_colaborador
      WHERE i.id_implantacao = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Implantação não encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get implantacao error:', error);
    res.status(500).json({ error: 'Erro ao buscar implantação' });
  }
});

// Create implantacao
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id_contrato, data_inicio_prevista, data_fim_prevista, observacoes } = req.body;

    if (!id_contrato || !data_inicio_prevista || !data_fim_prevista) {
      return res.status(400).json({ error: 'Contrato, data de início e fim são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO implantacoes (id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, observacoes, id_status) 
       VALUES (?, ?, ?, ?, ?, 8)`,
      [id_contrato, req.user.id, data_inicio_prevista, data_fim_prevista, observacoes]
    );

    res.status(201).json({ id: result.insertId, message: 'Implantação criada com sucesso' });
  } catch (error) {
    console.error('Create implantacao error:', error);
    res.status(500).json({ error: 'Erro ao criar implantação' });
  }
});

// Update implantacao
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status } = req.body;

    const [existing] = await pool.query('SELECT id_implantacao FROM implantacoes WHERE id_implantacao = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Implantação não encontrada' });
    }

    await pool.query(
      `UPDATE implantacoes SET data_inicio_prevista = ?, data_fim_prevista = ?, data_inicio_real = ?, data_fim_real = ?, percentual_conclusao = ?, observacoes = ?, id_status = ? WHERE id_implantacao = ?`,
      [data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status, id]
    );

    res.json({ message: 'Implantação atualizada com sucesso' });
  } catch (error) {
    console.error('Update implantacao error:', error);
    res.status(500).json({ error: 'Erro ao atualizar implantação' });
  }
});

// Delete implantacao
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_implantacao FROM implantacoes WHERE id_implantacao = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Implantação não encontrada' });
    }

    await pool.query('DELETE FROM implantacoes WHERE id_implantacao = ?', [id]);

    res.json({ message: 'Implantação deletada com sucesso' });
  } catch (error) {
    console.error('Delete implantacao error:', error);
    res.status(500).json({ error: 'Erro ao deletar implantação' });
  }
});

module.exports = router;

