const db = require('../config/database');

class Lead {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM leads');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM leads WHERE id_lead = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { id_empresa, id_colaborador, nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, id_status, observacoes, data_criacao } = data;
    const [result] = await db.execute(
      'INSERT INTO leads (id_empresa, id_colaborador, nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, id_status, observacoes, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_empresa, id_colaborador, nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, id_status, observacoes, data_criacao]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { id_empresa, id_colaborador, nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, id_status, observacoes, data_conversao } = data;
    await db.execute(
      'UPDATE leads SET id_empresa = ?, id_colaborador = ?, nome_empresa = ?, cnpj = ?, contato_principal = ?, email_contato = ?, telefone_contato = ?, fonte_lead = ?, probabilidade = ?, valor_estimado = ?, id_status = ?, observacoes = ?, data_conversao = ? WHERE id_lead = ?',
      [id_empresa, id_colaborador, nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, id_status, observacoes, data_conversao, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM leads WHERE id_lead = ?', [id]);
  }
}

module.exports = Lead;
