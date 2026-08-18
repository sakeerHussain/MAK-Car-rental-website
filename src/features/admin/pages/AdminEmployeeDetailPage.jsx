import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useAdminEmployee, useDeleteAdminEmployee } from '@/api/hooks/admin/useAdminEmployees';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, Breadcrumbs, ConfirmDialog, PageHeader } from '@/shared/components';

export default function AdminEmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: employee, isLoading, isError } = useAdminEmployee(id);
  const deleteEmployee = useDeleteAdminEmployee();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !employee) return <Alert variant="danger" title="Employee not found" />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Employees', to: '/admin/employees' }, { label: employee.name }]} />
      <PageHeader
        title={employee.name}
        description={`${employee.designation} · ${employee.department}`}
        eyebrow="Fleet"
        actions={
          <div className="flex gap-2">
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-4" />Delete
            </Button>
          </div>
        }
      />
      <Card>
        <CardContent className="grid gap-3 p-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><p className="text-text-muted">Phone</p><p className="font-medium">{employee.phone}</p></div>
          <div><p className="text-text-muted">Email</p><p className="font-medium">{employee.email}</p></div>
          <div><p className="text-text-muted">Department</p><p className="font-medium">{employee.department}</p></div>
          <div><p className="text-text-muted">Designation</p><p className="font-medium">{employee.designation}</p></div>
          <div><p className="text-text-muted">Join date</p><p className="font-medium">{employee.joinDate}</p></div>
          <div>
            <p className="text-text-muted">Status</p>
            <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'muted'}>{employee.status.replace('_', ' ')}</Badge>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete employee?"
        description="This cannot be undone."
        onConfirm={async () => { await deleteEmployee.mutateAsync(id); navigate('/admin/employees'); }}
        loading={deleteEmployee.isPending}
      />
    </div>
  );
}
