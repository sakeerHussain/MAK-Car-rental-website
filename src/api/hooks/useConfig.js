import { useQuery } from '@tanstack/react-query';
import { fetchConfig } from '@/api/config.api';

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: fetchConfig,
    staleTime: Infinity,
  });
}
