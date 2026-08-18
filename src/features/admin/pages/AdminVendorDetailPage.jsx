import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useAdminVendor, useDeleteAdminVendor } from '@/api/hooks/admin/useAdminVendors';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, Breadcrumbs, ConfirmDialog, PageHeader } from '@/shared/components';

export default function AdminVendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vendor, isLoading, isError } = useAdminVendor(id);
  const deleteVendor = useDeleteAdminVendor();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !vendor) return <Alert variant="danger" title="Vendor not found" />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Vendors', to: '/admin/vendors' }, { label: vendor.name }]} />
      <PageHeader
        title={vendor.name}
        description={`${vendor.contactPerson} · ${vendor.email}`}
        eyebrow="Fleet"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/admin/vendors/${id}/edit`}><Pencil className="size-4" />Edit</Link>
            </Button>
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-4" />Delete
            </Button>
          </div>
        }
      />
      <Card>
        <CardContent className="grid gap-3 p-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><p className="text-text-muted">Contact person</p><p className="font-medium">{vendor.contactPerson}</p></div>
          <div><p className="text-text-muted">Phone</p><p className="font-medium">{vendor.phone}</p></div>
          <div><p className="text-text-muted">Email</p><p className="font-medium">{vendor.email}</p></div>
          <div><p className="text-text-muted">Commission</p><p className="font-medium">{vendor.commissionPercent}%</p></div>
          <div><p className="text-text-muted">Status</p><Badge variant={vendor.status === 'ACTIVE' ? 'success' : 'muted'}>{vendor.status}</Badge></div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete vendor?"
        description="This cannot be undone."
        onConfirm={async () => { await deleteVendor.mutateAsync(id); navigate('/admin/vendors'); }}
        loading={deleteVendor.isPending}
      />
    </div>
  );
}
