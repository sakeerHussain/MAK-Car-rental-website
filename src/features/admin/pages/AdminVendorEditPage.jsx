import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAdminVendor, useSaveAdminVendor } from '@/api/hooks/admin/useAdminVendors';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, Breadcrumbs, PageHeader } from '@/shared/components';
import { AdminVendorForm } from '@/features/admin/components/AdminVendorForm';

export default function AdminVendorEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vendor, isLoading, isError } = useAdminVendor(id);
  const saveVendor = useSaveAdminVendor();

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !vendor) return <Alert variant="danger" title="Vendor not found" />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Vendors', to: '/admin/vendors' },
          { label: vendor.name, to: `/admin/vendors/${id}` },
          { label: 'Edit' },
        ]}
      />
      <PageHeader title={`Edit ${vendor.name}`} eyebrow="Fleet" />
      <Card>
        <CardContent className="p-6">
          <AdminVendorForm
            defaultValues={vendor}
            loading={saveVendor.isPending}
            onSubmit={async (values) => {
              await saveVendor.mutateAsync({ ...values, id });
              navigate(`/admin/vendors/${id}`);
            }}
          />
        </CardContent>
      </Card>
      <Link to={`/admin/vendors/${id}`} className="text-sm text-primary hover:underline">Cancel</Link>
    </div>
  );
}
