import { Link } from 'react-router-dom';
import { Plus, Pencil } from 'lucide-react';
import { useAdminEmployees } from '@/api/hooks/admin/useAdminEmployees';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, DataTable, PageHeader } from '@/shared/components';

export default function AdminEmployeesListPage() {
  const { data: employees = [], isLoading, isError } = useAdminEmployees();

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : row.status === 'ON_LEAVE' ? 'warning' : 'muted'}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/admin/employees/${row.id}`}>View</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet — Employees"
        description="Internal staff and operations team members."
        eyebrow="Fleet"
        actions={
          <Button asChild>
            <Link to="/admin/employees/new"><Plus className="size-4" />Add Employee</Link>
          </Button>
        }
      />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load employees" />
      ) : (
        <DataTable columns={columns} data={employees} searchPlaceholder="Search employees..." />
      )}
    </div>
  );
}
