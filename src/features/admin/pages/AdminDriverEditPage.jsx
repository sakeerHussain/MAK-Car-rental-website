import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAdminDriver, useSaveAdminDriver } from '@/api/hooks/admin/useAdminDrivers';
import { useAdminVendors } from '@/api/hooks/admin/useAdminDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, Breadcrumbs, PageHeader } from '@/shared/components';
import { AdminDriverForm } from '@/features/admin/components/AdminDriverForm';

export default function AdminDriverEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: driver, isLoading, isError } = useAdminDriver(id);
  const { data: vendors = [] } = useAdminVendors();
  const saveDriver = useSaveAdminDriver();

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !driver) return <Alert variant="danger" title="Driver not found" />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Drivers', to: '/admin/drivers' }, { label: driver.name, to: `/admin/drivers/${id}` }, { label: 'Edit' }]} />
      <PageHeader title={`Edit ${driver.name}`} eyebrow="Fleet" />
      <Card><CardContent className="p-6">
        <AdminDriverForm
          defaultValues={driver}
          vendors={vendors}
          loading={saveDriver.isPending}
          onSubmit={async (values) => {
            await saveDriver.mutateAsync({ ...values, id });
            navigate(`/admin/drivers/${id}`);
          }}
        />
      </CardContent></Card>
    </div>
  );
}
