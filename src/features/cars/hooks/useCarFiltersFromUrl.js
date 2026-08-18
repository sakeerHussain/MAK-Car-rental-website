import { useSearchParams } from 'react-router-dom';
import { parseCarFilters } from '@/shared/utils/carFilters';

export function useCarFiltersFromUrl() {
  const [searchParams] = useSearchParams();
  return parseCarFilters(searchParams);
}
