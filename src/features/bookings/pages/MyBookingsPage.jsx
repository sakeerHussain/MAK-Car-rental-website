import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useMyBookings } from '@/api/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Alert,
  CurrencyDisplay,
  DataTable,
  PageHeader,
  StatusBadge,
} from '@/shared/components';
import { formatDate, getLocationLabel } from '@/shared/utils/rental';
import { useConfig } from '@/api/hooks/useConfig';

export default function MyBookingsPage() {
  const { data, isLoading, isError } = useMyBookings();
  const { data: config } = useConfig();

  const columns = [
    {
      key: 'carName',
      label: 'Vehicle',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium">{row.carName}</p>
          {row.withDriver && row.driverName ? (
            <p className="text-xs text-text-muted">Driver: {row.driverName}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'pickupDate',
      label: 'Dates',
      render: (row) => (
        <div className="text-sm">
          <p>{formatDate(row.pickupDate)}</p>
          <p className="text-text-muted">to {formatDate(row.returnDate)}</p>
        </div>
      ),
    },
    {
      key: 'pickupLocation',
      label: 'Route',
      render: (row) => (
        <span className="text-sm">
          {getLocationLabel(row.pickupLocation, config?.locations || [])}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (row) => <CurrencyDisplay amount={row.total} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'invoice',
      label: 'Invoice',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/my-bookings/${row.id}/invoice`}>
              <FileText className="size-4" />
              View
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/my-bookings/${row.id}/invoice/pdf`}>PDF</Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="My Bookings"
        description="View your rental history, booking status, and invoices."
        eyebrow="Customer Portal"
        actions={
          <Button asChild>
            <Link to="/cars">Book a vehicle</Link>
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : isError ? (
        <Alert variant="danger" title="Failed to load bookings" />
      ) : (
        <DataTable
          columns={columns}
          data={data?.bookings || []}
          searchable
          searchPlaceholder="Search bookings..."
          emptyTitle="No bookings yet"
          emptyDescription="Browse our fleet and make your first reservation."
          emptyAction={
            <Button asChild>
              <Link to="/cars">Browse vehicles</Link>
            </Button>
          }
          mobileCardRender={(row) => (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <p className="font-semibold">{row.carName}</p>
                <StatusBadge status={row.status} />
              </div>
              <p className="text-sm text-text-secondary">
                {formatDate(row.pickupDate)} — {formatDate(row.returnDate)}
              </p>
              <div className="flex items-center justify-between">
                <CurrencyDisplay amount={row.total} />
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/my-bookings/${row.id}/invoice`}>Invoice</Link>
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
