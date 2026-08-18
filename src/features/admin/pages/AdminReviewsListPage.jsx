import { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { REVIEW_STATUSES } from '@/shared/models/enums';
import {
  useAdminReviews,
  useApproveAdminReview,
  useDeleteAdminReview,
} from '@/api/hooks/admin/useAdminReviews';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  ConfirmDialog,
  DataTable,
  PageHeader,
  StarRating,
} from '@/shared/components';
import { formatDate } from '@/shared/utils/rental';

export default function AdminReviewsListPage() {
  const { data: reviews = [], isLoading, isError } = useAdminReviews();
  const approveReview = useApproveAdminReview();
  const deleteReview = useDeleteAdminReview();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteId, setDeleteId] = useState(null);

  const filtered = statusFilter === 'ALL'
    ? reviews
    : reviews.filter((r) => r.status === statusFilter);

  const columns = [
    { key: 'carName', label: 'Vehicle', sortable: true },
    { key: 'customerName', label: 'Customer' },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => <StarRating value={row.rating} />,
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row) => <span className="max-w-xs truncate text-sm">{row.comment}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'APPROVED' ? 'success' : 'warning'}>{row.status}</Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'PENDING' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => approveReview.mutate(row.id)}
              disabled={approveReview.isPending}
            >
              <Check className="size-3.5" />Approve
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(row.id)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews Moderation"
        description="Approve or remove customer vehicle reviews."
        eyebrow="Insights"
        actions={
          <div className="flex gap-2">
            {['ALL', ...REVIEW_STATUSES].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(s)}
              >
                {s === 'ALL' ? 'All' : s}
              </Button>
            ))}
          </div>
        }
      />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load reviews" />
      ) : (
        <DataTable columns={columns} data={filtered} searchPlaceholder="Search reviews..." />
      )}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete review?"
        description="This review will be permanently removed."
        onConfirm={async () => {
          await deleteReview.mutateAsync(deleteId);
          setDeleteId(null);
        }}
        loading={deleteReview.isPending}
      />
    </div>
  );
}
