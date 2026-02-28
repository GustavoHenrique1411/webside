const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { logger } = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'webside-secret-key';

//========================= HELPER FUNCTIONS =========================

// Helper to format dates
const formatDate = (date) => {
  if (!date) return null;
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return date;
};

const formatDateTime = (date) => {
  if (!date) return null;
  if (date instanceof Date) return date.toISOString();
  return date;
};

const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  const n = typeof value === 'number' ? value : parseFloat(value);
  if (Number.isNaN(n)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
};

// Generate TXT from orçamento
const gerarTxtOrcamento = (orcamento) => {
  let txt = '';
  const empresaNome = orcamento.empresa_nome || 'Webside Sistemas';
  
  txt += '================================================================================\n';
  txt += `                         ORÇAMENTO\n`;
  txt += '================================================================================\n\n';
  
  txt += `Número: ${orcamento.numero_orcamento}\n`;
  txt += `Data: ${new Date(orcamento.data_criacao).toLocaleDateString('pt-BR')}\n`;
  txt += `Validade: ${orcamento.validade_dias} dias\n`;
  txt += `Validade até: ${new Date(orcamento.data_validade).toLocaleDateString('pt-BR')}\n`;
  txt += `Status: ${orcamento.status_nome || 'Pendente'}\n\n`;
  
  txt += '--------------------------------------------------------------------------------\n';
  txt += 'DADOS DO CLIENTE\n';
  txt += '--------------------------------------------------------------------------------\n';
  txt += `Cliente: ${orcamento.cliente_nome || orcamento.lead_nome || 'Não informado'}\n`;
  if (orcamento.cliente) {
    txt += `Razão Social: ${orcamento.cliente.razao_social || '-'}\n`;
    txt += `CNPJ: ${orcamento.cliente.cnpj || '-'}\n`;
    txt += `Telefone: ${orcamento.cliente.telefone_whatsapp || orcamento.cliente.telefone_financeiro || '-'}\n`;
    txt += `Email: ${orcamento.cliente.email_financeiro || '-'}\n`;
  }
  if (orcamento.lead) {
    txt += `Contato: ${orcamento.lead.contato_principal || '-'}\n`;
    txt += `Email: ${orcamento.lead.email_contato || '-'}\n`;
    txt += `Telefone: ${orcamento.lead.telefone_whatsapp || orcamento.lead.telefone_contato || '-'}\n`;
  }
  txt += '\n';
  
  txt += '--------------------------------------------------------------------------------\n';
  txt += 'DADOS DA EMPRESA\n';
  txt += '--------------------------------------------------------------------------------\n';
  txt += `Empresa: ${empresaNome}\n`;
  txt += `\n`;
  
  if (orcamento.vendedor) {
    txt += '--------------------------------------------------------------------------------\n';
    txt += 'VENDEDOR\n';
    txt += '--------------------------------------------------------------------------------\n';
    txt += `Vendedor: ${orcamento.vendedor}\n`;
    txt += '\n';
  }
  
  txt += '--------------------------------------------------------------------------------\n';
  txt += 'ITENS DO ORÇAMENTO\n';
  txt += '--------------------------------------------------------------------------------\n';
  
  if (orcamento.itens && orcamento.itens.length > 0) {
    txt += `${'Item'.padEnd(5)} ${'Descrição'.padEnd(40)} ${'Qtd'.padEnd(8)} ${'Vl.Unit.'.padEnd(14)} ${'Desc.'.padEnd(10)} ${'Total'.padEnd(14)}\n`;
    txt += '-'.repeat(100) + '\n';
    
    orcamento.itens.forEach((item, index) => {
      const descricao = (item.descricao_item || item.produto_nome || '-').substring(0, 38);
      const qtd = item.quantidade.toString();
      const vlUnit = formatCurrency(item.valor_unitario);
      const desc = item.desconto_percentual ? `${item.desconto_percentual}%` : (item.desconto_valor ? formatCurrency(item.desconto_valor) : '-');
      const total = formatCurrency(item.valor_total);
      
      txt += `${(index + 1).toString().padEnd(5)} ${descricao.padEnd(40)} ${qtd.padEnd(8)} ${vlUnit.padEnd(14)} ${desc.padEnd(10)} ${total.padEnd(14)}\n`;
    });
  } else {
    txt += 'Nenhum item cadastrado.\n';
  }
  
  txt += '\n';
  txt += '================================================================================\n';
  txt += `VALOR TOTAL: ${formatCurrency(orcamento.valor_total)}\n`;
  txt += '================================================================================\n\n';
  
  if (orcamento.observacoes) {
    txt += '--------------------------------------------------------------------------------\n';
    txt += 'OBSERVAÇÕES\n';
    txt += '--------------------------------------------------------------------------------\n';
    txt += `${orcamento.observacoes}\n\n`;
  }
  
  txt += '--------------------------------------------------------------------------------\n';
  txt += 'CONDIÇÕES DE PAGAMENTO\n';
  txt += '--------------------------------------------------------------------------------\n';
  txt += 'Forma de pagamento: A definir\n';
  txt += 'Parcelas: A definir\n\n';
  
  txt += '================================================================================\n';
  txt += `Este orçamento é válido até ${new Date(orcamento.data_validade).toLocaleDateString('pt-BR')}\n`;
  txt += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
  txt += `Empresa: ${empresaNome}\n`;
  txt += '================================================================================\n';
  
  return txt;
};

// Generate HTML from orçamento
const gerarHtmlOrcamento = (orcamento) => {
  const empresaNome = orcamento.empresa_nome || 'Webside Sistemas';
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
    .title { font-size: 24px; font-weight: bold; }
    .section { margin: 15px 0; }
    .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .total { font-size: 18px; font-weight: bold; }
    .footer { margin-top: 30px; font-size: 10px; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">ORÇAMENTO</div>
    <div>Número: ${orcamento.numero_orcamento}</div>
    <div>Data: ${new Date(orcamento.data_criacao).toLocaleDateString('pt-BR')}</div>
    <div>Validade: ${orcamento.validade_dias} dias (até ${new Date(orcamento.data_validade).toLocaleDateString('pt-BR')})</div>
    <div>Status: ${orcamento.status_nome || 'Pendente'}</div>
  
  <div class="section">
    <div class="section-title">DADOS DO CLIENTE</div>
    <div><strong>Cliente:</strong> ${orcamento.cliente_nome || orcamento.lead_nome || 'Não informado'}</div>
    ${orcamento.cliente ? `
    <div><strong>Razão Social:</strong> ${orcamento.cliente.razao_social || '-'}</div>
    <div><strong>CNPJ:</strong> ${orcamento.cliente.cnpj || '-'}</div>
    <div><strong>Telefone:</strong> ${orcamento.cliente.telefone_whatsapp || orcamento.cliente.telefone_financeiro || '-'}</div>
    <div><strong>Email:</strong> ${orcamento.cliente.email_financeiro || '-'}</div>
    ` : ''}
    ${orcamento.lead ? `
    <div><strong>Contato:</strong> ${orcamento.lead.contato_principal || '-'}</div>
    <div><strong>Email:</strong> ${orcamento.lead.email_contato || '-'}</div>
    <div><strong>Telefone:</strong> ${orcamento.lead.telefone_whatsapp || orcamento.lead.telefone_contato || '-'}</div>
    ` : ''}
  </div>
  
  <div class="section">
    <div class="section-title">DADOS DA EMPRESA</div>
    <div><strong>Empresa:</strong> ${empresaNome}</div>
  `;
  
  if (orcamento.vendedor) {
    html += `
  <div class="section">
    <div class="section-title">VENDEDOR</div>
    <div><strong>Vendedor:</strong> ${orcamento.vendedor}</div>
    `;
  }
  
  html += `
  <div class="section">
    <div class="section-title">ITENS DO ORÇAMENTO</div>
    <table>
      <thead>
        <tr>
          <th class="text-center">#</th>
          <th>Descrição</th>
          <th class="text-center">Qtd</th>
          <th class="text-right">Vl. Unit.</th>
          <th class="text-right">Desc.</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  if (orcamento.itens && orcamento.itens.length > 0) {
    orcamento.itens.forEach((item, index) => {
      const desc = item.desconto_percentual ? `${item.desconto_percentual}%` : (item.desconto_valor ? formatCurrency(item.desconto_valor) : '-');
      html += `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${item.descricao_item || item.produto_nome || '-'}</td>
          <td class="text-center">${item.quantidade}</td>
          <td class="text-right">${formatCurrency(item.valor_unitario)}</td>
          <td class="text-right">${desc}</td>
          <td class="text-right">${formatCurrency(item.valor_total)}</td>
        </tr>
      `;
    });
  } else {
    html += '<tr><td colspan="6" class="text-center">Nenhum item cadastrado</td></tr>';
  }
  
  html += `
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5" class="text-right total">VALOR TOTAL</td>
          <td class="text-right total">${formatCurrency(orcamento.valor_total)}</td>
        </tr>
      </tfoot>
    </table>
  </div>
  `;
  
  if (orcamento.observacoes) {
    html += `
  <div class="section">
    <div class="section-title">OBSERVAÇÕES</div>
    <div>${orcamento.observacoes}</div>
    `;
  }
  
  html += `
  <div class="section">
    <div class="section-title">CONDIÇÕES DE PAGAMENTO</div>
    <div>Forma de pagamento: A definir</div>
    <div>Parcelas: A definir</div>
  
  <div class="footer">
    <p>Este orçamento é válido até ${new Date(orcamento.data_validade).toLocaleDateString('pt-BR')}</p>
    <p>Gerado em: ${new Date().toLocaleString('pt-BR')} | Empresa: ${empresaNome}</p>
  </div>
</body>
</html>
  `;
  
  return html;
};

// Query resolvers
const Query = {
  // Health check
  health: () => {
    logger.debug('Query: health executada');
    return {
      status: 'ok',
      timestamp: formatDateTime(new Date()),
      uptime: process.uptime()
    };
  },

  // Empresas
  empresas: async () => {
    const startTime = Date.now();
    logger.info('Query: empresas - iniciando busca');
    try {
      const [rows] = await pool.query('SELECT id_empresa as id, cnpj, razao_social, nome_fantasia, telefone, email, ativo, data_criacao, data_atualizacao FROM empresas ORDER BY nome_fantasia');
      logger.trace('Query: empresas', startTime, { count: rows.length });
      return rows;
    } catch (error) {
      logger.errorWithStack('Erro na Query: empresas', error);
      throw error;
    }
  },
  
  empresa: async (_, { id }) => {
    const startTime = Date.now();
    logger.info('Query: empresa', { id });
    try {
      const [rows] = await pool.query('SELECT id_empresa as id, cnpj, razao_social, nome_fantasia, telefone, email, ativo, data_criacao, data_atualizacao FROM empresas WHERE id_empresa = ?', [id]);
      logger.trace('Query: empresa', startTime, { id, found: !!rows[0] });
      return rows[0] || null;
    } catch (error) {
      logger.errorWithStack('Erro na Query: empresa', error, { id });
      throw error;
    }
  },

  // Parametros Empresa
  parametros_empresa: async () => {
    const startTime = Date.now();
    logger.debug('Query: parametros_empresa');
    try {
      const [rows] = await pool.query('SELECT * FROM parametros_empresa LIMIT 1');
      logger.trace('Query: parametros_empresa', startTime, { found: !!rows[0] });
      return rows[0] || null;
    } catch (error) {
      logger.errorWithStack('Erro na Query: parametros_empresa', error);
      throw error;
    }
  },

  // Colaboradores
  colaboradores: async () => {
    const startTime = Date.now();
    logger.info('Query: colaboradores - buscando todos');
    try {
      const [rows] = await pool.query(`
        SELECT 
          c.id_colaborador as id,
          c.cpf,
          c.nome_completo,
          c.email,
          c.telefone,
          c.tipo_colaborador,
          c.data_admissao,
          c.comissao_venda,
          c.comissao_recorrente,
          c.ativo,
          c.data_cadastro,
          c.data_ultimo_login,
          p.nome_perfil as perfil_nome
        FROM colaboradores c
        LEFT JOIN permissoes p ON c.id_permissao = p.id_permissao
        ORDER BY c.nome_completo
      `);
      logger.trace('Query: colaboradores', startTime, { count: rows.length });
      return rows;
    } catch (error) {
      logger.errorWithStack('Erro na Query: colaboradores', error);
      throw error;
    }
  },
  
  colaborador: async (_, { id }) => {
    const startTime = Date.now();
    logger.info('Query: colaborador', { id });
    try {
      const [rows] = await pool.query('SELECT id_colaborador as id, cpf, nome_completo, email, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, ativo, data_cadastro, data_ultimo_login FROM colaboradores WHERE id_colaborador = ?', [id]);
      logger.trace('Query: colaborador', startTime, { id, found: !!rows[0] });
      return rows[0] || null;
    } catch (error) {
      logger.errorWithStack('Erro na Query: colaborador', error, { id });
      throw error;
    }
  },

  // Permissoes
  permissoes: async () => {
    const startTime = Date.now();
    logger.debug('Query: permissoes');
    try {
      const [rows] = await pool.query('SELECT * FROM permissoes ORDER BY nivel_acesso');
      logger.trace('Query: permissoes', startTime, { count: rows.length });
      return rows;
    } catch (error) {
      logger.errorWithStack('Erro na Query: permissoes', error);
      throw error;
    }
  },

  // Departamentos
  departamentos: async () => {
    const startTime = Date.now();
    logger.debug('Query: departamentos');
    try {
      const [rows] = await pool.query(`
        SELECT 
          d.id_departamento as id,
          d.nome,
          d.descricao,
          d.codigo,
          d.ativo,
          d.data_criacao,
          e.nome_fantasia as empresa_nome
        FROM departamentos d
        LEFT JOIN empresas e ON d.id_empresa = e.id_empresa
        ORDER BY d.nome
      `);
      logger.trace('Query: departamentos', startTime, { count: rows.length });
      return rows;
    } catch (error) {
      logger.errorWithStack('Erro na Query: departamentos', error);
      throw error;
    }
  },

  // Colaboradores com departamentos
  colaboradores_com_departamentos: async () => {
    const startTime = Date.now();
    logger.info('Query: colaboradores_com_departamentos - buscando todos');
    try {
      const [rows] = await pool.query(`
        SELECT 
          c.id_colaborador as id,
          c.cpf,
          c.nome_completo,
          c.email,
          c.telefone,
          c.tipo_colaborador,
          c.data_admissao,
          c.comissao_venda,
          c.comissao_recorrente,
          c.ativo,
          c.data_cadastro,
          c.data_ultimo_login,
          p.nome_perfil as perfil_nome,
          GROUP_CONCAT(DISTINCT CONCAT(d.nome, ' (', cd.cargo, ')') SEPARATOR ', ') as departamentos
        FROM colaboradores c
        LEFT JOIN permissoes p ON c.id_permissao = p.id_permissao
        LEFT JOIN colaboradores_departamentos cd ON c.id_colaborador = cd.id_colaborador AND cd.ativo = 1
        LEFT JOIN departamentos d ON cd.id_departamento = d.id_departamento
        GROUP BY c.id_colaborador
        ORDER BY c.nome_completo
      `);
      logger.trace('Query: colaboradores_com_departamentos', startTime, { count: rows.length });
      return rows;
    } catch (error) {
      logger.errorWithStack('Erro na Query: colaboradores_com_departamentos', error);
      throw error;
    }
  },

  // Status
  status: async (_, { tipo_entidade }) => {
    const startTime = Date.now();
    logger.debug('Query: status', { tipo_entidade });
    try {
      let query = 'SELECT * FROM status';
      const params = [];
      if (tipo_entidade) {
        query += ' WHERE tipo_entidade = ?';
        params.push(tipo_entidade);
      }
      query += ' ORDER BY ordem';
      const [rows] = await pool.query(query, params);
      logger.trace('Query: status', startTime, { count: rows.length, tipo_entidade });
      return rows;
    } catch (error) {
      logger.errorWithStack('Erro na Query: status', error, { tipo_entidade });
      throw error;
    }
  },
  
  status_by_id: async (_, { id }) => {
    const startTime = Date.now();
    logger.debug('Query: status_by_id', { id });
    try {
      const [rows] = await pool.query('SELECT * FROM status WHERE id_status = ?', [id]);
      logger.trace('Query: status_by_id', startTime, { id, found: !!rows[0] });
      return rows[0] || null;
    } catch (error) {
      logger.errorWithStack('Erro na Query: status_by_id', error, { id });
      throw error;
    }
  },

  // Leads - with new fields
  leads: async () => {
    const startTime = Date.now();
    logger.info('Query: leads - buscando todos');
    try {
      const [rows] = await pool.query(`
        SELECT 
          l.id_lead as id,
          l.nome_empresa,
          l.cnpj,
          l.contato_principal,
          l.email_contato,
          l.telefone_contato,
          l.telefone_whatsapp,
          l.contato_cargo,
          l.fonte_lead,
          l.probabilidade,
          l.valor_estimado,
          l.observacoes,
          l.data_criacao,
          l.data_conversao,
          s.nome_status as status_nome,
          s.cor_hex as status_cor,
          e.nome_fantasia as empresa_nome,
          c.nome_completo as responsavel
        FROM leads l
        LEFT JOIN status s ON l.id_status = s.id_status
        LEFT JOIN empresas e ON l.id_empresa = e.id_empresa
        LEFT JOIN colaboradores c ON l.id_colaborador = c.id_colaborador
        ORDER BY l.data_criacao DESC
      `);
      logger.trace('Query: leads', startTime, { count: rows.length });
      return rows;
    } catch (error) {
      logger.errorWithStack('Erro na Query: leads', error);
      throw error;
    }
  },
  
  lead: async (_, { id }) => {
    const startTime = Date.now();
    logger.info('Query: lead', { id });
    try {
      const [rows] = await pool.query(`
        SELECT 
          l.id_lead as id,
          l.*,
          s.nome_status as status_nome,
          s.cor_hex as status_cor,
          c.nome_completo as responsavel
        FROM leads l
        LEFT JOIN status s ON l.id_status = s.id_status
        LEFT JOIN colaboradores c ON l.id_colaborador = c.id_colaborador
        WHERE l.id_lead = ?
      `, [id]);
      logger.trace('Query: lead', startTime, { id, found: !!rows[0] });
      return rows[0] || null;
    } catch (error) {
      logger.errorWithStack('Erro na Query: lead', error, { id });
      throw error;
    }
  },

  // Clientes - with new fields
  clientes: async () => {
    const startTime = Date.now();
    logger.info('Query: clientes - buscando todos');
    try {
      const [rows] = await pool.query(`
        SELECT 
          c.id_cliente as id,
          c.razao_social,
          c.nome_fantasia,
          c.cnpj,
          c.inscricao_estadual,
          c.data_fundacao,
          c.porte_empresa,
          c.telefone_whatsapp,
          c.email_financeiro,
          c.telefone_financeiro,
          c.ativo,
          c.data_cadastro,
          s.nome_status as status_nome,
          s.cor_hex as status_cor,
          e.nome_fantasia as empresa_nome,
          col.nome_completo as responsavel
        FROM clientes c
        LEFT JOIN status s ON c.id_status = s.id_status
        LEFT JOIN empresas e ON c.id_empresa = e.id_empresa
        LEFT JOIN colaboradores col ON c.id_colaborador = col.id_colaborador
        ORDER BY c.data_cadastro DESC
      `);
      logger.trace('Query: clientes', startTime, { count: rows.length });
      return rows;
    } catch (error) {
      logger.errorWithStack('Erro na Query: clientes', error);
      throw error;
    }
  },
  
  cliente: async (_, { id }) => {
    const startTime = Date.now();
    logger.info('Query: cliente', { id });
    try {
      const [rows] = await pool.query(`
        SELECT 
          c.id_cliente as id,
          c.*,
          s.nome_status as status_nome,
          e.nome_fantasia as empresa_nome,
          col.nome_completo as responsavel
        FROM clientes c
        LEFT JOIN status s ON c.id_status = s.id_status
        LEFT JOIN empresas e ON c.id_empresa = e.id_empresa
        LEFT JOIN colaboradores col ON c.id_colaborador = col.id_colaborador
        WHERE c.id_cliente = ?
      `, [id]);
      logger.trace('Query: cliente', startTime, { id, found: !!rows[0] });
      return rows[0] || null;
    } catch (error) {
      logger.errorWithStack('Erro na Query: cliente', error, { id });
      throw error;
    }
  },

  // Produtos
  produtos: async () => {
    const startTime = Date.now();
    logger.info('Query: produtos - buscando todos');
    try {
      const [rows] = await pool.query(`
        SELECT p.id_produto as id, p.codigo_produto, p.nome, p.descricao, p.tipo_produto, p.categoria, p.valor_base, p.unidade_medida, p.estoque_minimo, p.ativo, p.data_criacao FROM produtos p ORDER BY p.nome
      `);
      logger.trace('Query: produtos', startTime, { count: rows.length });
      return rows;
    } catch (error) {
      logger.errorWithStack('Erro na Query: produtos', error);
      throw error;
    }
  },
  
  produto: async (_, { id }) => {
    const startTime = Date.now();
    logger.info('Query: produto', { id });
    try {
      const [rows] = await pool.query('SELECT id_produto as id, codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, ativo, data_criacao FROM produtos WHERE id_produto = ?', [id]);
      logger.trace('Query: produto', startTime, { id, found: !!rows[0] });
      return rows[0] || null;
    } catch (error) {
      logger.errorWithStack('Erro na Query: produto', error, { id });
      throw error;
    }
  },

  // Orcamentos - with full data including items
  orcamentos: async () => {
    const [rows] = await pool.query(`
      SELECT 
        o.id_orcamento as id,
        o.numero_orcamento,
        o.valor_total,
        o.validade_dias,
        o.observacoes,
        o.data_criacao,
        o.data_aprovacao,
        o.data_validade,
        s.nome_status as status_nome,
        s.cor_hex as status_cor,
        c.razao_social as cliente_nome,
        l.nome_empresa as lead_nome,
        col.nome_completo as vendedor,
        e.nome_fantasia as empresa_nome
      FROM orcamentos o
      LEFT JOIN status s ON o.id_status = s.id_status
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN leads l ON o.id_lead = l.id_lead
      LEFT JOIN colaboradores col ON o.id_colaborador = col.id_colaborador
      LEFT JOIN empresas e ON o.id_empresa = e.id_empresa
      ORDER BY o.data_criacao DESC
    `);
    return rows;
  },
  
  orcamento: async (_, { id }) => {
    // Get main orcamento data
    const [orcamentos] = await pool.query(`
      SELECT 
        o.*,
        s.nome_status as status_nome,
        s.cor_hex as status_cor,
        c.razao_social as cliente_nome,
        l.nome_empresa as lead_nome,
        col.nome_completo as vendedor,
        e.nome_fantasia as empresa_nome
      FROM orcamentos o
      LEFT JOIN status s ON o.id_status = s.id_status
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN leads l ON o.id_lead = l.id_lead
      LEFT JOIN colaboradores col ON o.id_colaborador = col.id_colaborador
      LEFT JOIN empresas e ON o.id_empresa = e.id_empresa
      WHERE o.id_orcamento = ?
    `, [id]);
    
    if (orcamentos.length === 0) return null;
    
    const orcamento = orcamentos[0];
    
    // Get full cliente data if exists
    if (orcamento.id_cliente) {
      const [clientes] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [orcamento.id_cliente]);
      if (clientes.length > 0) {
        orcamento.cliente = clientes[0];
      }
    }
    
    // Get full lead data if exists
    if (orcamento.id_lead) {
      const [leads] = await pool.query('SELECT * FROM leads WHERE id_lead = ?', [orcamento.id_lead]);
      if (leads.length > 0) {
        orcamento.lead = leads[0];
      }
    }
    
    // Get orcamento itens
    const [itens] = await pool.query(`
      SELECT 
        oi.*,
        prod.nome as produto_nome,
        prod.codigo_produto
      FROM orcamentos_itens oi
      LEFT JOIN produtos prod ON oi.id_produto = prod.id_produto
      WHERE oi.id_orcamento = ?
      ORDER BY oi.ordem
    `, [id]);
    
    orcamento.itens = itens;
    
    return orcamento;
  },

  // Gerar TXT do orçamento
  gerarOrcamentoTxt: async (_, { id }) => {
    // Use same logic as orcamento query
    const [orcamentos] = await pool.query(`
      SELECT 
        o.*,
        s.nome_status as status_nome,
        c.razao_social as cliente_nome,
        l.nome_empresa as lead_nome,
        col.nome_completo as vendedor,
        e.nome_fantasia as empresa_nome
      FROM orcamentos o
      LEFT JOIN status s ON o.id_status = s.id_status
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN leads l ON o.id_lead = l.id_lead
      LEFT JOIN colaboradores col ON o.id_colaborador = col.id_colaborador
      LEFT JOIN empresas e ON o.id_empresa = e.id_empresa
      WHERE o.id_orcamento = ?
    `, [id]);
    
    if (orcamentos.length === 0) {
      throw new Error('Orçamento não encontrado');
    }
    
    const orcamento = orcamentos[0];
    
    // Get full cliente data
    if (orcamento.id_cliente) {
      const [clientes] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [orcamento.id_cliente]);
      if (clientes.length > 0) {
        orcamento.cliente = clientes[0];
      }
    }
    
    // Get full lead data
    if (orcamento.id_lead) {
      const [leads] = await pool.query('SELECT * FROM leads WHERE id_lead = ?', [orcamento.id_lead]);
      if (leads.length > 0) {
        orcamento.lead = leads[0];
      }
    }
    
    // Get itens
    const [itens] = await pool.query(`
      SELECT 
        oi.*,
        prod.nome as produto_nome,
        prod.codigo_produto
      FROM orcamentos_itens oi
      LEFT JOIN produtos prod ON oi.id_produto = prod.id_produto
      WHERE oi.id_orcamento = ?
      ORDER BY oi.ordem
    `, [id]);
    
    orcamento.itens = itens;
    
    return {
      orcamento_id: id,
      texto: gerarTxtOrcamento(orcamento),
      html: gerarHtmlOrcamento(orcamento)
    };
  },

  // Pedidos
  pedidos: async () => {
    const [rows] = await pool.query(`
      SELECT 
        p.id_pedido as id,
        p.numero_pedido,
        p.data_pedido,
        p.valor_total,
        p.data_prevista_entrega,
        p.observacoes,
        p.data_criacao,
        s.nome_status as status_nome,
        s.cor_hex as status_cor,
        c.razao_social as cliente_nome
      FROM pedidos p
      LEFT JOIN status s ON p.id_status = s.id_status
      LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY p.data_criacao DESC
    `);
    return rows;
  },
  
  pedido: async (_, { id }) => {
    const [rows] = await pool.query(`
      SELECT 
        p.id_pedido as id,
        p.*,
        s.nome_status as status_nome,
        c.razao_social as cliente_nome
      FROM pedidos p
      LEFT JOIN status s ON p.id_status = s.id_status
      LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
      WHERE p.id_pedido = ?
    `, [id]);
    return rows[0] || null;
  },

  // Contratos
  contratos: async () => {
    const [rows] = await pool.query(`
      SELECT 
        c.id_contrato as id,
        c.numero_contrato,
        c.data_assinatura,
        c.data_inicio_vigencia,
        c.data_fim_vigencia,
        c.valor_total,
        c.renovacao_automatica,
        c.periodicidade_reajuste,
        c.arquivo_url,
        c.observacoes,
        c.data_criacao,
        s.nome_status as status_nome,
        s.cor_hex as status_cor,
        cl.razao_social as cliente_nome
      FROM contratos c
      LEFT JOIN status s ON c.id_status = s.id_status
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      ORDER BY c.data_criacao DESC
    `);
    return rows;
  },
  
  contrato: async (_, { id }) => {
    const [rows] = await pool.query(`
      SELECT 
        c.id_contrato as id,
        c.*,
        s.nome_status as status_nome,
        cl.razao_social as cliente_nome
      FROM contratos c
      LEFT JOIN status s ON c.id_status = s.id_status
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      WHERE c.id_contrato = ?
    `, [id]);
    return rows[0] || null;
  },

  // Faturas
  faturas: async (_, { contrato_id }) => {
    let query = `
      SELECT 
        f.id_fatura as id,
        f.numero_fatura,
        f.data_emissao,
        f.data_vencimento,
        f.valor_original,
        f.valor_final,
        f.data_pagamento,
        f.valor_pago,
        f.observacoes,
        s.nome_status as status_nome,
        s.cor_hex as status_cor
      FROM faturas f
      LEFT JOIN status s ON f.id_status = s.id_status
    `;
    const params = [];
    if (contrato_id) {
      query += ' WHERE f.id_contrato = ?';
      params.push(contrato_id);
    }
    query += ' ORDER BY f.data_vencimento DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },
  
  fatura: async (_, { id }) => {
    const [rows] = await pool.query(`
      SELECT 
        f.id_fatura as id,
        f.*,
        s.nome_status as status_nome,
        s.cor_hex as status_cor
      FROM faturas f
      LEFT JOIN status s ON f.id_status = s.id_status
      WHERE f.id_fatura = ?
    `, [id]);
    return rows[0] || null;
  },

  // Implantacoes
  implantacoes: async () => {
    const [rows] = await pool.query(`
      SELECT 
        i.id_implantacao as id,
        i.data_inicio_prevista,
        i.data_fim_prevista,
        i.data_inicio_real,
        i.data_fim_real,
        i.percentual_conclusao,
        i.observacoes,
        i.data_criacao,
        s.nome_status as status_nome,
        s.cor_hex as status_cor,
        c.numero_contrato as contrato_numero,
        col.nome_completo as responsavel_nome
      FROM implantacoes i
      LEFT JOIN status s ON i.id_status = s.id_status
      LEFT JOIN contratos c ON i.id_contrato = c.id_contrato
      LEFT JOIN colaboradores col ON i.id_colaborador = col.id_colaborador
      ORDER BY i.data_criacao DESC
    `);
    return rows;
  },
  
  implantacao: async (_, { id }) => {
    const [rows] = await pool.query(`
      SELECT 
        i.id_implantacao as id,
        i.*,
        s.nome_status as status_nome,
        s.cor_hex as status_cor,
        c.numero_contrato as contrato_numero,
        col.nome_completo as responsavel_nome
      FROM implantacoes i
      LEFT JOIN status s ON i.id_status = s.id_status
      LEFT JOIN contratos c ON i.id_contrato = c.id_contrato
      LEFT JOIN colaboradores col ON i.id_colaborador = col.id_colaborador
      WHERE i.id_implantacao = ?
    `, [id]);
    return rows[0] || null;
  },

  // Templates
  templates: async (_, { tipo_template }) => {
    let query = 'SELECT * FROM templates';
    const params = [];
    if (tipo_template) {
      query += ' WHERE tipo_template = ?';
      params.push(tipo_template);
    }
    query += ' ORDER BY nome_template';
    const [rows] = await pool.query(query, params);
    return rows;
  },
  
  template: async (_, { id }) => {
    const [rows] = await pool.query('SELECT * FROM templates WHERE id_template = ?', [id]);
    return rows[0] || null;
  },

  // Email Templates
  email_templates: async (_, { tipo_documento }) => {
    let query = 'SELECT * FROM email_templates';
    const params = [];
    if (tipo_documento) {
      query += ' WHERE tipo_documento = ?';
      params.push(tipo_documento);
    }
    query += ' ORDER BY nome_template';
    const [rows] = await pool.query(query, params);
    return rows;
  },
  
  email_template: async (_, { id }) => {
    const [rows] = await pool.query('SELECT * FROM email_templates WHERE id_template_email = ?', [id]);
    return rows[0] || null;
  },

  // Transacoes
  transacoes: async () => {
    const [rows] = await pool.query(`
      SELECT 
        id_transacao as id,
        tipo,
        valor,
        data,
        descricao,
        categoria,
        forma_pagamento as formaPagamento,
        status
      FROM transacoes
      ORDER BY data DESC
      LIMIT 100
    `);
    return rows.map(row => ({
      ...row,
      tipo_entidade: row.tipo,
      data_transacao: row.data
    }));
  }
};

// Mutation resolvers
const Mutation = {
  // Auth
  login: async (_, { input }) => {
    const { email, senha } = input;
    const [rows] = await pool.query('SELECT * FROM colaboradores WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      throw new Error('Credenciais inválidas');
    }
    
    const user = rows[0];
    const isValidPassword = await bcrypt.compare(senha, user.senha_hash);
    
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }
    
    if (!user.ativo) {
      throw new Error('Usuário inativo');
    }
    
    const token = jwt.sign(
      { id: user.id_colaborador, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Update last login
    await pool.query('UPDATE colaboradores SET data_ultimo_login = NOW() WHERE id_colaborador = ?', [user.id_colaborador]);
    
    return {
      token,
      user: {
        id: user.id_colaborador,
        cpf: user.cpf,
        nome_completo: user.nome_completo,
        email: user.email,
        telefone: user.telefone,
        tipo_colaborador: user.tipo_colaborador,
        data_admissao: formatDate(user.data_admissao),
        comissao_venda: parseFloat(user.comissao_venda),
        comissao_recorrente: parseFloat(user.comissao_recorrente),
        ativo: !!user.ativo,
        data_cadastro: formatDateTime(user.data_cadastro)
      }
    };
  },

  // Empresas
  createEmpresa: async (_, { input }) => {
    const { cnpj, razao_social, nome_fantasia, telefone, email, ativo } = input;
    const [result] = await pool.query(
      'INSERT INTO empresas (cnpj, razao_social, nome_fantasia, telefone, email, ativo) VALUES (?, ?, ?, ?, ?, ?)',
      [cnpj, razao_social, nome_fantasia, telefone, email, ativo !== false ? 1 : 0]
    );
    return { id: result.insertId, ...input };
  },

  updateEmpresa: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE empresas SET ${fields.join(', ')} WHERE id_empresa = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM empresas WHERE id_empresa = ?', [id]);
    return rows[0];
  },

  deleteEmpresa: async (_, { id }) => {
    await pool.query('DELETE FROM empresas WHERE id_empresa = ?', [id]);
    return true;
  },

  // Parametros Empresa
  updateParametrosEmpresa: async (_, { input }) => {
    const startTime = Date.now();
    logger.info('Mutation: updateParametrosEmpresa', { input });
    
    try {
      const fields = [];
      const values = [];
      
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      });
      
      if (fields.length > 0) {
        // Get the first parameter record (there's usually only one)
        const [existing] = await pool.query('SELECT id_parametro FROM parametros_empresa LIMIT 1');
        
        if (existing.length > 0) {
          // Update existing record
          values.push(existing[0].id_parametro);
          await pool.query(`UPDATE parametros_empresa SET ${fields.join(', ')} WHERE id_parametro = ?`, values);
        } else {
          // Insert new record
          await pool.query(`INSERT INTO parametros_empresa SET ${fields.join(', ')}`, values);
        }
      }
      
      // Fetch and return updated record
      const [rows] = await pool.query('SELECT * FROM parametros_empresa LIMIT 1');
      logger.trace('Mutation: updateParametrosEmpresa', startTime, { updated: !!rows[0] });
      return rows[0] || null;
    } catch (error) {
      logger.errorWithStack('Erro na Mutation: updateParametrosEmpresa', error, { input });
      throw error;
    }
  },

  // Leads
  createLead: async (_, { input }, { user }) => {
    const { nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, telefone_whatsapp, contato_cargo, fonte_lead, probabilidade, valor_estimado, observacoes, id_empresa } = input;
    
    // Get default company ID if not provided
    let defaultEmpresaId = id_empresa || 9;
    if (!defaultEmpresaId) {
      const [empresas] = await pool.query('SELECT id_empresa FROM empresas LIMIT 1');
      if (empresas.length > 0) {
        defaultEmpresaId = empresas[0].id_empresa;
      }
    }
    
    // Get default collaborator ID from database (use first available)
    let defaultColaboradorId = 13; // Default to admin
    if (user?.id) {
      defaultColaboradorId = user.id;
    } else {
      const [colaboradores] = await pool.query('SELECT id_colaborador FROM colaboradores LIMIT 1');
      if (colaboradores.length > 0) {
        defaultColaboradorId = colaboradores[0].id_colaborador;
      }
    }
    
    // Get default lead status
    let defaultStatusId = 12;
    const [status] = await pool.query("SELECT id_status FROM status WHERE tipo_entidade = 'lead' LIMIT 1");
    if (status.length > 0) {
      defaultStatusId = status[0].id_status;
    }
    
    const [result] = await pool.query(
      `INSERT INTO leads (nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, telefone_whatsapp, contato_cargo, fonte_lead, probabilidade, valor_estimado, observacoes, id_empresa, id_colaborador, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, telefone_whatsapp, contato_cargo, fonte_lead, probabilidade || 0, valor_estimado, observacoes, defaultEmpresaId, defaultColaboradorId, defaultStatusId]
    );
    
    return { id: result.insertId, ...input };
  },

  updateLead: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE leads SET ${fields.join(', ')} WHERE id_lead = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM leads WHERE id_lead = ?', [id]);
    return rows[0];
  },

  deleteLead: async (_, { id }) => {
    await pool.query('DELETE FROM leads WHERE id_lead = ?', [id]);
    return true;
  },

  // Clientes
  createCliente: async (_, { input }, { user }) => {
    const startTime = Date.now();
    logger.info('Mutation: createCliente', { userId: user?.id });
    
    const { razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, telefone_whatsapp, email_financeiro, telefone_financeiro, id_empresa, id_colaborador, id_lead, observacoes } = input;
    
    // Use provided id_colaborador or fallback to user.id (from JWT token) or default to 13
    const colaboradorId = id_colaborador || (user ? user.id : 13);
    
    // Get default empresa ID if not provided or if it doesn't exist
    let empresaId = id_empresa;
    if (!empresaId) {
      const [empresas] = await pool.query('SELECT id_empresa FROM empresas LIMIT 1');
      if (empresas.length > 0) {
        empresaId = empresas[0].id_empresa;
      }
    }
    
    // Verify empresa exists
    const [empresaCheck] = await pool.query('SELECT id_empresa FROM empresas WHERE id_empresa = ?', [empresaId]);
    if (empresaCheck.length === 0) {
      logger.warn('Empresa não encontrada, usando primeira empresa disponível');
      const [empresas] = await pool.query('SELECT id_empresa FROM empresas LIMIT 1');
      if (empresas.length > 0) {
        empresaId = empresas[0].id_empresa;
      } else {
        throw new Error('Nenhuma empresa encontrada no sistema');
      }
    }
    
    try {
      const [result] = await pool.query(
        `INSERT INTO clientes (razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, telefone_whatsapp, email_financeiro, telefone_financeiro, id_empresa, id_colaborador, id_lead, id_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, telefone_whatsapp, email_financeiro, telefone_financeiro, empresaId, colaboradorId, id_lead || null]
      );
      
      logger.trace('Mutation: createCliente', startTime, { id: result.insertId });
      return { id: result.insertId, ...input };
    } catch (error) {
      logger.errorWithStack('Erro na Mutation: createCliente', error, { input });
      throw error;
    }
  },

  updateCliente: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE clientes SET ${fields.join(', ')} WHERE id_cliente = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    return rows[0];
  },

  deleteCliente: async (_, { id }) => {
    await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    return true;
  },

  // Produtos
  createProduto: async (_, { input }, { user }) => {
    const { codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo } = input;
    
    const [result] = await pool.query(
      `INSERT INTO produtos (codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, id_usuario_criacao) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, user?.id || 1]
    );
    
    return { id: result.insertId, ...input };
  },

  updateProduto: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE produtos SET ${fields.join(', ')} WHERE id_produto = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM produtos WHERE id_produto = ?', [id]);
    return rows[0];
  },

  deleteProduto: async (_, { id }) => {
    await pool.query('DELETE FROM produtos WHERE id_produto = ?', [id]);
    return true;
  },

  // Colaboradores
  createColaborador: async (_, { input }, { user }) => {
    const { cpf, nome_completo, email, senha, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_permissao, id_empresa } = input;
    
    // Log para debug
    console.log('DEBUG createColaborador: input received:', input);
    console.log('DEBUG createColaborador: user from context:', user);
    
    const senhaHash = await bcrypt.hash(senha, 10);
    
    // Usar id_usuario_criacao do contexto do usuário logado ou padrão 1
    const usuarioCriacao = user?.id || 1;
    
    // Se id_permissao não for enviado, usar 1 como padrão
    const permissaoId = id_permissao || 1;
    
    try {
      const [result] = await pool.query(
        `INSERT INTO colaboradores (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_permissao, id_empresa, id_usuario_criacao, ativo) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [cpf, nome_completo, email, senhaHash, telefone, tipo_colaborador, data_admissao, comissao_venda || 0, comissao_recorrente || 0, permissaoId, id_empresa || 1, usuarioCriacao]
      );
      
      console.log('DEBUG createColaborador: insert successful, id:', result.insertId);
      
      return { id: result.insertId, nome_completo, email, tipo_colaborador };
    } catch (error) {
      console.error('DEBUG createColaborador: error:', error.message);
      throw error;
    }
  },

  updateColaborador: async (_, { id, input }, { user }) => {
    const fields = [];
    const values = [];
    
    console.log('DEBUG updateColaborador: id:', id, 'input:', input);
    
    // Extrair departamento e departamentos do input
    const { departamento, departamentos, ...colabInput } = input;
    
    // Atualizar campos do colaborador
    Object.entries(colabInput).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    // Adicionar departamento se fornecido
    if (departamento !== undefined) {
      fields.push('departamento = ?');
      values.push(departamento);
    }
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE colaboradores SET ${fields.join(', ')} WHERE id_colaborador = ?`, values);
    }
    
    // Atualizar departamentos se fornecidos
    if (departamentos && departamentos.length > 0) {
      // Desativar todos os vínculos antigos
      await pool.query('UPDATE colaboradores_departamentos SET ativo = 0 WHERE id_colaborador = ?', [id]);
      
      // Inserir novos vínculos
      for (const dept of departamentos) {
        // Verificar se o departamento já existe
        let deptId = dept.id;
        let deptNome = dept.nome;
        
        if (!deptId && deptNome) {
          // Buscar ou criar departamento
          const [existingDept] = await pool.query('SELECT id_departamento FROM departamentos WHERE nome = ?', [deptNome]);
          if (existingDept.length > 0) {
            deptId = existingDept[0].id_departamento;
          } else {
            // Criar novo departamento
            const [result] = await pool.query(
              'INSERT INTO departamentos (id_empresa, nome, codigo, ativo) VALUES (1, ?, ?, 1)',
              [deptNome, deptNome.substring(0, 3).toUpperCase()]
            );
            deptId = result.insertId;
          }
        }
        
        // Inserir vínculo
        await pool.query(
          `INSERT INTO colaboradores_departamentos (id_colaborador, id_departamento, nome_departamento, cargo, data_inicio, ativo) 
           VALUES (?, ?, ?, ?, NOW(), 1)`,
          [id, deptId || null, deptNome || dept.cargo, dept.cargo || 'Colaborador']
        );
      }
    }
    
    const [rows] = await pool.query('SELECT * FROM colaboradores WHERE id_colaborador = ?', [id]);
    return rows[0];
  },

  deleteColaborador: async (_, { id }) => {
    await pool.query('DELETE FROM colaboradores WHERE id_colaborador = ?', [id]);
    return true;
  },

  // Orcamentos
  createOrcamento: async (_, { input }, { user }) => {
    const { id_lead, id_cliente, valor_total, validade_dias, observacoes, id_status, itens } = input;
    
    const numero_orcamento = `ORC-${Date.now()}`;
    const data_validade = new Date();
    data_validade.setDate(data_validade.getDate() + validade_dias);
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.query(
        `INSERT INTO orcamentos (numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_validade) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [numero_orcamento, id_lead, id_cliente, user?.id || 1, 1, valor_total, validade_dias, observacoes, id_status || 17, data_validade]
      );
      
      const orcamentoId = result.insertId;
      
      // Insert itens if provided
      if (itens && itens.length > 0) {
        for (let i = 0; i < itens.length; i++) {
          const item = itens[i];
          await connection.query(
            `INSERT INTO orcamentos_itens (id_orcamento, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, desconto_valor, valor_total, ordem) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [orcamentoId, item.id_produto, item.descricao_item, item.quantidade, item.valor_unitario, item.desconto_percentual || 0, item.desconto_valor || 0, item.valor_total, i + 1]
          );
        }
      }
      
      await connection.commit();
      
      return { id: orcamentoId, numero_orcamento, ...input };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  updateOrcamento: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE orcamentos SET ${fields.join(', ')} WHERE id_orcamento = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM orcamentos WHERE id_orcamento = ?', [id]);
    return rows[0];
  },

  deleteOrcamento: async (_, { id }) => {
    await pool.query('DELETE FROM orcamentos_itens WHERE id_orcamento = ?', [id]);
    await pool.query('DELETE FROM orcamentos WHERE id_orcamento = ?', [id]);
    return true;
  },

  enviarOrcamentoEmail: async (_, { input }, { user }) => {
    const { orcamento_id, destinatario, destinatario_nome, assunto, mensagem, template_id } = input;
    
    // Get orcamento data
    const [orcamentos] = await pool.query(`
      SELECT 
        o.*,
        s.nome_status as status_nome,
        c.razao_social as cliente_nome,
        l.nome_empresa as lead_nome,
        col.nome_completo as vendedor,
        e.nome_fantasia as empresa_nome,
        e.email as empresa_email
      FROM orcamentos o
      LEFT JOIN status s ON o.id_status = s.id_status
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN leads l ON o.id_lead = l.id_lead
      LEFT JOIN colaboradores col ON o.id_colaborador = col.id_colaborador
      LEFT JOIN empresas e ON o.id_empresa = e.id_empresa
      WHERE o.id_orcamento = ?
    `, [orcamento_id]);
    
    if (orcamentos.length === 0) {
      return { success: false, message: 'Orçamento não encontrado' };
    }
    
    const orcamento = orcamentos[0];
    
    const [itens] = await pool.query(`
      SELECT oi.*, prod.nome as produto_nome
      FROM orcamentos_itens oi
      LEFT JOIN produtos prod ON oi.id_produto = prod.id_produto
      WHERE oi.id_orcamento = ?
      ORDER BY oi.ordem
    `, [orcamento_id]);
    
    orcamento.itens = itens;
    const html = gerarHtmlOrcamento(orcamento);
    
    let emailAssunto = assunto || `Orçamento ${orcamento.numero_orcamento} - ${orcamento.empresa_nome}`;
    
    if (template_id) {
      const [templates] = await pool.query('SELECT * FROM email_templates WHERE id_template_email = ?', [template_id]);
      if (templates.length > 0) {
        const template = templates[0];
        emailAssunto = template.assunto
          .replace('{{numero_orcamento}}', orcamento.numero_orcamento)
          .replace('{{empresa_nome}}', orcamento.empresa_nome);
      }
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test'
      }
    });
    
    try {
      console.log('Sending email to:', destinatario);
      console.log('Subject:', emailAssunto);
      console.log('HTML length:', html.length);
      
      return {
        success: true,
        message: 'Email enviado com sucesso (simulação)',
        email_enviado: destinatario
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: `Erro ao enviar email: ${error.message}`
      };
    }
  },

  // Enviar orçamento por WhatsApp
  enviarOrcamentoWhatsapp: async (_, { input }, { user }) => {
    const { orcamento_id, numero_whatsapp, mensagem } = input;
    
    // Get orcamento data
    const [orcamentos] = await pool.query(`
      SELECT 
        o.*,
        c.telefone_whatsapp as cliente_whatsapp,
        l.telefone_whatsapp as lead_whatsapp,
        l.telefone_contato as lead_telefone
      FROM orcamentos o
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN leads l ON o.id_lead = l.id_lead
      WHERE o.id_orcamento = ?
    `, [orcamento_id]);
    
    if (orcamentos.length === 0) {
      return { success: false, message: 'Orçamento não encontrado' };
    }
    
    const orcamento = orcamentos[0];
    
    // Determine WhatsApp number
    let whatsappNumber = numero_whatsapp;
    if (!whatsappNumber) {
      whatsappNumber = orcamento.cliente_whatsapp || orcamento.lead_whatsapp || orcamento.lead_telefone;
    }
    
    if (!whatsappNumber) {
      return { success: false, message: 'Número de WhatsApp não encontrado' };
    }
    
    // Format number (remove non-digits and add country code if needed)
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const formattedNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
    
    // Generate TXT for WhatsApp
    const txt = gerarTxtOrcamento(orcamento);
    const whatsappMessage = mensagem || `Segue o orçamento ${orcamento.numero_orcamento}:\n\n${txt.substring(0, 1000)}...`;
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID || 'test',
      process.env.TWILIO_AUTH_TOKEN || 'test'
    );
    
    try {
      console.log('Sending WhatsApp to:', formattedNumber);
      console.log('Message length:', whatsappMessage.length);
            
      return {
        success: true,
        message: 'WhatsApp enviado com sucesso (simulação)',
        numero_whatsapp: formattedNumber
      };
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      return {
        success: false,
        message: `Erro ao enviar WhatsApp: ${error.message}`
      };
    }
  },

  // Pedidos
  createPedido: async (_, { input }, { user }) => {
    const { id_orcamento, id_cliente, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status } = input;
    
    const numero_pedido = `PED-${Date.now()}`;
    
    const [result] = await pool.query(
      `INSERT INTO pedidos (numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [numero_pedido, id_orcamento, id_cliente, user?.id || 1, 1, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status]
    );
    
    return { id: result.insertId, numero_pedido, ...input };
  },

  updatePedido: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE pedidos SET ${fields.join(', ')} WHERE id_pedido = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
    return rows[0];
  },

  deletePedido: async (_, { id }) => {
    await pool.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
    return true;
  },

  // Contratos
  createContrato: async (_, { input }) => {
    const { id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status } = input;
    
    const numero_contrato = `CON-${Date.now()}`;
    
    const [result] = await pool.query(
      `INSERT INTO contratos (numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica ? 1 : 0, periodicidade_reajuste, arquivo_url, observacoes, id_status]
    );
    
    return { id: result.insertId, numero_contrato, ...input };
  },

  updateContrato: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE contratos SET ${fields.join(', ')} WHERE id_contrato = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM contratos WHERE id_contrato = ?', [id]);
    return rows[0];
  },

  deleteContrato: async (_, { id }) => {
    await pool.query('DELETE FROM contratos WHERE id_contrato = ?', [id]);
    return true;
  },

  // Faturas
  createFatura: async (_, { input }) => {
    const { id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, observacoes, id_status } = input;
    
    const [result] = await pool.query(
      `INSERT INTO faturas (id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, observacoes, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, observacoes, id_status]
    );
    
    return { id: result.insertId, ...input };
  },

  updateFatura: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE faturas SET ${fields.join(', ')} WHERE id_fatura = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM faturas WHERE id_fatura = ?', [id]);
    return rows[0];
  },

  deleteFatura: async (_, { id }) => {
    await pool.query('DELETE FROM faturas WHERE id_fatura = ?', [id]);
    return true;
  },

  // Implantacoes
  createImplantacao: async (_, { input }) => {
    const { id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, observacoes, id_status } = input;
    
    const [result] = await pool.query(
      `INSERT INTO implantacoes (id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, observacoes, id_status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, observacoes, id_status]
    );
    
    return { id: result.insertId, ...input };
  },

  updateImplantacao: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE implantacoes SET ${fields.join(', ')} WHERE id_implantacao = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM implantacoes WHERE id_implantacao = ?', [id]);
    return rows[0];
  },

  deleteImplantacao: async (_, { id }) => {
    await pool.query('DELETE FROM implantacoes WHERE id_implantacao = ?', [id]);
    return true;
  },

  // Transacoes
  createTransacao: async (_, { input }, { user }) => {
    const { tipo, valor, data_transacao, descricao, categoria, forma_pagamento, status } = input;
    
    const [result] = await pool.query(
      `INSERT INTO transacoes (tipo, valor, data, descricao, categoria, forma_pagamento, status, id_usuario_criacao) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [tipo, valor, data_transacao, descricao, categoria, forma_pagamento, status || 'Pendente', user?.id || 1]
    );
    
    return { id: result.insertId, tipo_entidade: tipo, valor, data_transacao };
  },

  updateTransacao: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        // Mapear campos do GraphQL para o banco
        const dbField = key === 'data_transacao' ? 'data' : key;
        fields.push(`${dbField} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE transacoes SET ${fields.join(', ')} WHERE id_transacao = ?`, values);
    }
    
    const [rows] = await pool.query('SELECT * FROM transacoes WHERE id_transacao = ?', [id]);
    return rows[0] ? { 
      id: rows[0].id_transacao, 
      tipo_entidade: rows[0].tipo, 
      valor: rows[0].valor, 
      data_transacao: rows[0].data 
    } : null;
  },

  deleteTransacao: async (_, { id }) => {
    await pool.query('DELETE FROM transacoes WHERE id_transacao = ?', [id]);
    return true;
  }
};

module.exports = { Query, Mutation };
