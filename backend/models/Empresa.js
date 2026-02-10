const db = require('../config/database');

class Empresa {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM empresas WHERE ativo = 1');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM empresas WHERE id_empresa = ? AND ativo = 1', [id]);
    return rows[0];
  }

  static async create(data) {
    const { cnpj, razao_social, nome_fantasia, telefone, email } = data;
    const [result] = await db.execute(
      'INSERT INTO empresas (cnpj, razao_social, nome_fantasia, telefone, email) VALUES (?, ?, ?, ?, ?)',
      [cnpj, razao_social, nome_fantasia, telefone, email]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { cnpj, razao_social, nome_fantasia, telefone, email, ativo } = data;
    await db.execute(
      'UPDATE empresas SET cnpj = ?, razao_social = ?, nome_fantasia = ?, telefone = ?, email = ?, ativo = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id_empresa = ?',
      [cnpj, razao_social, nome_fantasia, telefone, email, ativo, id]
    );
  }

  static async delete(id) {
    await db.execute('UPDATE empresas SET ativo = 0 WHERE id_empresa = ?', [id]);
  }
}

module.exports = Empresa;
