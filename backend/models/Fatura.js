const db = require('../config/database');

class Fatura {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM faturas');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM faturas WHERE id_fatura = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status } = data;
    const [result] = await db.execute(
      'INSERT INTO faturas (id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status } = data;
    await db.execute(
      'UPDATE faturas SET id_contrato = ?, numero_fatura = ?, data_emissao = ?, data_vencimento = ?, valor_original = ?, valor_final = ?, data_pagamento = ?, valor_pago = ?, observacoes = ?, id_status = ? WHERE id_fatura = ?',
      [id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM faturas WHERE id_fatura = ?', [id]);
  }
}

module.exports = Fatura;
