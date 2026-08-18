import { useQuery } from '@tanstack/react-query';
import { fetchCar, fetchCars } from '@/api/cars.api';

export function useCars(params = {}) {
  return useQuery({
    queryKey: ['cars', params],
    queryFn: () => fetchCars(params),
  });
}

export function useCar(id) {
  return useQuery({
    queryKey: ['cars', id],
    queryFn: () => fetchCar(id),
    enabled: Boolean(id),
  });
}
