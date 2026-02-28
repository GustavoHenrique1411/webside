import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_FATURAS } from '../graphql/queries';
import { CREATE_FATURA, UPDATE_FATURA, DELETE_FATURA } from '../graphql/mutations';

export function useFaturas(contratoId?: number) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apolloClient.query({
        query: GET_FATURAS,
        variables: contratoId ? { contrato_id: String(contratoId) } : {},
        fetchPolicy: 'network-only',
      });
      setData((result.data as any).faturas || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [contratoId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useCreateFatura() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (input: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: CREATE_FATURA,
        variables: { input },
      });
      return (result.data as any).createFatura;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useUpdateFatura() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number, input: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_FATURA,
        variables: { id, input },
      });
      return (result.data as any).updateFatura;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useDeleteFatura() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: DELETE_FATURA,
        variables: { id },
      });
      return (result.data as any).deleteFatura;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

