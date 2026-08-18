import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import {
  useAdminDriver,
  useDeleteAdminDriver,
  useDeleteAdminDriverDocument,
  useSaveAdminDriverDocument,
  useUpdateAdminDriverStatus,
} from '@/api/hooks/admin/useAdminDrivers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  Breadcrumbs,
  ConfirmDialog,
  CurrencyDisplay,
  PageHeader,
} from '@/shared/components';

export default function AdminDriverDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: driver, isLoading, isError } = useAdminDriver(id);
  const deleteDriver = useDeleteAdminDriver();
  const updateStatus = useUpdateAdminDriverStatus();
  const saveDoc = useSaveAdminDriverDocument(id);
  const deleteDoc = useDeleteAdminDriverDocument(id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [docForm, setDocForm] = useState({ type: 'LICENCE', expiryDate: '', fileName: '' });

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !driver) return <Alert variant="danger" title="Driver not found" />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Drivers', to: '/admin/drivers' }, { label: driver.name }]} />
      <PageHeader
        title={driver.name}
        description={`${driver.phone} · ${driver.category}`}
        eyebrow="Fleet"
        actions={
          <div className="flex gap-2">
            <Select
              value={driver.status}
              onChange={(e) => updateStatus.mutate({ id, status: e.target.value })}
              className="w-36"
            >
              <option value="AVAILABLE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="OFF">Off Duty</option>
            </Select>
            <Button variant="outline" asChild><Link to={`/admin/drivers/${id}/edit`}><Pencil className="size-4" />Edit</Link></Button>
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 className="size-4" />Delete</Button>
          </div>
        }
      />

      <Card>
        <CardContent className="grid gap-3 p-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><p className="text-text-muted">Licence</p><p className="font-medium">{driver.licenceNumber}</p></div>
          <div><p className="text-text-muted">Expiry</p><p className="font-medium">{driver.licenceExpiry}</p></div>
          <div><p className="text-text-muted">Experience</p><p className="font-medium">{driver.experienceYears} years</p></div>
          <div><p className="text-text-muted">Employment</p><p className="font-medium">{driver.employmentType}</p></div>
          <div><p className="text-text-muted">Status</p><Badge>{driver.status}</Badge></div>
          <div><p className="text-text-muted">Daily charge</p><CurrencyDisplay amount={driver.dailyCharge} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(driver.documents || []).map((doc) => (
            <div key={doc.id} className="flex justify-between rounded-lg border border-border-brand px-3 py-2 text-sm">
              <span>{doc.type} — {doc.expiryDate}</span>
              <Button variant="ghost" size="sm" onClick={() => deleteDoc.mutate(doc.id)}><Trash2 className="size-4" /></Button>
            </div>
          ))}
          <form
            className="grid gap-2 sm:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault();
              saveDoc.mutate(docForm, { onSuccess: () => setDocForm({ type: 'LICENCE', expiryDate: '', fileName: '' }) });
            }}
          >
            <Input value={docForm.type} onChange={(e) => setDocForm((f) => ({ ...f, type: e.target.value }))} />
            <Input type="date" value={docForm.expiryDate} onChange={(e) => setDocForm((f) => ({ ...f, expiryDate: e.target.value }))} required />
            <Input placeholder="File name" value={docForm.fileName} onChange={(e) => setDocForm((f) => ({ ...f, fileName: e.target.value }))} required />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete driver?"
        description="This cannot be undone."
        onConfirm={async () => { await deleteDriver.mutateAsync(id); navigate('/admin/drivers'); }}
        loading={deleteDriver.isPending}
      />
    </div>
  );
}
