import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { gql } from '@apollo/client';

// Query para buscar parâmetros
const GET_PARAMETROS_EMPRESA = gql`
  query GetParametrosEmpresa {
    parametros_empresa {
      id_parametro
      salario_minimo
      percentual_reajuste
      dias_vencimento_fatura
      taxa_juros_mora
      data_vigencia
      __typename
    }
  }
`;

// Mutation para atualizar parâmetros
const UPDATE_PARAMETROS_EMPRESA = gql`
  mutation UpdateParametrosEmpresa($input: UpdateParametrosEmpresaInput!) {
    updateParametrosEmpresa(input: $input) {
      id_parametro
      salario_minimo
      percentual_reajuste
      dias_vencimento_fatura
      taxa_juros_mora
      data_vigencia
    }
  }
`;

export interface ParametrosEmpresa {
  id_parametro?: number;
  salario_minimo: number;
  percentual_reajuste: number;
  dias_vencimento_fatura: number;
  taxa_juros_mora: number;
  data_vigencia: string;
}

export function useParametrosEmpresa() {
  const [data, setData] = useState<ParametrosEmpresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apolloClient.query({
        query: GET_PARAMETROS_EMPRESA,
        fetchPolicy: 'network-only',
      });
      setData((result.data as any).parametros_empresa || null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useUpdateParametrosEmpresa() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (input: ParametrosEmpresa) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_PARAMETROS_EMPRESA,
        variables: { input },
      });
      return (result.data as any).updateParametrosEmpresa;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
