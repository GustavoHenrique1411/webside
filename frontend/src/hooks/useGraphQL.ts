// Custom hooks for GraphQL operations
import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';

// Generic fetch hook
export function useGraphQLQuery(query: any, variables = {}, skip = false) {
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

// Re-export specific hooks from separate files for backwards compatibility
export { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from './useLeads';
export { useClientes, useCreateCliente, useUpdateCliente, useDeleteCliente } from './useClientes';
export { useProdutos, useCreateProduto, useUpdateProduto, useDeleteProduto } from './useProdutos';
export { usePedidos, useCreatePedido, useUpdatePedido, useDeletePedido } from './usePedidos';
export { useContratos, useCreateContrato, useUpdateContrato, useDeleteContrato } from './useContratos';
export { useFaturas, useCreateFatura, useUpdateFatura, useDeleteFatura } from './useFaturas';
export { useImplantacoes, useCreateImplantacao, useUpdateImplantacao, useDeleteImplantacao } from './useImplantacoes';
export { useColaboradores, useCreateColaborador, useUpdateColaborador, useDeleteColaborador } from './useColaboradores';
export { useEmpresas, useCreateEmpresa, useUpdateEmpresa, useDeleteEmpresa } from './useEmpresas';
export { useStatus } from './useStatus';
export { useTemplates } from './useTemplates';
export { useTransacoes, useCreateTransacao, useUpdateTransacao, useDeleteTransacao } from './useTransacoes';
export { useProfile, useUpdateProfile } from './useProfile';

// Permissões hook
export function usePermissoes() {
  return useGraphQLQuery(require('../graphql/queries').GET_PERMISSOES);
}

