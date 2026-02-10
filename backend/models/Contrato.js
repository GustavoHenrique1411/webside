const db = require('../config/database');

class Contrato {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM contratos');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM contratos WHERE id_contrato = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status, data_criacao } = data;
    const [result] = await db.execute(
      'INSERT INTO contratos (numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status, data_criacao]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status } = data;
    await db.execute(
      'UPDATE contratos SET numero_contrato = ?, id_pedido = ?, id_cliente = ?, data_assinatura = ?, data_inicio_vigencia = ?, data_fim_vigencia = ?, valor_total = ?, renovacao_automatica = ?, periodicidade_reajuste = ?, arquivo_url = ?, observacoes = ?, id_status = ? WHERE id_contrato = ?',
      [numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM contratos WHERE id_contrato = ?', [id]);
  }
}

module.exports = Contrato;
