const db = require('../config/database');

class Implantacao {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM implantacoes');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM implantacoes WHERE id_implantacao = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status, data_criacao } = data;
    const [result] = await db.execute(
      'INSERT INTO implantacoes (id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status, data_criacao]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status } = data;
    await db.execute(
      'UPDATE implantacoes SET id_contrato = ?, id_colaborador = ?, data_inicio_prevista = ?, data_fim_prevista = ?, data_inicio_real = ?, data_fim_real = ?, percentual_conclusao = ?, observacoes = ?, id_status = ? WHERE id_implantacao = ?',
      [id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM implantacoes WHERE id_implantacao = ?', [id]);
  }
}

module.exports = Implantacao;
