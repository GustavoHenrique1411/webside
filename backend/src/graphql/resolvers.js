
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'webside-secret-key';

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

// Query resolvers
const Query = {
  // Health check
  health: () => ({
    status: 'ok',
    timestamp: formatDateTime(new Date()),
    uptime: process.uptime()
  }),

  // Empresas
  empresas: async () => {
    const [rows] = await pool.query('SELECT * FROM empresas ORDER BY nome_fantasia');
    return rows;
  },
  
  empresa: async (_, { id }) => {
    const [rows] = await pool.query('SELECT * FROM empresas WHERE id_empresa = ?', [id]);
    return rows[0] || null;
  },

  // Parametros Empresa
  parametros_empresa: async () => {
    const [rows] = await pool.query('SELECT * FROM parametros_empresa LIMIT 1');
    return rows[0] || null;
  },

  // Colaboradores
  colaboradores: async () => {
    const [rows] = await pool.query(`
      SELECT c.*, p.nome_perfil as perfil_nome
      FROM colaboradores c
      LEFT JOIN permissoes p ON c.id_permissao = p.id_permissao
      ORDER BY c.nome_completo
    `);
    return rows;
  },
  
  colaborador: async (_, { id }) => {
    const [rows] = await pool.query('SELECT * FROM colaboradores WHERE id_colaborador = ?', [id]);
    return rows[0] || null;
  },

  // Permissoes
  permissoes: async () => {
    const [rows] = await pool.query('SELECT * FROM permissoes ORDER BY nivel_acesso');
    return rows;
  },

  // Status
  status: async (_, { tipo_entidade }) => {
    let query = 'SELECT * FROM status';
    const params = [];
    if (tipo_entidade) {
      query += ' WHERE tipo_entidade = ?';
      params.push(tipo_entidade);
    }
    query += ' ORDER BY ordem';
    const [rows] = await pool.query(query, params);
    return rows;
  },
  
  status_by_id: async (_, { id }) => {
    const [rows] = await pool.query('SELECT * FROM status WHERE id_status = ?', [id]);
    return rows[0] || null;
  },

  // Leads
  leads: async () => {
    const [rows] = await pool.query(`
      SELECT 
        l.id_lead as id,
        l.nome_empresa,
        l.cnpj,
        l.contato_principal,
        l.email_contato,
        l.telefone_contato,
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
    return rows;
  },
  
  lead: async (_, { id }) => {
    const [rows] = await pool.query(`
      SELECT 
        l.*,
        s.nome_status as status_nome,
        s.cor_hex as status_cor,
        c.nome_completo as responsavel
      FROM leads l
      LEFT JOIN status s ON l.id_status = s.id_status
      LEFT JOIN colaboradores c ON l.id_colaborador = c.id_colaborador
      WHERE l.id_lead = ?
    `, [id]);
    return rows[0] || null;
  },

  // Clientes
  clientes: async () => {
    const [rows] = await pool.query(`
      SELECT 
        c.id_cliente as id,
        c.razao_social,
        c.nome_fantasia,
        c.cnpj,
        c.inscricao_estadual,
        c.data_fundacao,
        c.porte_empresa,
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
    return rows;
  },
  
  cliente: async (_, { id }) => {
    const [rows] = await pool.query(`
      SELECT 
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
    return rows[0] || null;
  },

  // Produtos
  produtos: async () => {
    const [rows] = await pool.query(`
      SELECT p.id_produto as id, p.* FROM produtos p ORDER BY p.nome
    `);
    return rows;
  },
  
  produto: async (_, { id }) => {
    const [rows] = await pool.query('SELECT * FROM produtos WHERE id_produto = ?', [id]);
    return rows[0] || null;
  },

  // Orcamentos
  orcamentos: async () => {
    const [rows] = await pool.query(`
      SELECT 
        o.id_orcamento as id,
        o.*,
        s.nome_status as status_nome,
        s.cor_hex as status_cor,
        c.razao_social as cliente_nome
      FROM orcamentos o
      LEFT JOIN status s ON o.id_status = s.id_status
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      ORDER BY o.data_criacao DESC
    `);
    return rows;
  },
  
  orcamento: async (_, { id }) => {
    const [rows] = await pool.query(`
      SELECT 
        o.*,
        s.nome_status as status_nome,
        c.razao_social as cliente_nome
      FROM orcamentos o
      LEFT JOIN status s ON o.id_status = s.id_status
      LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
      WHERE o.id_orcamento = ?
    `, [id]);
    return rows[0] || null;
  },

  // Pedidos
  pedidos: async () => {
    const [rows] = await pool.query(`
      SELECT 
        p.id_pedido as id,
        p.*,
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
        c.*,
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
        f.*,
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
        i.*,
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

  // Transacoes
  transacoes: async () => {
    const [rows] = await pool.query(`
      SELECT * FROM (
        SELECT id_fatura as id, 'fatura' as tipo_entidade, valor_final as valor, data_vencimento as data_transacao
        FROM faturas
        UNION ALL
        SELECT id_pedido as id, 'pedido' as tipo_entidade, valor_total as valor, data_pedido as data_transacao
        FROM pedidos
      ) as transacoes
      ORDER BY data_transacao DESC
      LIMIT 100
    `);
    return rows;
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

  // Leads
  createLead: async (_, { input }, { user }) => {
    const { nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, observacoes, id_empresa } = input;
    
    const [result] = await pool.query(
      `INSERT INTO leads (nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, observacoes, id_empresa, id_colaborador, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 12)`,
      [nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade || 0, valor_estimado, observacoes, id_empresa || 1, user?.id || 1]
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
    const { razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_empresa, id_lead, observacoes } = input;
    
    const [result] = await pool.query(
      `INSERT INTO clientes (razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_empresa, id_colaborador, id_lead, id_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_empresa || 1, user?.id || 1, id_lead || null]
    );
    
    return { id: result.insertId, ...input };
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
  createColaborador: async (_, { input }) => {
    const { cpf, nome_completo, email, senha, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_permissao, id_empresa } = input;
    
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const [result] = await pool.query(
      `INSERT INTO colaboradores (cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_permissao, id_empresa, ativo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [cpf, nome_completo, email, senhaHash, telefone, tipo_colaborador, data_admissao, comissao_venda || 0, comissao_recorrente || 0, id_permissao, id_empresa || 1]
    );
    
    return { id: result.insertId, nome_completo, email, tipo_colaborador };
  },

  updateColaborador: async (_, { id, input }) => {
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
      await pool.query(`UPDATE colaboradores SET ${fields.join(', ')} WHERE id_colaborador = ?`, values);
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
    const { id_lead, id_cliente, valor_total, validade_dias, observacoes, id_status } = input;
    
    const numero_orcamento = `ORC-${Date.now()}`;
    const data_validade = new Date();
    data_validade.setDate(data_validade.getDate() + validade_dias);
    
    const [result] = await pool.query(
      `INSERT INTO orcamentos (numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_validade) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [numero_orcamento, id_lead, id_cliente, user?.id || 1, 1, valor_total, validade_dias, observacoes, id_status, data_validade]
    );
    
    return { id: result.insertId, numero_orcamento, ...input };
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
    await pool.query('DELETE FROM orcamentos WHERE id_orcamento = ?', [id]);
    return true;
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
  }
};

module.exports = { Query, Mutation };

