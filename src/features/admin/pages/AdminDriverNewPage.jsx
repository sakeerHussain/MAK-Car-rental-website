import { Link, useNavigate } from 'react-router-dom';
import { useAdminVendors } from '@/api/hooks/admin/useAdminDashboard';
import { useSaveAdminDriver } from '@/api/hooks/admin/useAdminDrivers';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs, PageHeader } from '@/shared/components';
import { AdminDriverForm } from '@/features/admin/components/AdminDriverForm';

export default function AdminDriverNewPage() {
  const navigate = useNavigate();
  const { data: vendors = [] } = useAdminVendors();
  const saveDriver = useSaveAdminDriver();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Drivers', to: '/admin/drivers' }, { label: 'Add Driver' }]} />
      <PageHeader title="Add Driver" eyebrow="Fleet" />
      <Card><CardContent className="p-6">
        <AdminDriverForm
          vendors={vendors}
          loading={saveDriver.isPending}
          onSubmit={async (values) => {
            const driver = await saveDriver.mutateAsync(values);
            navigate(`/admin/drivers/${driver.id}`);
          }}
        />
      </CardContent></Card>
      <Link to="/admin/drivers" className="text-sm text-primary hover:underline">Cancel</Link>
    </div>
  );
}
