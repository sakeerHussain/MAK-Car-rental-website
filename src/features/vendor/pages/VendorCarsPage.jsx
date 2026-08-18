import { useVendorCars } from '@/api/hooks/useVendor';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, CurrencyDisplay, DataTable, PageHeader } from '@/shared/components';

export default function VendorCarsPage() {
  const { data: cars = [], isLoading, isError } = useVendorCars();

  const columns = [
    { key: 'make', label: 'Make', render: (row) => `${row.make} ${row.model}` },
    { key: 'registration', label: 'Registration' },
    { key: 'type', label: 'Type' },
    { key: 'seats', label: 'Seats' },
    { key: 'transmission', label: 'Transmission' },
    {
      key: 'dailyRate',
      label: 'Daily Rate',
      render: (row) => <CurrencyDisplay amount={row.dailyRate} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'warning'}>{row.status}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Vehicles" description="Read-only view of vehicles assigned to your vendor account." eyebrow="Vendor Portal" />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load vehicles" />
      ) : (
        <DataTable columns={columns} data={cars} searchPlaceholder="Search vehicles..." emptyTitle="No vehicles assigned" />
      )}
    </div>
  );
}
