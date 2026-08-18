import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import {
  useAdminCar,
  useDeleteAdminCar,
  useDeleteAdminCarDocument,
  useDeleteAdminCarPhoto,
  useSaveAdminCarDocument,
  useSaveAdminCarPhoto,
} from '@/api/hooks/admin/useAdminCars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const DOC_TYPES = ['RC', 'INSURANCE', 'PERMIT', 'POLLUTION'];

export default function AdminCarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: car, isLoading, isError } = useAdminCar(id);
  const deleteCar = useDeleteAdminCar();
  const saveDoc = useSaveAdminCarDocument(id);
  const deleteDoc = useDeleteAdminCarDocument(id);
  const savePhoto = useSaveAdminCarPhoto(id);
  const deletePhoto = useDeleteAdminCarPhoto(id);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [docForm, setDocForm] = useState({ type: 'RC', expiryDate: '', fileName: '' });
  const [photoUrl, setPhotoUrl] = useState('');

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (isError || !car) return <Alert variant="danger" title="Car not found" />;

  const handleDelete = async () => {
    await deleteCar.mutateAsync(id);
    navigate('/admin/cars');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Cars', to: '/admin/cars' }, { label: `${car.make} ${car.model}` }]} />

      <PageHeader
        title={`${car.make} ${car.model}`}
        description={`${car.registration} · ${car.year} · ${car.colour}`}
        eyebrow="Fleet"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/admin/cars/${id}/edit`}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
            <Spec label="Type" value={car.type} />
            <Spec label="Seats" value={car.seats} />
            <Spec label="Transmission" value={car.transmission} />
            <Spec label="Fuel" value={car.fuel} />
            <Spec label="Ownership" value={car.ownership} />
            <Spec label="Status" value={<Badge>{car.status}</Badge>} />
            <Spec label="Hourly" value={<CurrencyDisplay amount={car.hourlyRate} />} />
            <Spec label="Daily" value={<CurrencyDisplay amount={car.dailyRate} />} />
            <Spec label="Monthly" value={<CurrencyDisplay amount={car.monthlyRate} />} />
          </CardContent>
        </Card>

        {car.imageUrl ? (
          <img src={car.imageUrl} alt="" className="rounded-xl border border-border-brand object-cover" />
        ) : null}
      </div>

      {car.featureTags?.length ? (
        <div className="flex flex-wrap gap-2">
          {car.featureTags.map((tag) => (
            <Badge key={tag} variant="muted">{tag}</Badge>
          ))}
        </div>
      ) : null}

      <Card>
        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {(car.documents || []).map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border-brand px-3 py-2 text-sm">
              <span>{doc.type} — expires {doc.expiryDate} ({doc.fileName})</span>
              <Button variant="ghost" size="sm" onClick={() => deleteDoc.mutate(doc.id)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <form
            className="grid gap-3 sm:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault();
              saveDoc.mutate(docForm, { onSuccess: () => setDocForm({ type: 'RC', expiryDate: '', fileName: '' }) });
            }}
          >
            <Select value={docForm.type} onChange={(e) => setDocForm((f) => ({ ...f, type: e.target.value }))}>
              {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Input type="date" value={docForm.expiryDate} onChange={(e) => setDocForm((f) => ({ ...f, expiryDate: e.target.value }))} required />
            <Input placeholder="File name" value={docForm.fileName} onChange={(e) => setDocForm((f) => ({ ...f, fileName: e.target.value }))} required />
            <Button type="submit" disabled={saveDoc.isPending}>Add Document</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Photo Gallery</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {(car.media || []).map((photo) => (
              <div key={photo.id} className="relative overflow-hidden rounded-lg">
                <img src={photo.url} alt="" className="aspect-video w-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon-sm"
                  className="absolute end-2 top-2"
                  onClick={() => deletePhoto.mutate(photo.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              savePhoto.mutate({ url: photoUrl }, { onSuccess: () => setPhotoUrl('') });
            }}
          >
            <Input placeholder="Photo URL" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="flex-1" required />
            <Button type="submit" disabled={savePhoto.isPending}>Add Photo</Button>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete vehicle?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleteCar.isPending}
      />
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div>
      <p className="text-text-muted">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
