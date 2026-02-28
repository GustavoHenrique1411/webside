import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_STATUS } from '../graphql/queries';

export function useStatus(tipoEntidade?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apolloClient.query({
        query: GET_STATUS,
        variables: tipoEntidade ? { tipo_entidade: tipoEntidade } : {},
        fetchPolicy: 'network-only',
      });
      setData((result.data as any).status || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [tipoEntidade]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

