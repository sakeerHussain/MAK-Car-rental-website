import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCarReviews, submitReview } from '@/api/reviews.api';

export function useCarReviews(carId) {
  return useQuery({
    queryKey: ['reviews', carId],
    queryFn: () => fetchCarReviews(carId),
    enabled: Boolean(carId),
  });
}

export function useSubmitReview(carId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', carId] });
    },
  });
}
