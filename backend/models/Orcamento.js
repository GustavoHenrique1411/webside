const db = require('../config/database');

class Orcamento {
  static async findAll() {
    const [rows] = await db.execute(`
      SELECT
        o.id_orcamento as id,
        COALESCE(c.razao_social, l.nome_empresa, 'Cliente não identificado') as cliente,
        o.valor_total as valor,
        DATE_FORMAT(o.data_criacao, '%Y-%m-%d') as data,
        DATE_FORMAT(o.data_validade, '%Y-%m-%d') as validade,
        s.nome_status as status
      FROM orcamentos o
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN leads l ON o.id_lead = l.id_lead
      LEFT JOIN status s ON o.id_status = s.id_status
      ORDER BY o.data_criacao DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT
        o.id_orcamento as id,
        o.numero_orcamento,
        COALESCE(c.razao_social, l.nome_empresa, 'Cliente não identificado') as cliente,
        o.valor_total as valor,
        DATE_FORMAT(o.data_criacao, '%Y-%m-%d') as data,
        DATE_FORMAT(o.data_validade, '%Y-%m-%d') as validade,
        s.nome_status as status,
        o.observacoes,
        -- Client data
        c.razao_social as cliente_razao_social,
        c.cnpj as cliente_cnpj,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        c.endereco as cliente_endereco,
        -- Lead data
        l.nome_empresa as lead_empresa,
        l.nome as lead_nome,
        l.email as lead_email,
        l.telefone as lead_telefone,
        l.cargo as lead_cargo,
        -- Collaborator/Vendor data
        col.nome as vendedor,
        col.email as vendedor_email,
        col.telefone as vendedor_telefone,
        -- Company data
        emp.razao_social as empresa_nome,
        emp.cnpj as empresa_cnpj,
        emp.email as empresa_email,
        emp.telefone as empresa_telefone,
        -- Additional orcamento data
        o.id_cliente,
        o.id_lead,
        o.id_colaborador,
        o.id_empresa,
        o.validade_dias
      FROM orcamentos o
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN leads l ON o.id_lead = l.id_lead
      LEFT JOIN status s ON o.id_status = s.id_status
      LEFT JOIN colaboradores col ON o.id_colaborador = col.id_colaborador
      LEFT JOIN empresas emp ON o.id_empresa = emp.id_empresa
      WHERE o.id_orcamento = ?
      LIMIT 1
    `, [id]);

    const orc = rows[0];
    if (!orc) return null;

    const [items] = await db.execute(`
      SELECT
        oi.id_item as id,
        oi.id_produto,
        p.nome as produto,
        oi.descricao_item as descricao,
        oi.quantidade,
        oi.valor_unitario as valorUnitario,
        oi.desconto_percentual as descontoPercentual,
        oi.desconto_valor as descontoValor,
        oi.valor_total as valorTotal,
        oi.ordem
      FROM orcamentos_itens oi
      LEFT JOIN produtos p ON oi.id_produto = p.id_produto
      WHERE oi.id_orcamento = ?
      ORDER BY oi.ordem ASC, oi.id_item ASC
    `, [id]);

    orc.itens = items;
    return orc;
  }

  static async create(data) {
    const { numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_criacao, data_aprovacao, data_validade, itens } = data;
    const [result] = await db.execute(
      'INSERT INTO orcamentos (numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_criacao, data_aprovacao, data_validade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_criacao, data_aprovacao, data_validade]
    );

    const orcamentoId = result.insertId;

    // Save items if provided
    if (itens && Array.isArray(itens) && itens.length > 0) {
      await this.saveItens(orcamentoId, itens);
    }

    return orcamentoId;
  }

  static async update(id, data) {
    const { numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_aprovacao, data_validade } = data;
    await db.execute(
      'UPDATE orcamentos SET numero_orcamento = ?, id_lead = ?, id_cliente = ?, id_colaborador = ?, id_empresa = ?, valor_total = ?, validade_dias = ?, observacoes = ?, id_status = ?, data_aprovacao = ?, data_validade = ? WHERE id_orcamento = ?',
      [numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_aprovacao, data_validade, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM orcamentos WHERE id_orcamento = ?', [id]);
  }

  static async saveItens(orcamentoId, itens) {
    if (!Array.isArray(itens) || itens.length === 0) return;

    const values = itens.map((item, index) => [
      orcamentoId,
      item.id_produto || null,
      item.descricao || item.descricao_item || '',
      item.quantidade || 1,
      item.valorUnitario || item.valor_unitario || 0,
      item.descontoPercentual || item.desconto_percentual || 0,
      item.descontoValor || item.desconto_valor || 0,
      item.valorTotal || item.valor_total || ((item.quantidade || 1) * (item.valorUnitario || item.valor_unitario || 0)),
      index + 1
    ]);

    const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');

    await db.execute(
      `INSERT INTO orcamentos_itens (id_orcamento, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, desconto_valor, valor_total, ordem) VALUES ${placeholders}`,
      values.flat()
    );
  }
}

module.exports = Orcamento;
