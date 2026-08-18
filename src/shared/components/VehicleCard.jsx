import { Link } from 'react-router-dom';
import { Fuel, Settings2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * @param {{
 *   car: import('@/shared/models/typedefs').Car,
 *   priceLabel?: string,
 *   linkSearch?: string,
 *   className?: string,
 * }} props
 */
export function VehicleCard({ car, priceLabel, linkSearch, className }) {
  const detailUrl = linkSearch ? `/cars/${car.id}?${linkSearch}` : `/cars/${car.id}`;

  return (
    <Card className={cn('group overflow-hidden transition-shadow hover:shadow-card-hover', className)}>
      <Link to={detailUrl} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-primary-pale">
          {car.imageUrl ? (
            <img
              src={car.imageUrl}
              alt={`${car.make} ${car.model}`}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-text-muted">
              No image
            </div>
          )}
        </div>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-text-primary">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-text-secondary">{car.type}</p>
            </div>
            <Badge variant="outline">{car.year}</Badge>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" />
              {car.seats} seats
            </span>
            <span className="inline-flex items-center gap-1">
              <Settings2 className="size-3.5" />
              {car.transmission}
            </span>
            <span className="inline-flex items-center gap-1">
              <Fuel className="size-3.5" />
              {car.fuel}
            </span>
          </div>

          {car.featureTags?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {car.featureTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="muted">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          <p className="tabular-nums text-lg font-bold text-primary">
            {priceLabel || `From AED ${car.dailyRate}/day`}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
