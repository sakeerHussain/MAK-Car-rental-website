import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CAR_TYPES } from '@/shared/models/enums';
import { filtersToSearchParams } from '@/shared/utils/carFilters';
import { toDatetimeLocalValue, getRentalDays } from '@/shared/utils/rental';
import { cn } from '@/lib/utils';

const CATEGORY_CHIPS = CAR_TYPES.filter((t) => t !== 'BIKE');

/**
 * @param {{ locations: { value: string, label: string }[], minDailyRate?: number, className?: string }} props
 */
export function HomeSearchWidget({ locations = [], minDailyRate = 95, className }) {
  const navigate = useNavigate();
  const [vehicleKind, setVehicleKind] = useState('CAR');
  const [type, setType] = useState('');
  const [pickup, setPickup] = useState('');
  const [ret, setRet] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [withDriver, setWithDriver] = useState(false);
  const [promo, setPromo] = useState('');

  const days = useMemo(() => getRentalDays(pickup, ret), [pickup, ret]);
  const estimatedTotal = days > 0 ? days * minDailyRate : null;

  const handleSpotBooking = () => {
    const pickupDate = new Date(Date.now() + 30 * 60 * 1000);
    const returnDate = new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000);
    setPickup(toDatetimeLocalValue(pickupDate));
    setRet(toDatetimeLocalValue(returnDate));
    if (!pickupLocation) setPickupLocation('dubai-marina');
    if (!dropLocation) setDropLocation('dubai-marina');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = filtersToSearchParams({
      pickup,
      ret,
      type,
      minSeats: '',
      transmission: '',
      maxPrice: '',
      withDriver: withDriver ? 'true' : 'false',
      pickupLocation,
      dropLocation,
      promo,
      vehicleKind,
    });
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <Card className={cn('overflow-hidden shadow-card-hover', className)}>
      <CardContent className="p-0">
        <form onSubmit={handleSearch}>
          <div className="flex border-b border-border-brand">
            {[
              { key: 'CAR', label: 'Cars', icon: Car },
              { key: 'BIKE', label: 'Bikes', icon: Bike },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setVehicleKind(key)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                  vehicleKind === key
                    ? 'bg-primary text-white'
                    : 'bg-primary-pale text-text-secondary hover:bg-primary-light',
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_280px] lg:p-6">
            <div className="space-y-4">
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleSpotBooking}>
                <Zap className="size-4 text-warning" />
                Spot Booking — pickup in 30 min
              </Button>

              {vehicleKind === 'CAR' ? (
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setType(type === chip ? '' : chip)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                        type === chip
                          ? 'border-primary bg-primary-light text-primary-deep'
                          : 'border-border-brand bg-surface text-text-secondary hover:border-primary',
                      )}
                    >
                      {chip.charAt(0) + chip.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="home-pickup">Pickup date & time</Label>
                  <Input
                    id="home-pickup"
                    type="datetime-local"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="home-return">Return date & time</Label>
                  <Input
                    id="home-return"
                    type="datetime-local"
                    value={ret}
                    min={pickup || undefined}
                    onChange={(e) => setRet(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="home-pickup-loc">Pickup location</Label>
                  <Select
                    id="home-pickup-loc"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  >
                    <option value="">Select location</option>
                    {locations.map((loc) => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="home-drop-loc">Drop location</Label>
                  <Select
                    id="home-drop-loc"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                  >
                    <option value="">Select location</option>
                    {locations.map((loc) => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={withDriver}
                    onChange={(e) => setWithDriver(e.target.checked)}
                    disabled={vehicleKind === 'BIKE'}
                  />
                  With driver
                </label>
                <div className="flex min-w-[180px] flex-1 items-center gap-2">
                  <Label htmlFor="promo" className="shrink-0">Promo</Label>
                  <Input
                    id="promo"
                    placeholder="Promo code"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-primary-pale p-4 lg:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-mid">
                Trip Summary
              </p>
              <div className="mt-3 space-y-2 text-sm text-text-secondary">
                <p>Duration: {days > 0 ? `${days} day${days > 1 ? 's' : ''}` : 'Select dates'}</p>
                <p>Vehicle: {vehicleKind === 'BIKE' ? 'Motorcycle' : type || 'Any category'}</p>
                {withDriver ? <p>Includes chauffeur</p> : null}
                {promo ? <p>Promo: {promo}</p> : null}
              </div>
              <p className="mt-4 tabular-nums text-2xl font-bold text-primary-deep">
                {estimatedTotal ? `From AED ${estimatedTotal}` : `From AED ${minDailyRate}/day`}
              </p>
              <Button type="submit" className="mt-4 w-full">
                Search Available Vehicles
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
