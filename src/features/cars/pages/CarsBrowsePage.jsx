import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useCars } from '@/api/hooks/useCars';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Alert,
  EmptyState,
  PageHeader,
  VehicleCard,
} from '@/shared/components';
import { CarFiltersPanel } from '@/features/cars/components/CarFiltersPanel';
import { useCarFiltersFromUrl } from '@/features/cars/hooks/useCarFiltersFromUrl';
import { filtersToApiParams } from '@/shared/utils/carFilters';
import { estimateCarPrice, getRentalDays } from '@/shared/utils/rental';

export default function CarsBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useCarFiltersFromUrl();
  const linkSearch = searchParams.toString();
  const apiParams = filtersToApiParams(filters);
  const { data, isLoading, isError } = useCars(apiParams);

  const days = getRentalDays(filters.pickup, filters.ret);
  const hasDates = Boolean(filters.pickup && filters.ret);

  const getPriceLabel = (car) => {
    if (hasDates && days > 0) {
      const total = estimateCarPrice(car, days, 'DAY');
      return `AED ${total} total (${days} days)`;
    }
    return `From AED ${car.dailyRate}/day`;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Browse our fleet"
        description="Find the perfect vehicle for your trip. Filters are saved in the URL so you can share or bookmark your search."
        eyebrow="Car Rental"
      />

      {filters.withDriver === 'true' ? (
        <Alert variant="info" title="Chauffeur service">
          Showing vehicles eligible for with-driver bookings. A professional chauffeur can be
          selected during checkout.
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <CarFiltersPanel />

        <div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <Alert variant="danger" title="Failed to load vehicles">
              Please refresh the page or try again later.
            </Alert>
          ) : data?.cars?.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="No vehicles match your filters"
              description="Try adjusting your dates, vehicle type, or price range."
              action={
                <Button variant="outline" onClick={() => setSearchParams({}, { replace: true })}>
                  Reset filters
                </Button>
              }
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-text-secondary">
                {data.total} vehicle{data.total !== 1 ? 's' : ''} available
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.cars.map((car) => (
                  <VehicleCard
                    key={car.id}
                    car={car}
                    priceLabel={getPriceLabel(car)}
                    linkSearch={linkSearch}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
