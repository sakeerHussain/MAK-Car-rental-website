import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUSES, TRANSPORT_STATUSES } from '@/shared/models/enums';

const bookingVariants = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

const transportVariants = {
  REQUESTED: 'muted',
  ASSIGNED: 'info',
  CONFIRMED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

function formatLabel(status) {
  return status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * @param {{ status: string, type?: 'booking' | 'transport', className?: string }} props
 */
export function StatusBadge({ status, type = 'booking', className }) {
  const variants = type === 'transport' ? transportVariants : bookingVariants;
  const knownStatuses = type === 'transport' ? TRANSPORT_STATUSES : BOOKING_STATUSES;
  const variant = variants[status] || 'outline';

  return (
    <Badge variant={variant} className={className}>
      {knownStatuses.includes(status) ? formatLabel(status) : status}
    </Badge>
  );
}
