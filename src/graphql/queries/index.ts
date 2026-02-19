import { gql } from '@apollo/client';

// Fragmentos reutilizáveis
export const LEAD_FRAGMENT = gql`
  fragment LeadFields on Lead {
    id
    nome_empresa
    cnpj
    contato_principal
    email_contato
    telefone_contato
    fonte_lead
    probabilidade
    valor_estimado
    observacoes
    data_criacao
    data_conversao
    status_nome
    status_cor
    empresa_nome
    responsavel
  }
`;

export const CLIENTE_FRAGMENT = gql`
  fragment ClienteFields on Cliente {
    id
    razao_social
    nome_fantasia
    cnpj
    inscricao_estadual
    data_fundacao
    porte_empresa
    ativo
    data_cadastro
    status_nome
    status_cor
    empresa_nome
    responsavel
  }
`;

export const PRODUTO_FRAGMENT = gql`
  fragment ProdutoFields on Produto {
    id
    codigo_produto
    nome
    descricao
    tipo_produto
    categoria
    valor_base
    unidade_medida
    estoque_minimo
    ativo
    data_criacao
  }
`;

export const PEDIDO_FRAGMENT = gql`
  fragment PedidoFields on Pedido {
    id
    numero_pedido
    data_pedido
    valor_total
    data_prevista_entrega
    observacoes
    data_criacao
    status_nome
    status_cor
    cliente_nome
  }
`;

export const ORCAMENTO_FRAGMENT = gql`
  fragment OrcamentoFields on Orcamento {
    id
    numero_orcamento
    valor_total
    validade_dias
    observacoes
    data_criacao
    data_aprovacao
    data_validade
    status_nome
    status_cor
    cliente_nome
  }
`;

export const CONTRATO_FRAGMENT = gql`
  fragment ContratoFields on Contrato {
    id
    numero_contrato
    data_assinatura
    data_inicio_vigencia
    data_fim_vigencia
    valor_total
    renovacao_automatica
    periodicidade_reajuste
    arquivo_url
    observacoes
    data_criacao
    status_nome
    status_cor
    cliente_nome
  }
`;

export const FATURA_FRAGMENT = gql`
  fragment FaturaFields on Fatura {
    id
    numero_fatura
    data_emissao
    data_vencimento
    valor_original
    valor_final
    data_pagamento
    valor_pago
    observacoes
    status_nome
    status_cor
  }
`;

export const IMPLANTACAO_FRAGMENT = gql`
  fragment ImplantacaoFields on Implantacao {
    id
    data_inicio_prevista
    data_fim_prevista
    data_inicio_real
    data_fim_real
    percentual_conclusao
    observacoes
    data_criacao
    status_nome
    status_cor
    contrato_numero
    responsavel_nome
  }
`;

export const COLABORADOR_FRAGMENT = gql`
  fragment ColaboradorFields on Colaborador {
    id
    cpf
    nome_completo
    email
    telefone
    tipo_colaborador
    data_admissao
    comissao_venda
    comissao_recorrente
    ativo
    data_cadastro
    data_ultimo_login
  }
`;

export const EMPRESA_FRAGMENT = gql`
  fragment EmpresaFields on Empresa {
    id
    cnpj
    razao_social
    nome_fantasia
    telefone
    email
    ativo
    data_criacao
    data_atualizacao
  }
`;

export const STATUS_FRAGMENT = gql`
  fragment StatusFields on Status {
    id_status
    tipo_entidade
    codigo_status
    nome_status
    descricao
    ordem
    cor_hex
    ativo
  }
`;

// Queries
export const GET_LEADS = gql`
  query GetLeads {
    leads {
      ...LeadFields
    }
  }
  ${LEAD_FRAGMENT}
`;

export const GET_LEAD = gql`
  query GetLead($id: ID!) {
    lead(id: $id) {
      ...LeadFields
    }
  }
  ${LEAD_FRAGMENT}
`;

export const GET_CLIENTES = gql`
  query GetClientes {
    clientes {
      ...ClienteFields
    }
  }
  ${CLIENTE_FRAGMENT}
`;

export const GET_CLIENTE = gql`
  query GetCliente($id: ID!) {
    cliente(id: $id) {
      ...ClienteFields
    }
  }
  ${CLIENTE_FRAGMENT}
`;

export const GET_PRODUTOS = gql`
  query GetProdutos {
    produtos {
      ...ProdutoFields
    }
  }
  ${PRODUTO_FRAGMENT}
`;

export const GET_PRODUTO = gql`
  query GetProduto($id: ID!) {
    produto(id: $id) {
      ...ProdutoFields
    }
  }
  ${PRODUTO_FRAGMENT}
`;

export const GET_PEDIDOS = gql`
  query GetPedidos {
    pedidos {
      ...PedidoFields
    }
  }
  ${PEDIDO_FRAGMENT}
`;

export const GET_PEDIDO = gql`
  query GetPedido($id: ID!) {
    pedido(id: $id) {
      ...PedidoFields
    }
  }
  ${PEDIDO_FRAGMENT}
`;

export const GET_ORCAMENTOS = gql`
  query GetOrcamentos {
    orcamentos {
      ...OrcamentoFields
    }
  }
  ${ORCAMENTO_FRAGMENT}
`;

export const GET_ORCAMENTO = gql`
  query GetOrcamento($id: ID!) {
    orcamento(id: $id) {
      ...OrcamentoFields
    }
  }
  ${ORCAMENTO_FRAGMENT}
`;

export const GET_CONTRATOS = gql`
  query GetContratos {
    contratos {
      ...ContratoFields
    }
  }
  ${CONTRATO_FRAGMENT}
`;

export const GET_CONTRATO = gql`
  query GetContrato($id: ID!) {
    contrato(id: $id) {
      ...ContratoFields
    }
  }
  ${CONTRATO_FRAGMENT}
`;

export const GET_FATURAS = gql`
  query GetFaturas($contrato_id: ID) {
    faturas(contrato_id: $contrato_id) {
      ...FaturaFields
    }
  }
  ${FATURA_FRAGMENT}
`;

export const GET_FATURA = gql`
  query GetFatura($id: ID!) {
    fatura(id: $id) {
      ...FaturaFields
    }
  }
  ${FATURA_FRAGMENT}
`;

export const GET_IMPLANTACOES = gql`
  query GetImplantacoes {
    implantacoes {
      ...ImplantacaoFields
    }
  }
  ${IMPLANTACAO_FRAGMENT}
`;

export const GET_IMPLANTACAO = gql`
  query GetImplantacao($id: ID!) {
    implantacao(id: $id) {
      ...ImplantacaoFields
    }
  }
  ${IMPLANTACAO_FRAGMENT}
`;

export const GET_COLABORADORES = gql`
  query GetColaboradores {
    colaboradores {
      ...ColaboradorFields
    }
  }
  ${COLABORADOR_FRAGMENT}
`;

export const GET_COLABORADOR = gql`
  query GetColaborador($id: ID!) {
    colaborador(id: $id) {
      ...ColaboradorFields
    }
  }
  ${COLABORADOR_FRAGMENT}
`;

export const GET_EMPRESAS = gql`
  query GetEmpresas {
    empresas {
      ...EmpresaFields
    }
  }
  ${EMPRESA_FRAGMENT}
`;

export const GET_EMPRESA = gql`
  query GetEmpresa($id: ID!) {
    empresa(id: $id) {
      ...EmpresaFields
    }
  }
  ${EMPRESA_FRAGMENT}
`;

export const GET_STATUS = gql`
  query GetStatus($tipo_entidade: TipoEntidade) {
    status(tipo_entidade: $tipo_entidade) {
      ...StatusFields
    }
  }
  ${STATUS_FRAGMENT}
`;

export const GET_TEMPLATES = gql`
  query GetTemplates($tipo_template: TipoTemplate) {
    templates(tipo_template: $tipo_template) {
      id_template
      tipo_template
      nome_template
      assunto
      conteudo
      variaveis
      ativo
      data_criacao
    }
  }
`;

export const GET_HEALTH = gql`
  query GetHealth {
    health {
      status
      timestamp
      uptime
    }
  }
`;

// Profile Queries
export const GET_PROFILE = gql`
  query GetProfile {
    profile {
      id
      nome_completo
      email
      telefone
      tipo_colaborador
      data_admissao
      ativo
      data_ultimo_login
    }
  }
`;

// Transacao Queries
export const GET_TRANSACOES = gql`
  query GetTransacoes {
    transacoes {
      id
      tipo_entidade
      valor
      data_transacao
    }
  }
`;

