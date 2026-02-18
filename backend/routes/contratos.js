const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all contratos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id_contrato as id,
        c.numero_contrato,
        c.data_assinatura,
        c.data_inicio_vigencia,
        c.data_fim_vigencia,
        c.valor_total,
        c.renovacao_automatica,
        c.periodicidade_reajuste,
        c.arquivo_url,
        c.observacoes,
        c.data_criacao,
        s.nome_status as status,
        s.cor_hex as status_cor,
        cl.razao_social as cliente_nome,
        cl.cnpj as cliente_cnpj,
        p.numero_pedido as pedido_numero,
        col.nome_completo as responsavel
      FROM contratos c
      LEFT JOIN status s ON c.id_status = s.id_status
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN pedidos p ON c.id_pedido = p.id_pedido
      LEFT JOIN colaboradores col ON c.id_colaborador = col.id_colaborador
      ORDER BY c.data_criacao DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get contratos error:', error);
    res.status(500).json({ error: 'Erro ao buscar contratos' });
  }
});

// Get contrato by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        s.nome_status as status,
        cl.razao_social as cliente_nome,
        p.numero_pedido as pedido_numero
      FROM contratos c
      LEFT JOIN status s ON c.id_status = s.id_status
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN pedidos p ON c.id_pedido = p.id_pedido
      WHERE c.id_contrato = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    // Get aditivos
    const [aditivos] = await pool.query(`
      SELECT * FROM contratos_aditivos WHERE id_contrato = ?
    `, [id]);

    rows[0].aditivos = aditivos;
    res.json(rows[0]);
  } catch (error) {
    console.error('Get contrato error:', error);
    res.status(500).json({ error: 'Erro ao buscar contrato' });
  }
});

// Create contrato
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes } = req.body;

    if (!numero_contrato || !id_pedido || !id_cliente || !valor_total) {
      return res.status(400).json({ error: 'Número do contrato, pedido, cliente e valor são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO contratos (numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5)`,
      [numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica || 0, periodicidade_reajuste, arquivo_url, observacoes]
    );

    res.status(201).json({ id: result.insertId, message: 'Contrato criado com sucesso' });
  } catch (error) {
    console.error('Create contrato error:', error);
    res.status(500).json({ error: 'Erro ao criar contrato' });
  }
});

// Update contrato
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_contrato, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status } = req.body;

    const [existing] = await pool.query('SELECT id_contrato FROM contratos WHERE id_contrato = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    await pool.query(
      `UPDATE contratos SET numero_contrato = ?, data_assinatura = ?, data_inicio_vigencia = ?, data_fim_vigencia = ?, valor_total = ?, renovacao_automatica = ?, periodicidade_reajuste = ?, arquivo_url = ?, observacoes = ?, id_status = ? WHERE id_contrato = ?`,
      [numero_contrato, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status, id]
    );

    res.json({ message: 'Contrato atualizado com sucesso' });
  } catch (error) {
    console.error('Update contrato error:', error);
    res.status(500).json({ error: 'Erro ao atualizar contrato' });
  }
});

// Delete contrato
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_contrato FROM contratos WHERE id_contrato = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    await pool.query('DELETE FROM contratos_aditivos WHERE id_contrato = ?', [id]);
    await pool.query('DELETE FROM contratos WHERE id_contrato = ?', [id]);

    res.json({ message: 'Contrato deletado com sucesso' });
  } catch (error) {
    console.error('Delete contrato error:', error);
    res.status(500).json({ error: 'Erro ao deletar contrato' });
  }
});

module.exports = router;

