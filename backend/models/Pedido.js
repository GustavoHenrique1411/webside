const db = require('../config/database');

class Pedido {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM pedidos');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status, data_criacao } = data;
    const [result] = await db.execute(
      'INSERT INTO pedidos (numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status, data_criacao]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status } = data;
    await db.execute(
      'UPDATE pedidos SET numero_pedido = ?, id_orcamento = ?, id_cliente = ?, id_colaborador = ?, id_empresa = ?, data_pedido = ?, valor_total = ?, data_prevista_entrega = ?, observacoes = ?, id_status = ? WHERE id_pedido = ?',
      [numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
  }
}

module.exports = Pedido;
