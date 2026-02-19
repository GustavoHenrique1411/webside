const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get all pedidos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id_pedido as id,
        p.numero_pedido,
        p.data_pedido,
        p.valor_total,
        p.data_prevista_entrega,
        p.observacoes,
        p.data_criacao,
        s.nome_status as status,
        s.cor_hex as status_cor,
        c.razao_social as cliente_nome,
        c.cnpj as cliente_cnpj,
        col.nome_completo as vendedor,
        e.nome_fantasia as empresa_nome,
        o.numero_orcamento
      FROM pedidos p
      LEFT JOIN status s ON p.id_status = s.id_status
      LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
      LEFT JOIN colaboradores col ON p.id_colaborador = col.id_colaborador
      LEFT JOIN empresas e ON p.id_empresa = e.id_empresa
      LEFT JOIN orcamentos o ON p.id_orcamento = o.id_orcamento
      ORDER BY p.data_criacao DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get pedidos error:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Get pedido by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        s.nome_status as status,
        c.razao_social as cliente_nome,
        col.nome_completo as vendedor,
        e.nome_fantasia as empresa_nome
      FROM pedidos p
      LEFT JOIN status s ON p.id_status = s.id_status
      LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
      LEFT JOIN colaboradores col ON p.id_colaborador = col.id_colaborador
      LEFT JOIN empresas e ON p.id_empresa = e.id_empresa
      WHERE p.id_pedido = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Get pedido itens
    const [itens] = await pool.query(`
      SELECT 
        pi.*,
        prod.nome as produto_nome,
        prod.codigo_produto
      FROM pedidos_itens pi
      LEFT JOIN produtos prod ON pi.id_produto = prod.id_produto
      WHERE pi.id_pedido = ?
    `, [id]);

    rows[0].itens = itens;
    res.json(rows[0]);
  } catch (error) {
    console.error('Get pedido error:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// Create pedido
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { numero_pedido, id_orcamento, id_cliente, data_pedido, valor_total, data_prevista_entrega, observacoes, id_empresa, itens } = req.body;

    if (!numero_pedido || !id_cliente || !valor_total) {
      return res.status(400).json({ error: 'Número do pedido, cliente e valor são obrigatórios' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO pedidos (numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 4)`,
        [numero_pedido, id_orcamento, id_cliente, req.user.id, id_empresa || 1, data_pedido || new Date(), valor_total, data_prevista_entrega, observacoes]
      );

      const pedidoId = result.insertId;

      // Insert itens if provided
      if (itens && itens.length > 0) {
        for (const item of itens) {
          await connection.query(
            `INSERT INTO pedidos_itens (id_pedido, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, valor_total) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [pedidoId, item.id_produto, item.descricao_item, item.quantidade, item.valor_unitario, item.desconto_percentual || 0, item.valor_total]
          );
        }
      }

      await connection.commit();
      res.status(201).json({ id: pedidoId, message: 'Pedido criado com sucesso' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create pedido error:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

// Update pedido
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_pedido, id_status, data_pedido, valor_total, data_prevista_entrega, observacoes } = req.body;

    const [existing] = await pool.query('SELECT id_pedido FROM pedidos WHERE id_pedido = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    await pool.query(
      `UPDATE pedidos SET numero_pedido = ?, id_status = ?, data_pedido = ?, valor_total = ?, data_prevista_entrega = ?, observacoes = ? WHERE id_pedido = ?`,
      [numero_pedido, id_status, data_pedido, valor_total, data_prevista_entrega, observacoes, id]
    );

    res.json({ message: 'Pedido atualizado com sucesso' });
  } catch (error) {
    console.error('Update pedido error:', error);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

// Delete pedido
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id_pedido FROM pedidos WHERE id_pedido = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    await pool.query('DELETE FROM pedidos_itens WHERE id_pedido = ?', [id]);
    await pool.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);

    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    console.error('Delete pedido error:', error);
    res.status(500).json({ error: 'Erro ao deletar pedido' });
  }
});

module.exports = router;

