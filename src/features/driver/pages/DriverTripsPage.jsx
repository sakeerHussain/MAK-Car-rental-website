import { useState } from 'react';
import { useDriverTrips } from '@/api/hooks/useDriver';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FilterField, FilterPanel } from '@/shared/components';
import { Alert, CurrencyDisplay, DataTable, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/utils/rental';

export default function DriverTripsPage() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const { data: trips = [], isLoading, isError } = useDriverTrips(filters);

  const columns = [
    { key: 'carName', label: 'Vehicle', sortable: true },
    { key: 'customerName', label: 'Customer' },
    { key: 'type', label: 'Type', render: (row) => <Badge variant="outline">{row.type}</Badge> },
    {
      key: 'pickupDate',
      label: 'Pickup',
      render: (row) => formatDate(row.pickupDate),
      sortable: true,
    },
    { key: 'pickup', label: 'From' },
    { key: 'destination', label: 'To' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} type="transport" />,
    },
    {
      key: 'earnings',
      label: 'Earnings',
      render: (row) => row.earnings ? <CurrencyDisplay amount={row.earnings} /> : '—',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Trip History" description="Full record of your assignments and earnings." eyebrow="Driver Portal" />
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
        <DataTable columns={columns} data={trips} searchPlaceholder="Search trips..." emptyTitle="No trips found" />
      )}
    </div>
  );
}
