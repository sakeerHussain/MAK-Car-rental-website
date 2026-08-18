import { Link, useNavigate } from 'react-router-dom';
import { useSaveAdminVendor } from '@/api/hooks/admin/useAdminVendors';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs, PageHeader } from '@/shared/components';
import { AdminVendorForm } from '@/features/admin/components/AdminVendorForm';

export default function AdminVendorNewPage() {
  const navigate = useNavigate();
  const saveVendor = useSaveAdminVendor();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Vendors', to: '/admin/vendors' }, { label: 'Add Vendor' }]} />
      <PageHeader title="Add Vendor" eyebrow="Fleet" />
      <Card>
        <CardContent className="p-6">
          <AdminVendorForm
            loading={saveVendor.isPending}
            onSubmit={async (values) => {
              const vendor = await saveVendor.mutateAsync(values);
              navigate(`/admin/vendors/${vendor.id}`);
            }}
          />
        </CardContent>
      </Card>
      <Link to="/admin/vendors" className="text-sm text-primary hover:underline">Cancel</Link>
    </div>
  );
}
