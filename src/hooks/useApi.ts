import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useApiQuery = (key: string[], queryFn: () => Promise<any>, options: any = {}) => {
  return useQuery({
    queryKey: key,
    queryFn,
    ...options
  });
};

export const useApiMutation = (mutationFn: (data: any) => Promise<any>, options: any = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      options.onSuccess?.(data);
    }
  });
};
