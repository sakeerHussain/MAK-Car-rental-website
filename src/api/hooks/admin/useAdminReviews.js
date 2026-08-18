import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveAdminReview,
  deleteAdminReview,
  fetchAdminReviews,
} from '@/api/admin/reviews.api';

export function useAdminReviews() {
  return useQuery({ queryKey: ['admin', 'reviews'], queryFn: fetchAdminReviews });
}

export function useApproveAdminReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveAdminReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
  });
}

export function useDeleteAdminReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
  });
}
