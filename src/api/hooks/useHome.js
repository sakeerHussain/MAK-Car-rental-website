import { useQuery } from '@tanstack/react-query';
import { fetchHomeData } from '@/api/home.api';

export function useHomeData() {
  return useQuery({
    queryKey: ['home'],
    queryFn: fetchHomeData,
  });
}
