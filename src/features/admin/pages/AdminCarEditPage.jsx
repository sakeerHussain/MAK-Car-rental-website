import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAdminCar, useSaveAdminCar } from '@/api/hooks/admin/useAdminCars';
import { useAdminVendors } from '@/api/hooks/admin/useAdminVendors';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, Breadcrumbs, PageHeader } from '@/shared/components';
import { AdminCarForm } from '@/features/admin/components/AdminCarForm';

export default function AdminCarEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: car, isLoading, isError } = useAdminCar(id);
  const { data: vendors = [] } = useAdminVendors();
  const saveCar = useSaveAdminCar();

  const handleSubmit = async (values) => {
    await saveCar.mutateAsync({ ...values, id });
    navigate(`/admin/cars/${id}`);
  };

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (isError || !car) return <Alert variant="danger" title="Car not found" />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Cars', to: '/admin/cars' },
          { label: `${car.make} ${car.model}`, to: `/admin/cars/${id}` },
          { label: 'Edit' },
        ]}
      />
      <PageHeader title={`Edit ${car.make} ${car.model}`} eyebrow="Fleet" />
      <Card>
        <CardContent className="p-6">
          <AdminCarForm
            defaultValues={car}
            vendors={vendors}
            onSubmit={handleSubmit}
            loading={saveCar.isPending}
          />
        </CardContent>
      </Card>
      <Link to={`/admin/cars/${id}`} className="text-sm text-primary hover:underline">Cancel</Link>
    </div>
  );
}
