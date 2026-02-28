import { useState, useEffect, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_PROFILE } from '../graphql/queries';
import { UPDATE_PROFILE } from '../graphql/mutations';
import { useAuth } from '../contexts/AuthContext';

export function useProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await apolloClient.query({
        query: GET_PROFILE,
        fetchPolicy: 'network-only',
      });
      const profileData = (result.data as any).profile;
      if (profileData) {
        setUser(profileData);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, setUser]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  return { user, loading, error, refetch: fetchProfile };
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (input: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_PROFILE,
        variables: { input },
      });
      return (result.data as any).updateProfile;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

