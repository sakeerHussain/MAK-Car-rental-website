import { useState } from 'react';
import { useVendorTrips } from '@/api/hooks/useVendor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterField, FilterPanel } from '@/shared/components';
import { Alert, CurrencyDisplay, DataTable, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/utils/rental';

export default function VendorTripsPage() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const { data: trips = [], isLoading, isError } = useVendorTrips(filters);

  const columns = [
    { key: 'carName', label: 'Vehicle', sortable: true },
    { key: 'driverName', label: 'Driver', render: (row) => row.driverName || '—' },
    { key: 'customerName', label: 'Customer' },
    {
      key: 'pickupDate',
      label: 'Pickup',
      render: (row) => formatDate(row.pickupDate),
      sortable: true,
    },
    { key: 'pickup', label: 'From' },
    { key: 'destination', label: 'To' },
    {
      key: 'total',
      label: 'Amount',
      render: (row) => <CurrencyDisplay amount={row.total} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Trip History" description="All trips involving your fleet and drivers." eyebrow="Vendor Portal" />
      <FilterPanel title="Period filter" onReset={() => setFilters({ startDate: '', endDate: '' })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FilterField label="Start date">
            <Input type="date" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
          </FilterField>
          <FilterField label="End date">
            <Input type="date" value={filters.endDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
          </FilterField>
        </div>
      </FilterPanel>
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load trips" />
      ) : (
        <DataTable columns={columns} data={trips} searchPlaceholder="Search trips..." emptyTitle="No trips in this period" />
      )}
    </div>
  );
}
