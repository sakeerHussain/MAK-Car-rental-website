import { Link } from 'react-router-dom';
import { Plus, Pencil } from 'lucide-react';
import { useAdminVendors } from '@/api/hooks/admin/useAdminVendors';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, DataTable, PageHeader } from '@/shared/components';

export default function AdminVendorsListPage() {
  const { data: vendors = [], isLoading, isError } = useAdminVendors();

  const columns = [
    { key: 'name', label: 'Vendor', sortable: true },
    { key: 'contactPerson', label: 'Contact' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    {
      key: 'commissionPercent',
      label: 'Commission',
      render: (row) => `${row.commissionPercent}%`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'muted'}>{row.status}</Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/admin/vendors/${row.id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/vendors/${row.id}/edit`}><Pencil className="size-3.5" /></Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet — Vendors"
        description="Manage partner vendors and commission rates."
        eyebrow="Fleet"
        actions={
          <Button asChild>
            <Link to="/admin/vendors/new"><Plus className="size-4" />Add Vendor</Link>
          </Button>
        }
      />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load vendors" />
      ) : (
        <DataTable columns={columns} data={vendors} searchPlaceholder="Search vendors..." />
      )}
    </div>
  );
}
