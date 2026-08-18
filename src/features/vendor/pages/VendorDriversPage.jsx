import { useVendorDrivers } from '@/api/hooks/useVendor';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, CurrencyDisplay, DataTable, PageHeader } from '@/shared/components';

export default function VendorDriversPage() {
  const { data: drivers = [], isLoading, isError } = useVendorDrivers();

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'category', label: 'Category' },
    { key: 'licenceExpiry', label: 'Licence Expiry' },
    {
      key: 'dailyCharge',
      label: 'Daily Charge',
      render: (row) => <CurrencyDisplay amount={row.dailyCharge} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'AVAILABLE' ? 'success' : row.status === 'BUSY' ? 'warning' : 'muted'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Drivers" description="Chauffeurs registered under your vendor account." eyebrow="Vendor Portal" />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load drivers" />
      ) : (
        <DataTable columns={columns} data={drivers} searchPlaceholder="Search drivers..." emptyTitle="No drivers registered" />
      )}
    </div>
  );
}
