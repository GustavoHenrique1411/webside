import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_ORCAMENTOS, GET_ORCAMENTO_FULL } from '../graphql/queries';
import { CREATE_ORCAMENTO, UPDATE_ORCAMENTO, DELETE_ORCAMENTO, ENVIAR_ORCAMENTO_EMAIL, ENVIAR_ORCAMENTO_WHATSAPP } from '../graphql/mutations';
import { Orcamento, OrcamentoFormData } from '../types/orcamento';

export function useOrcamentos() {
  const [data, setData] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apolloClient.query({
        query: GET_ORCAMENTOS,
        fetchPolicy: 'network-only',
      });
      setData((result.data as any).orcamentos || []);
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

export function useOrcamentoFull(id: number | undefined) {
  const [data, setData] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(!id);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await apolloClient.query({
          query: GET_ORCAMENTO_FULL,
          variables: { id: String(id) },
          fetchPolicy: 'network-only',
        });
        setData((result.data as any).orcamento || null);
      } catch (err) {
        setError(err as Error);
        console.error('GraphQL Query Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
}

export function useCreateOrcamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (formData: OrcamentoFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Calculate total value from items
      const valorTotal = formData.itens.reduce((total, item) => {
        const itemTotal = item.quantidade * item.valorUnitario;
        const desconto = item.descontoPercentual > 0
          ? itemTotal * (item.descontoPercentual / 100)
          : item.descontoValor;
        return total + (itemTotal - desconto);
      }, 0);

      // Apply general discount
      const valorFinal = formData.descontoGeral > 0
        ? valorTotal * (1 - formData.descontoGeral / 100)
        : valorTotal;

      // Transform items
      const itensTransformed = formData.itens.map((item) => ({
        id_produto: null,
        descricao_item: item.descricao || item.produto || '',
        quantidade: item.quantidade,
        valor_unitario: item.valorUnitario,
        desconto_percentual: item.descontoPercentual || 0,
        desconto_valor: item.descontoValor || 0,
        valor_total: item.quantidade * item.valorUnitario - (item.descontoPercentual > 0
          ? (item.quantidade * item.valorUnitario) * (item.descontoPercentual / 100)
          : item.descontoValor || 0)
      }));

      console.log('Form data being sent:', {
        id_lead: formData.origem === 'lead' && formData.leadId ? parseInt(formData.leadId) : null,
        id_cliente: formData.origem === 'cliente' && formData.clienteId ? parseInt(formData.clienteId) : null,
        valor_total: valorFinal,
        validade_dias: formData.validade || 30,
        observacoes: formData.observacoes || '',
        id_status: 17,
        itens: itensTransformed
      });

      const result = await apolloClient.mutate({
        mutation: CREATE_ORCAMENTO,
        variables: {
          input: {
            id_lead: formData.origem === 'lead' && formData.leadId ? parseInt(formData.leadId) : null,
            id_cliente: formData.origem === 'cliente' && formData.clienteId ? parseInt(formData.clienteId) : null,
            valor_total: valorFinal,
            validade_dias: formData.validade || 30,
            observacoes: formData.observacoes || '',
            id_status: 17,
            itens: itensTransformed
          }
        }
      });

      console.log('CreateOrcamento result:', result);
      console.log('CreateOrcamento result.data:', result?.data);
      console.log('CreateOrcamento result.error:', result?.error);
      
      if (!result.data) {
        if (result.error) {
          throw new Error(`GraphQL Error: ${result.error.message}`);
        }
        throw new Error('No data returned from mutation');
      }

      return (result.data as any).createOrcamento;
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

export function useUpdateOrcamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number, input: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_ORCAMENTO,
        variables: { id, input }
      });

      return (result.data as any).updateOrcamento;
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

export function useDeleteOrcamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: DELETE_ORCAMENTO,
        variables: { id }
      });

      return (result.data as any).deleteOrcamento;
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

export function useEnviarOrcamentoEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (orcamentoId: number, destinatario: string, destinatarioNome: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: ENVIAR_ORCAMENTO_EMAIL,
        variables: {
          input: {
            orcamento_id: String(orcamentoId),
            destinatario,
            destinatario_nome: destinatarioNome
          }
        }
      });

      return (result.data as any).enviarOrcamentoEmail;
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

export function useEnviarOrcamentoWhatsapp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (orcamentoId: number, numeroWhatsapp: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: ENVIAR_ORCAMENTO_WHATSAPP,
        variables: {
          input: {
            orcamento_id: String(orcamentoId),
            numero_whatsapp: numeroWhatsapp
          }
        }
      });

      return (result.data as any).enviarOrcamentoWhatsapp;
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

// Helper function to transform form data to update input
export function transformFormToUpdateInput(formData: OrcamentoFormData): any {
  const valorTotal = formData.itens.reduce((total, item) => {
    const itemTotal = item.quantidade * item.valorUnitario;
    const desconto = item.descontoPercentual > 0
      ? itemTotal * (item.descontoPercentual / 100)
      : item.descontoValor;
    return total + (itemTotal - desconto);
  }, 0);

  const valorFinal = formData.descontoGeral > 0
    ? valorTotal * (1 - formData.descontoGeral / 100)
    : valorTotal;

  return {
    valor_total: valorFinal,
    validade_dias: formData.validade || 30,
    observacoes: formData.observacoes || '',
    id_status: 17
  };
}

