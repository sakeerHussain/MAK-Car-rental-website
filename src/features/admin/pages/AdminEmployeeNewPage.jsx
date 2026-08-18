import { Link, useNavigate } from 'react-router-dom';
import { useSaveAdminEmployee } from '@/api/hooks/admin/useAdminEmployees';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs, PageHeader } from '@/shared/components';
import { AdminEmployeeForm } from '@/features/admin/components/AdminEmployeeForm';

export default function AdminEmployeeNewPage() {
  const navigate = useNavigate();
  const saveEmployee = useSaveAdminEmployee();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Employees', to: '/admin/employees' }, { label: 'Add Employee' }]} />
      <PageHeader title="Add Employee" eyebrow="Fleet" />
      <Card>
        <CardContent className="p-6">
          <AdminEmployeeForm
            loading={saveEmployee.isPending}
            onSubmit={async (values) => {
              const employee = await saveEmployee.mutateAsync(values);
              navigate(`/admin/employees/${employee.id}`);
            }}
          />
        </CardContent>
      </Card>
      <Link to="/admin/employees" className="text-sm text-primary hover:underline">Cancel</Link>
    </div>
  );
}
