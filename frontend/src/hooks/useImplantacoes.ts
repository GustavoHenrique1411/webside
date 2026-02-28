import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_IMPLANTACOES } from '../graphql/queries';
import { CREATE_IMPLANTACAO, UPDATE_IMPLANTACAO, DELETE_IMPLANTACAO } from '../graphql/mutations';

export function useImplantacoes() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apolloClient.query({
        query: GET_IMPLANTACOES,
        fetchPolicy: 'network-only',
      });
      setData((result.data as any).implantacoes || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useCreateImplantacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (input: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: CREATE_IMPLANTACAO,
        variables: { input },
      });
      return (result.data as any).createImplantacao;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useUpdateImplantacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number, input: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_IMPLANTACAO,
        variables: { id, input },
      });
      return (result.data as any).updateImplantacao;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useDeleteImplantacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: DELETE_IMPLANTACAO,
        variables: { id },
      });
      return (result.data as any).deleteImplantacao;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

