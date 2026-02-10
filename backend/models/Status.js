const db = require('../config/database');

class Status {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM status WHERE ativo = 1');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM status WHERE id_status = ? AND ativo = 1', [id]);
    return rows[0];
  }

  static async create(data) {
    const { tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex } = data;
    const [result] = await db.execute(
      'INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES (?, ?, ?, ?, ?, ?)',
      [tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex, ativo } = data;
    await db.execute(
      'UPDATE status SET tipo_entidade = ?, codigo_status = ?, nome_status = ?, descricao = ?, ordem = ?, cor_hex = ?, ativo = ? WHERE id_status = ?',
      [tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex, ativo, id]
    );
  }

  static async delete(id) {
    await db.execute('UPDATE status SET ativo = 0 WHERE id_status = ?', [id]);
  }
}

module.exports = Status;
