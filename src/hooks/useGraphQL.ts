// Custom hooks for GraphQL operations
import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { 
  GET_LEADS, 
  GET_CLIENTES, 
  GET_PRODUTOS, 
  GET_PEDIDOS, 
  GET_ORCAMENTOS,
  GET_CONTRATOS,
  GET_FATURAS,
  GET_IMPLANTACOES,
  GET_COLABORADORES,
  GET_EMPRESAS,
  GET_STATUS,
  GET_TEMPLATES,
  GET_PROFILE,
  GET_TRANSACOES
} from '../graphql/queries';
import {
  CREATE_LEAD,
  UPDATE_LEAD,
  DELETE_LEAD,
  CREATE_CLIENTE,
  UPDATE_CLIENTE,
  DELETE_CLIENTE,
  CREATE_PRODUTO,
  UPDATE_PRODUTO,
  DELETE_PRODUTO,
  CREATE_PEDIDO,
  UPDATE_PEDIDO,
  DELETE_PEDIDO,
  CREATE_ORCAMENTO,
  UPDATE_ORCAMENTO,
  DELETE_ORCAMENTO,
  CREATE_CONTRATO,
  UPDATE_CONTRATO,
  DELETE_CONTRATO,
  CREATE_FATURA,
  UPDATE_FATURA,
  DELETE_FATURA,
  CREATE_IMPLANTACAO,
  UPDATE_IMPLANTACAO,
  DELETE_IMPLANTACAO,
  CREATE_COLABORADOR,
  UPDATE_COLABORADOR,
  DELETE_COLABORADOR,
  CREATE_EMPRESA,
  UPDATE_EMPRESA,
  DELETE_EMPRESA,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  CREATE_TRANSACAO,
  UPDATE_TRANSACAO,
  DELETE_TRANSACAO
} from '../graphql/mutations';

// Generic fetch hook
export function useGraphQLQuery(query, variables = {}, skip = false) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    if (skip) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apolloClient.query({
        query,
        variables,
        fetchPolicy: 'network-only',
      });
      
      // Extract the first key from the result data
      const dataKey = Object.keys(result.data)[0];
      setData(result.data[dataKey]);
    } catch (err: any) {
      setError(err);
      console.error('GraphQL Query Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, JSON.stringify(variables), skip]);

  const refetch = useCallback(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch };
}

// Generic mutation hook
export function useGraphQLMutation(mutation: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (variables: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apolloClient.mutate({
        mutation,
        variables,
      });
      
      // Extract the first key from the result data
      const dataKey = Object.keys(result.data)[0];
      return result.data[dataKey];
    } catch (err: any) {
      setError(err);
      console.error('GraphQL Mutation Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// Hook for Leads
export function useLeads() {
  return useGraphQLQuery(GET_LEADS);
}

export function useLead(id) {
  return useGraphQLQuery(GET_LEADS, { id: String(id) }, !id);
}

export function useCreateLead() {
  return useGraphQLMutation(CREATE_LEAD);
}

export function useUpdateLead() {
  return useGraphQLMutation(UPDATE_LEAD);
}

export function useDeleteLead() {
  return useGraphQLMutation(DELETE_LEAD);
}

// Hook for Clientes
export function useClientes() {
  return useGraphQLQuery(GET_CLIENTES);
}

export function useCliente(id) {
  return useGraphQLQuery(GET_CLIENTES, { id: String(id) }, !id);
}

export function useCreateCliente() {
  return useGraphQLMutation(CREATE_CLIENTE);
}

export function useUpdateCliente() {
  return useGraphQLMutation(UPDATE_CLIENTE);
}

export function useDeleteCliente() {
  return useGraphQLMutation(DELETE_CLIENTE);
}

// Hook for Produtos
export function useProdutos() {
  return useGraphQLQuery(GET_PRODUTOS);
}

export function useProduto(id) {
  return useGraphQLQuery(GET_PRODUTOS, { id: String(id) }, !id);
}

export function useCreateProduto() {
  return useGraphQLMutation(CREATE_PRODUTO);
}

export function useUpdateProduto() {
  return useGraphQLMutation(UPDATE_PRODUTO);
}

export function useDeleteProduto() {
  return useGraphQLMutation(DELETE_PRODUTO);
}

// Hook for Pedidos
export function usePedidos() {
  return useGraphQLQuery(GET_PEDIDOS);
}

export function usePedido(id) {
  return useGraphQLQuery(GET_PEDIDOS, { id: String(id) }, !id);
}

export function useCreatePedido() {
  return useGraphQLMutation(CREATE_PEDIDO);
}

export function useUpdatePedido() {
  return useGraphQLMutation(UPDATE_PEDIDO);
}

export function useDeletePedido() {
  return useGraphQLMutation(DELETE_PEDIDO);
}

// Hook for Orcamentos
export function useOrcamentos() {
  return useGraphQLQuery(GET_ORCAMENTOS);
}

export function useOrcamento(id) {
  return useGraphQLQuery(GET_ORCAMENTOS, { id: String(id) }, !id);
}

export function useCreateOrcamento() {
  return useGraphQLMutation(CREATE_ORCAMENTO);
}

export function useUpdateOrcamento() {
  return useGraphQLMutation(UPDATE_ORCAMENTO);
}

export function useDeleteOrcamento() {
  return useGraphQLMutation(DELETE_ORCAMENTO);
}

// Hook for Contratos
export function useContratos() {
  return useGraphQLQuery(GET_CONTRATOS);
}

export function useContrato(id) {
  return useGraphQLQuery(GET_CONTRATOS, { id: String(id) }, !id);
}

export function useCreateContrato() {
  return useGraphQLMutation(CREATE_CONTRATO);
}

export function useUpdateContrato() {
  return useGraphQLMutation(UPDATE_CONTRATO);
}

export function useDeleteContrato() {
  return useGraphQLMutation(DELETE_CONTRATO);
}

// Hook for Faturas
export function useFaturas(contratoId = null) {
  return useGraphQLQuery(GET_FATURAS, { contrato_id: contratoId });
}

export function useCreateFatura() {
  return useGraphQLMutation(CREATE_FATURA);
}

export function useUpdateFatura() {
  return useGraphQLMutation(UPDATE_FATURA);
}

export function useDeleteFatura() {
  return useGraphQLMutation(DELETE_FATURA);
}

// Hook for Implantacoes
export function useImplantacoes() {
  return useGraphQLQuery(GET_IMPLANTACOES);
}

export function useImplantacao(id) {
  return useGraphQLQuery(GET_IMPLANTACOES, { id: String(id) }, !id);
}

export function useCreateImplantacao() {
  return useGraphQLMutation(CREATE_IMPLANTACAO);
}

export function useUpdateImplantacao() {
  return useGraphQLMutation(UPDATE_IMPLANTACAO);
}

export function useDeleteImplantacao() {
  return useGraphQLMutation(DELETE_IMPLANTACAO);
}

// Hook for Colaboradores
export function useColaboradores() {
  return useGraphQLQuery(GET_COLABORADORES);
}

export function useColaborador(id) {
  return useGraphQLQuery(GET_COLABORADORES, { id: String(id) }, !id);
}

export function useCreateColaborador() {
  return useGraphQLMutation(CREATE_COLABORADOR);
}

export function useUpdateColaborador() {
  return useGraphQLMutation(UPDATE_COLABORADOR);
}

export function useDeleteColaborador() {
  return useGraphQLMutation(DELETE_COLABORADOR);
}

// Hook for Empresas
export function useEmpresas() {
  return useGraphQLQuery(GET_EMPRESAS);
}

export function useEmpresa(id) {
  return useGraphQLQuery(GET_EMPRESAS, { id: String(id) }, !id);
}

export function useCreateEmpresa() {
  return useGraphQLMutation(CREATE_EMPRESA);
}

export function useUpdateEmpresa() {
  return useGraphQLMutation(UPDATE_EMPRESA);
}

export function useDeleteEmpresa() {
  return useGraphQLMutation(DELETE_EMPRESA);
}

// Hook for Status
export function useStatus(tipoEntidade = null) {
  return useGraphQLQuery(GET_STATUS, { tipo_entidade: tipoEntidade });
}

// Hook for Templates
export function useTemplates(tipoTemplate = null) {
  return useGraphQLQuery(GET_TEMPLATES, { tipo_template: tipoTemplate });
}

// Hook for Profile
export function useProfile() {
  return useGraphQLQuery(GET_PROFILE);
}

export function useUpdateProfile() {
  return useGraphQLMutation(UPDATE_PROFILE);
}

export function useChangePassword() {
  return useGraphQLMutation(CHANGE_PASSWORD);
}

// Hook for Transacoes
export function useTransacoes() {
  return useGraphQLQuery(GET_TRANSACOES);
}

export function useCreateTransacao() {
  return useGraphQLMutation(CREATE_TRANSACAO);
}

export function useUpdateTransacao() {
  return useGraphQLMutation(UPDATE_TRANSACAO);
}

export function useDeleteTransacao() {
  return useGraphQLMutation(DELETE_TRANSACAO);
}

