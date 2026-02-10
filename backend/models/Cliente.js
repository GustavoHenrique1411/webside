const db = require('../config/database');

class Cliente {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE ativo = 1');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE id_cliente = ? AND ativo = 1', [id]);
    return rows[0];
  }

  static async create(data) {
    const { id_empresa, id_lead, id_colaborador, razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status, data_cadastro, data_status } = data;
    const [result] = await db.execute(
      'INSERT INTO clientes (id_empresa, id_lead, id_colaborador, razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status, data_cadastro, data_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_empresa, id_lead, id_colaborador, razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status, data_cadastro, data_status]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { id_empresa, id_lead, id_colaborador, razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status, data_status, ativo } = data;
    await db.execute(
      'UPDATE clientes SET id_empresa = ?, id_lead = ?, id_colaborador = ?, razao_social = ?, nome_fantasia = ?, cnpj = ?, inscricao_estadual = ?, data_fundacao = ?, porte_empresa = ?, id_status = ?, data_status = ?, ativo = ? WHERE id_cliente = ?',
      [id_empresa, id_lead, id_colaborador, razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status, data_status, ativo, id]
    );
  }

  static async delete(id) {
    await db.execute('UPDATE clientes SET ativo = 0 WHERE id_cliente = ?', [id]);
  }
}

module.exports = Cliente;
