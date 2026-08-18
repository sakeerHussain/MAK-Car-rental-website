import { Link, useNavigate } from 'react-router-dom';
import { useAdminVendors } from '@/api/hooks/admin/useAdminVendors';
import { useSaveAdminCar } from '@/api/hooks/admin/useAdminCars';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs, PageHeader } from '@/shared/components';
import { AdminCarForm } from '@/features/admin/components/AdminCarForm';

export default function AdminCarNewPage() {
  const navigate = useNavigate();
  const { data: vendors = [] } = useAdminVendors();
  const saveCar = useSaveAdminCar();

  const handleSubmit = async (values) => {
    const car = await saveCar.mutateAsync(values);
    navigate(`/admin/cars/${car.id}`);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Cars', to: '/admin/cars' }, { label: 'Add Car' }]} />
      <PageHeader title="Add Vehicle" description="Register a new car in the fleet." eyebrow="Fleet" />
      <Card>
        <CardContent className="p-6">
          <AdminCarForm vendors={vendors} onSubmit={handleSubmit} loading={saveCar.isPending} />
        </CardContent>
      </Card>
      <Link to="/admin/cars" className="text-sm text-primary hover:underline">Cancel</Link>
    </div>
  );
}
