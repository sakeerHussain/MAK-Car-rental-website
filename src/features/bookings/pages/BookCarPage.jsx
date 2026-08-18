import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCar } from '@/api/hooks/useCars';
import { useConfig } from '@/api/hooks/useConfig';
import {
  useAvailableDrivers,
  useCreateBooking,
  usePricePreview,
} from '@/api/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Alert,
  Breadcrumbs,
  CurrencyDisplay,
  useToast,
} from '@/shared/components';

const schema = z
  .object({
    pickupDate: z.string().min(1, 'Pickup date is required'),
    returnDate: z.string().min(1, 'Return date is required'),
    rentalUnit: z.enum(['DAY', 'MONTH']),
    pickupLocation: z.string().min(1, 'Pickup location is required'),
    dropLocation: z.string().min(1, 'Drop location is required'),
    withDriver: z.boolean(),
    driverId: z.string().optional(),
  })
  .refine((data) => new Date(data.returnDate) > new Date(data.pickupDate), {
    message: 'Return date must be after pickup date',
    path: ['returnDate'],
  })
  .refine((data) => !data.withDriver || Boolean(data.driverId), {
    message: 'Please select a driver',
    path: ['driverId'],
  });

export default function BookCarPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: car, isLoading: carLoading } = useCar(id);
  const { data: config } = useConfig();
  const createBooking = useCreateBooking();
  const [serverErrors, setServerErrors] = useState({});

  const defaultWithDriver = searchParams.get('withDriver') === 'true';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pickupDate: searchParams.get('pickup') || '',
      returnDate: searchParams.get('ret') || '',
      rentalUnit: 'DAY',
      pickupLocation: searchParams.get('pickupLocation') || '',
      dropLocation: searchParams.get('dropLocation') || '',
      withDriver: defaultWithDriver,
      driverId: '',
    },
  });

  const withDriver = watch('withDriver');
  const pickupDate = watch('pickupDate');
  const returnDate = watch('returnDate');
  const driverId = watch('driverId');
  const rentalUnit = watch('rentalUnit');

  const pricePayload = {
    carId: id,
    pickupDate,
    returnDate,
    rentalUnit,
    withDriver,
    driverId: withDriver ? driverId : undefined,
  };

  const { data: pricing } = usePricePreview(
    pricePayload,
    Boolean(id && pickupDate && returnDate),
  );

  const { data: driversData } = useAvailableDrivers(
    { pickup: pickupDate, return: returnDate },
    withDriver && Boolean(pickupDate && returnDate),
  );

  useEffect(() => {
    if (!withDriver) setValue('driverId', '');
  }, [withDriver, setValue]);

  const onSubmit = async (values) => {
    setServerErrors({});
    try {
      await createBooking.mutateAsync({
        carId: id,
        ...values,
      });
      toast({
        title: 'Booking confirmed!',
        description: 'Your reservation has been submitted successfully.',
        variant: 'success',
      });
      navigate('/my-bookings', { replace: true });
    } catch (err) {
      if (err.fieldErrors) {
        setServerErrors(err.fieldErrors);
      }
      if (err.message && !err.fieldErrors) {
        setServerErrors({ form: [err.message] });
      }
    }
  };

  if (carLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Alert variant="danger" title="Vehicle not found" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: 'Fleet', to: '/cars' },
          { label: `${car.make} ${car.model}`, to: `/cars/${id}` },
          { label: 'Book' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">Complete your booking</h1>
        <p className="text-text-secondary">
          {car.make} {car.model} · {car.type}
        </p>
      </div>

      {serverErrors.form ? (
        <Alert variant="danger" title={serverErrors.form[0]} />
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pickupDate">Pickup date & time</Label>
                <Input id="pickupDate" type="datetime-local" {...register('pickupDate')} />
                {errors.pickupDate ? (
                  <p className="text-xs text-danger" role="alert">{errors.pickupDate.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="returnDate">Return date & time</Label>
                <Input
                  id="returnDate"
                  type="datetime-local"
                  min={pickupDate || undefined}
                  {...register('returnDate')}
                />
                {errors.returnDate ? (
                  <p className="text-xs text-danger" role="alert">{errors.returnDate.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rentalUnit">Rental unit</Label>
              <Select id="rentalUnit" {...register('rentalUnit')}>
                <option value="DAY">Daily</option>
                <option value="MONTH">Monthly</option>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pickupLocation">Pickup location</Label>
                <Select id="pickupLocation" {...register('pickupLocation')}>
                  <option value="">Select location</option>
                  {(config?.locations || []).map((loc) => (
                    <option key={loc.value} value={loc.value}>{loc.label}</option>
                  ))}
                </Select>
                {errors.pickupLocation ? (
                  <p className="text-xs text-danger" role="alert">{errors.pickupLocation.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dropLocation">Drop location</Label>
                <Select id="dropLocation" {...register('dropLocation')}>
                  <option value="">Select location</option>
                  {(config?.locations || []).map((loc) => (
                    <option key={loc.value} value={loc.value}>{loc.label}</option>
                  ))}
                </Select>
                {errors.dropLocation ? (
                  <p className="text-xs text-danger" role="alert">{errors.dropLocation.message}</p>
                ) : null}
              </div>
            </div>

            {car.type !== 'BIKE' ? (
              <label className="inline-flex items-center gap-2 text-sm">
                <Checkbox
                  checked={withDriver}
                  onChange={(e) => setValue('withDriver', e.target.checked)}
                />
                Book with professional chauffeur
              </label>
            ) : null}

            {withDriver ? (
              <div className="space-y-1.5">
                <Label htmlFor="driverId">Select driver</Label>
                <Select id="driverId" {...register('driverId')}>
                  <option value="">Choose a driver</option>
                  {driversData?.drivers?.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} · AED {driver.dailyCharge}/day
                    </option>
                  ))}
                </Select>
                {errors.driverId ? (
                  <p className="text-xs text-danger" role="alert">{errors.driverId.message}</p>
                ) : null}
                {serverErrors.driverId ? (
                  <p className="text-xs text-danger" role="alert">{serverErrors.driverId[0]}</p>
                ) : null}
              </div>
            ) : null}

            {serverErrors.carId ? (
              <Alert variant="danger" title={serverErrors.carId[0]} />
            ) : null}
          </CardContent>
        </Card>

        {pricing ? (
          <Card>
            <CardContent className="space-y-2 p-6">
              <h2 className="font-semibold">Price summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Rental ({pricing.days} days)</span>
                <CurrencyDisplay amount={pricing.base} />
              </div>
              {pricing.driverCharge > 0 ? (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Chauffeur</span>
                  <CurrencyDisplay amount={pricing.driverCharge} />
                </div>
              ) : null}
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">VAT (5%)</span>
                <CurrencyDisplay amount={pricing.tax} />
              </div>
              <div className="flex justify-between border-t border-border-brand pt-2 font-semibold">
                <span>Total</span>
                <CurrencyDisplay amount={pricing.total} />
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting || createBooking.isPending}>
            {isSubmitting || createBooking.isPending ? 'Processing...' : 'Confirm Booking'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={`/cars/${id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
