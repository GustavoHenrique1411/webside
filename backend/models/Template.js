const db = require('../config/database');

class Template {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM templates WHERE ativo = 1');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM templates WHERE id_template = ? AND ativo = 1', [id]);
    return rows[0];
  }

  static async create(data) {
    const { tipo_template, nome_template, assunto, conteudo, variaveis, id_usuario_criacao } = data;
    const [result] = await db.execute(
      'INSERT INTO templates (tipo_template, nome_template, assunto, conteudo, variaveis, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?)',
      [tipo_template, nome_template, assunto, conteudo, variaveis, id_usuario_criacao]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { tipo_template, nome_template, assunto, conteudo, variaveis, ativo } = data;
    await db.execute(
      'UPDATE templates SET tipo_template = ?, nome_template = ?, assunto = ?, conteudo = ?, variaveis = ?, ativo = ? WHERE id_template = ?',
      [tipo_template, nome_template, assunto, conteudo, variaveis, ativo, id]
    );
  }

  static async delete(id) {
    await db.execute('UPDATE templates SET ativo = 0 WHERE id_template = ?', [id]);
  }
}

module.exports = Template;
