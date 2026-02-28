import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_PEDIDOS } from '../graphql/queries';
import { CREATE_PEDIDO, UPDATE_PEDIDO, DELETE_PEDIDO } from '../graphql/mutations';

export function usePedidos() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apolloClient.query({
        query: GET_PEDIDOS,
        fetchPolicy: 'network-only',
      });
      setData((result.data as any).pedidos || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useCreatePedido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (input: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: CREATE_PEDIDO,
        variables: { input },
      });
      return (result.data as any).createPedido;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useUpdatePedido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number, input: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_PEDIDO,
        variables: { id, input },
      });
      return (result.data as any).updatePedido;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useDeletePedido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: DELETE_PEDIDO,
        variables: { id },
      });
      return (result.data as any).deletePedido;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

