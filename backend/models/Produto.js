const db = require('../config/database');

class Produto {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM produtos WHERE ativo = 1');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM produtos WHERE id_produto = ? AND ativo = 1', [id]);
    return rows[0];
  }

  static async create(data) {
    const { codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, id_usuario_criacao } = data;
    const [result] = await db.execute(
      'INSERT INTO produtos (codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, id_usuario_criacao]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, ativo } = data;
    await db.execute(
      'UPDATE produtos SET codigo_produto = ?, nome = ?, descricao = ?, tipo_produto = ?, categoria = ?, valor_base = ?, unidade_medida = ?, estoque_minimo = ?, ativo = ? WHERE id_produto = ?',
      [codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, ativo, id]
    );
  }

  static async delete(id) {
    await db.execute('UPDATE produtos SET ativo = 0 WHERE id_produto = ?', [id]);
  }
}

module.exports = Produto;
