import { Link } from 'react-router-dom';
import { Plus, Pencil } from 'lucide-react';
import { useAdminCars } from '@/api/hooks/admin/useAdminCars';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  CurrencyDisplay,
  DataTable,
  PageHeader,
} from '@/shared/components';

export default function AdminCarsListPage() {
  const { data: cars = [], isLoading, isError } = useAdminCars();

  const columns = [
    {
      key: 'make',
      label: 'Vehicle',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium">{row.make} {row.model}</p>
          <p className="text-xs text-text-muted">{row.registration}</p>
        </div>
      ),
    },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'seats', label: 'Seats', sortable: true },
    {
      key: 'dailyRate',
      label: 'Daily Rate',
      render: (row) => <CurrencyDisplay amount={row.dailyRate} />,
    },
    {
      key: 'ownership',
      label: 'Ownership',
      render: (row) => <Badge variant="outline">{row.ownership}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : row.status === 'MAINTENANCE' ? 'warning' : 'muted'}>
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
            <Link to={`/admin/cars/${row.id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/cars/${row.id}/edit`}>
              <Pencil className="size-3.5" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet — Cars"
        description="Manage vehicle inventory, rates, and availability."
        eyebrow="Fleet"
        actions={
          <Button asChild>
            <Link to="/admin/cars/new">
              <Plus className="size-4" />
              Add Car
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : isError ? (
        <Alert variant="danger" title="Failed to load cars" />
      ) : (
        <DataTable columns={columns} data={cars} searchPlaceholder="Search cars..." />
      )}
    </div>
  );
}
