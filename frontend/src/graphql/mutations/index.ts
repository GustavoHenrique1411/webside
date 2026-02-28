import { gql } from '@apollo/client';

// Auth Mutations
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        nome_completo
        email
        tipo_colaborador
        ativo
      }
    }
  }
`;

// Empresa Mutations
export const CREATE_EMPRESA = gql`
  mutation CreateEmpresa($input: CreateEmpresaInput!) {
    createEmpresa(input: $input) {
      id
      cnpj
      razao_social
      nome_fantasia
    }
  }
`;

export const UPDATE_EMPRESA = gql`
  mutation UpdateEmpresa($id: ID!, $input: UpdateEmpresaInput!) {
    updateEmpresa(id: $id, input: $input) {
      id
      cnpj
      razao_social
      nome_fantasia
    }
  }
`;

export const DELETE_EMPRESA = gql`
  mutation DeleteEmpresa($id: ID!) {
    deleteEmpresa(id: $id)
  }
`;

// Lead Mutations
export const CREATE_LEAD = gql`
  mutation CreateLead($input: CreateLeadInput!) {
    createLead(input: $input) {
      id
      nome_empresa
      contato_principal
      email_contato
      telefone_contato
      fonte_lead
    }
  }
`;

export const UPDATE_LEAD = gql`
  mutation UpdateLead($id: ID!, $input: UpdateLeadInput!) {
    updateLead(id: $id, input: $input) {
      id
      nome_empresa
      contato_principal
      email_contato
      telefone_contato
      fonte_lead
      probabilidade
      valor_estimado
      observacoes
      status_nome
    }
  }
`;

export const DELETE_LEAD = gql`
  mutation DeleteLead($id: ID!) {
    deleteLead(id: $id)
  }
`;

// Cliente Mutations
export const CREATE_CLIENTE = gql`
  mutation CreateCliente($input: CreateClienteInput!) {
    createCliente(input: $input) {
      id
      razao_social
      nome_fantasia
      cnpj
    }
  }
`;

export const UPDATE_CLIENTE = gql`
  mutation UpdateCliente($id: ID!, $input: UpdateClienteInput!) {
    updateCliente(id: $id, input: $input) {
      id
      razao_social
      nome_fantasia
      cnpj
      status_nome
    }
  }
`;

export const DELETE_CLIENTE = gql`
  mutation DeleteCliente($id: ID!) {
    deleteCliente(id: $id)
  }
`;

// Produto Mutations
export const CREATE_PRODUTO = gql`
  mutation CreateProduto($input: CreateProdutoInput!) {
    createProduto(input: $input) {
      id
      codigo_produto
      nome
      tipo_produto
      categoria
      valor_base
    }
  }
`;

export const UPDATE_PRODUTO = gql`
  mutation UpdateProduto($id: ID!, $input: UpdateProdutoInput!) {
    updateProduto(id: $id, input: $input) {
      id
      codigo_produto
      nome
      tipo_produto
      categoria
      valor_base
      ativo
    }
  }
`;

export const DELETE_PRODUTO = gql`
  mutation DeleteProduto($id: ID!) {
    deleteProduto(id: $id)
  }
`;

// Colaborador Mutations
export const CREATE_COLABORADOR = gql`
  mutation CreateColaborador($input: CreateColaboradorInput!) {
    createColaborador(input: $input) {
      id
      nome_completo
      email
      tipo_colaborador
    }
  }
`;

export const UPDATE_COLABORADOR = gql`
  mutation UpdateColaborador($id: ID!, $input: UpdateColaboradorInput!) {
    updateColaborador(id: $id, input: $input) {
      id
      nome_completo
      email
      telefone
      tipo_colaborador
      ativo
    }
  }
`;

export const DELETE_COLABORADOR = gql`
  mutation DeleteColaborador($id: ID!) {
    deleteColaborador(id: $id)
  }
`;

// Orcamento Mutations
export const CREATE_ORCAMENTO = gql`
  mutation CreateOrcamento($input: CreateOrcamentoInput!) {
    createOrcamento(input: $input) {
      id
      numero_orcamento
      valor_total
      validade_dias
    }
  }
`;

export const UPDATE_ORCAMENTO = gql`
  mutation UpdateOrcamento($id: ID!, $input: UpdateOrcamentoInput!) {
    updateOrcamento(id: $id, input: $input) {
      id
      numero_orcamento
      valor_total
      validade_dias
      status_nome
    }
  }
`;

export const DELETE_ORCAMENTO = gql`
  mutation DeleteOrcamento($id: ID!) {
    deleteOrcamento(id: $id)
  }
`;

export const ENVIAR_ORCAMENTO_EMAIL = gql`
  mutation EnviarOrcamentoEmail($input: EnviarEmailInput!) {
    enviarOrcamentoEmail(input: $input) {
      success
      message
      email_enviado
    }
  }
`;

export const ENVIAR_ORCAMENTO_WHATSAPP = gql`
  mutation EnviarOrcamentoWhatsapp($input: EnviarWhatsappInput!) {
    enviarOrcamentoWhatsapp(input: $input) {
      success
      message
      numero_whatsapp
    }
  }
`;

// Pedido Mutations
export const CREATE_PEDIDO = gql`
  mutation CreatePedido($input: CreatePedidoInput!) {
    createPedido(input: $input) {
      id
      numero_pedido
      valor_total
    }
  }
`;

export const UPDATE_PEDIDO = gql`
  mutation UpdatePedido($id: ID!, $input: UpdatePedidoInput!) {
    updatePedido(id: $id, input: $input) {
      id
      numero_pedido
      valor_total
      status_nome
    }
  }
`;

export const DELETE_PEDIDO = gql`
  mutation DeletePedido($id: ID!) {
    deletePedido(id: $id)
  }
`;

// Contrato Mutations
export const CREATE_CONTRATO = gql`
  mutation CreateContrato($input: CreateContratoInput!) {
    createContrato(input: $input) {
      id
      numero_contrato
      valor_total
    }
  }
`;

export const UPDATE_CONTRATO = gql`
  mutation UpdateContrato($id: ID!, $input: UpdateContratoInput!) {
    updateContrato(id: $id, input: $input) {
      id
      numero_contrato
      valor_total
      status_nome
    }
  }
`;

export const DELETE_CONTRATO = gql`
  mutation DeleteContrato($id: ID!) {
    deleteContrato(id: $id)
  }
`;

// Fatura Mutations
export const CREATE_FATURA = gql`
  mutation CreateFatura($input: CreateFaturaInput!) {
    createFatura(input: $input) {
      id
      numero_fatura
      valor_original
      valor_final
    }
  }
`;

export const UPDATE_FATURA = gql`
  mutation UpdateFatura($id: ID!, $input: UpdateFaturaInput!) {
    updateFatura(id: $id, input: $input) {
      id
      numero_fatura
      valor_original
      valor_final
      status_nome
    }
  }
`;

export const DELETE_FATURA = gql`
  mutation DeleteFatura($id: ID!) {
    deleteFatura(id: $id)
  }
`;

// Implantacao Mutations
export const CREATE_IMPLANTACAO = gql`
  mutation CreateImplantacao($input: CreateImplantacaoInput!) {
    createImplantacao(input: $input) {
      id
      data_inicio_prevista
      data_fim_prevista
    }
  }
`;

export const UPDATE_IMPLANTACAO = gql`
  mutation UpdateImplantacao($id: ID!, $input: UpdateImplantacaoInput!) {
    updateImplantacao(id: $id, input: $input) {
      id
      data_inicio_prevista
      data_fim_prevista
      data_inicio_real
      data_fim_real
      percentual_conclusao
      status_nome
    }
  }
`;

export const DELETE_IMPLANTACAO = gql`
  mutation DeleteImplantacao($id: ID!) {
    deleteImplantacao(id: $id)
  }
`;

// Profile Mutations
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      nome_completo
      email
      telefone
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`;

// Transacao Mutations
export const CREATE_TRANSACAO = gql`
  mutation CreateTransacao($input: CreateTransacaoInput!) {
    createTransacao(input: $input) {
      id
      tipo_entidade
      valor
      data_transacao
    }
  }
`;

export const UPDATE_TRANSACAO = gql`
  mutation UpdateTransacao($id: ID!, $input: UpdateTransacaoInput!) {
    updateTransacao(id: $id, input: $input) {
      id
      tipo_entidade
      valor
      data_transacao
    }
  }
`;

export const DELETE_TRANSACAO = gql`
  mutation DeleteTransacao($id: ID!) {
    deleteTransacao(id: $id)
  }
`;

