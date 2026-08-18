import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCars } from '@/api/hooks/useCars';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { VehicleCard, PageHeader, Alert } from '@/shared/components';

export default function FleetPage() {
  const { data, isLoading, isError } = useCars();

  const models = useMemo(() => {
    const cars = data?.cars || [];
    const seen = new Map();
    cars.forEach((car) => {
      const key = `${car.make}-${car.model}`;
      if (!seen.has(key)) seen.set(key, car);
    });
    return Array.from(seen.values());
  }, [data]);

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Our Fleet"
        description="A curated selection of sedans, SUVs, luxury vehicles, and bikes — deduplicated by model for easy browsing."
        eyebrow="Vehicles"
        actions={
          <Button variant="secondary" asChild>
            <Link to="/cars">Search with dates</Link>
          </Button>
        }
      />
      {isLoading ? (
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : isError ? (
        <div className="px-4"><Alert variant="danger" title="Failed to load fleet" /></div>
      ) : (
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
          {models.map((car) => (
            <VehicleCard
              key={`${car.make}-${car.model}`}
              car={car}
              priceLabel={`From AED ${car.dailyRate}/day`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
