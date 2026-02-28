import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_LEADS } from '../graphql/queries';
import { CREATE_LEAD, UPDATE_LEAD, DELETE_LEAD } from '../graphql/mutations';
import { Lead, LeadFormData } from '../types/lead';

export function useLeads() {
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apolloClient.query({
        query: GET_LEADS,
        fetchPolicy: 'network-only',
      });
      setData((result.data as any).leads || []);
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

export function useCreateLead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (formData: LeadFormData) => {
    setLoading(true);
    setError(null);

    try {
      const input = {
        nome_empresa: formData.empresa || '',
        contato_principal: formData.nome || '',
        telefone_contato: formData.telefone || '',
        email_contato: formData.email || '',
        fonte_lead: formData.origem || 'Site'
      };

      console.log('Creating lead with input:', input);

      const result = await apolloClient.mutate({
        mutation: CREATE_LEAD,
        variables: { input }
      });

      console.log('Create lead result:', result);
      
      // Check for GraphQL errors (cast to any to access errors array)
      const resultAny = result as any;
      if (resultAny.errors && resultAny.errors.length > 0) {
        console.error('GraphQL Errors:', resultAny.errors);
        throw new Error(resultAny.errors[0].message);
      }
      
      if (!result.data) {
        throw new Error('No data returned from mutation');
      }
      
      return (result.data as any).createLead;
    } catch (err: any) {
      setError(err);
      console.error('GraphQL Mutation Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useUpdateLead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number, input: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_LEAD,
        variables: { id, input }
      });

      // Check for GraphQL errors
      const resultAny = result as any;
      if (resultAny.errors && resultAny.errors.length > 0) {
        console.error('GraphQL Errors:', resultAny.errors);
        throw new Error(resultAny.errors[0].message);
      }

      return (result.data as any).updateLead;
    } catch (err: any) {
      setError(err);
      console.error('GraphQL Mutation Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useDeleteLead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: DELETE_LEAD,
        variables: { id }
      });

      // Check for GraphQL errors
      const resultAny = result as any;
      if (resultAny.errors && resultAny.errors.length > 0) {
        console.error('GraphQL Errors:', resultAny.errors);
        throw new Error(resultAny.errors[0].message);
      }

      return (result.data as any).deleteLead;
    } catch (err: any) {
      setError(err);
      console.error('GraphQL Mutation Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
