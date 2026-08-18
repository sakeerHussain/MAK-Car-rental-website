import { Link } from 'react-router-dom';
import { Plus, Pencil } from 'lucide-react';
import { useAdminDrivers } from '@/api/hooks/admin/useAdminDrivers';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, CurrencyDisplay, DataTable, PageHeader } from '@/shared/components';

export default function AdminDriversListPage() {
  const { data: drivers = [], isLoading, isError } = useAdminDrivers();

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'category', label: 'Category' },
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
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/admin/drivers/${row.id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/drivers/${row.id}/edit`}><Pencil className="size-3.5" /></Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet — Drivers"
        description="Manage chauffeurs, licences, and availability."
        eyebrow="Fleet"
        actions={
          <Button asChild>
            <Link to="/admin/drivers/new"><Plus className="size-4" />Add Driver</Link>
          </Button>
        }
      />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load drivers" />
      ) : (
        <DataTable columns={columns} data={drivers} searchPlaceholder="Search drivers..." />
      )}
    </div>
  );
}
