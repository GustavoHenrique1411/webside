import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_CLIENTES } from '../graphql/queries';
import { CREATE_CLIENTE, UPDATE_CLIENTE, DELETE_CLIENTE } from '../graphql/mutations';
import { Cliente, ClienteFormData } from '../types/cliente';

export function useClientes() {
  const [data, setData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apolloClient.query({
        query: GET_CLIENTES,
        fetchPolicy: 'network-only',
      });
      setData((result.data as any).clientes || []);
    } catch (err) {
      setError(err as Error);
      console.error('GraphQL Query Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export function useCreateCliente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (formData: ClienteFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: CREATE_CLIENTE,
        variables: {
          input: {
            razao_social: formData.razao_social,
            nome_fantasia: formData.nome_fantasia,
            cnpj: formData.cnpj,
            inscricao_estadual: formData.inscricao_estadual,
            porte_empresa: formData.porte_empresa || 'ME',
            data_fundacao: formData.data_fundacao || null
          }
        }
      });

      return (result.data as any).createCliente;
    } catch (err) {
      setError(err as Error);
      console.error('GraphQL Mutation Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useUpdateCliente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number, input: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_CLIENTE,
        variables: { id, input }
      });

      return (result.data as any).updateCliente;
    } catch (err) {
      setError(err as Error);
      console.error('GraphQL Mutation Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useDeleteCliente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: DELETE_CLIENTE,
        variables: { id }
      });

      return (result.data as any).deleteCliente;
    } catch (err) {
      setError(err as Error);
      console.error('GraphQL Mutation Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

