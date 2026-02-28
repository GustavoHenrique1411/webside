const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all orcamentos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id_orcamento as id,
        o.numero_orcamento,
        o.valor_total,
        o.validade_dias,
        o.observacoes,
        o.data_criacao,
        o.data_aprovacao,
        o.data_validade,
        s.nome_status as status,
        s.cor_hex as status_cor,
        c.razao_social as cliente_nome,
        l.nome_empresa as lead_nome,
        col.nome_completo as vendedor,
        e.nome_fantasia as empresa_nome
      FROM orcamentos o
      LEFT JOIN status s ON o.id_status = s.id_status
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN leads l ON o.id_lead = l.id_lead
      LEFT JOIN colaboradores col ON o.id_colaborador = col.id_colaborador
      LEFT JOIN empresas e ON o.id_empresa = e.id_empresa
      ORDER BY o.data_criacao DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get orcamentos error:', error);
    res.status(500).json({ error: 'Erro ao buscar orçamentos' });
  }
});

// Get orcamento by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        o.*,
        s.nome_status as status,
        c.razao_social as cliente_nome,
        col.nome_completo as vendedor
      FROM orcamentos o
      LEFT JOIN status s ON o.id_status = s.id_status
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN colaboradores col ON o.id_colaborador = col.id_colaborador
      WHERE o.id_orcamento = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }

    // Get orcamento itens
    const [itens] = await pool.query(`
      SELECT 
        oi.*,
        prod.nome as produto_nome,
        prod.codigo_produto
      FROM orcamentos_itens oi
      LEFT JOIN produtos prod ON oi.id_produto = prod.id_produto
      WHERE oi.id_orcamento = ?
    `, [id]);

    rows[0].itens = itens;
    res.json(rows[0]);
  } catch (error) {
    console.error('Get orcamento error:', error);
    res.status(500).json({ error: 'Erro ao buscar orçamento' });
  }
});

// Create orcamento
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { numero_orcamento, id_lead, id_cliente, valor_total, validade_dias, observacoes, id_empresa, itens } = req.body;

    if (!numero_orcamento || !valor_total) {
      return res.status(400).json({ error: 'Número do orçamento e valor são obrigatórios' });
    }

    const data_validade = new Date();
    data_validade.setDate(data_validade.getDate() + (validade_dias || 30));

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO orcamentos (numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_validade) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 17, ?)`,
        [numero_orcamento, id_lead, id_cliente, req.user.id, id_empresa || 1, valor_total, validade_dias || 30, observacoes, data_validade]
      );

      const orcamentoId = result.insertId;

      // Insert itens if provided
      if (itens && itens.length > 0) {
        for (let i = 0; i < itens.length; i++) {
          const item = itens[i];
          await connection.query(
            `INSERT INTO orcamentos_itens (id_orcamento, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, desconto_valor, valor_total, ordem) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [orcamentoId, item.id_produto, item.descricao_item, item.quantidade, item.valor_unitario, item.desconto_percentual || 0, item.desconto_valor || 0, item.valor_total, i + 1]
          );
        }
      }

      await connection.commit();
      res.status(201).json({ id: orcamentoId, message: 'Orçamento criado com sucesso' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create orcamento error:', error);
    res.status(500).json({ error: 'Erro ao criar orçamento' });
  }
});

// Update orcamento
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_orcamento, valor_total, validade_dias, observacoes, id_status } = req.body;

    const [existing] = await pool.query('SELECT id_orcamento FROM orcamentos WHERE id_orcamento = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }

    await pool.query(
      `UPDATE orcamentos SET numero_orcamento = ?, valor_total = ?, validade_dias = ?, observacoes = ?, id_status = ? WHERE id_orcamento = ?`,
      [numero_orcamento, valor_total, validade_dias, observacoes, id_status, id]
    );

    res.json({ message: 'Orçamento atualizado com sucesso' });
  } catch (error) {
    console.error('Update orcamento error:', error);
    res.status(500).json({ error: 'Erro ao atualizar orçamento' });
  }
});

// Update orcamento status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [existing] = await pool.query('SELECT id_orcamento FROM orcamentos WHERE id_orcamento = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }

    await pool.query(
      `UPDATE orcamentos SET id_status = ? WHERE id_orcamento = ?`,
      [status, id]
    );

    res.json({ message: 'Status do orçamento atualizado com sucesso' });
  } catch (error) {
    console.error('Update orcamento status error:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do orçamento' });
  }
});

// Delete orcamento
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_orcamento FROM orcamentos WHERE id_orcamento = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }

    await pool.query('DELETE FROM orcamentos_itens WHERE id_orcamento = ?', [id]);
    await pool.query('DELETE FROM orcamentos WHERE id_orcamento = ?', [id]);

    res.json({ message: 'Orçamento deletado com sucesso' });
  } catch (error) {
    console.error('Delete orcamento error:', error);
    res.status(500).json({ error: 'Erro ao deletar orçamento' });
  }
});

module.exports = router;

