import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CAR_TYPES,
  CAR_STATUSES,
  CAR_OWNERSHIPS,
  TRANSMISSIONS,
  FUEL_TYPES,
} from '@/shared/models/enums';

const schema = z.object({
  id: z.string().optional(),
  make: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  registration: z.string().min(1, 'Required'),
  year: z.coerce.number().min(1990).max(2030),
  colour: z.string().min(1, 'Required'),
  type: z.enum(CAR_TYPES),
  seats: z.coerce.number().min(1),
  transmission: z.enum(TRANSMISSIONS),
  fuel: z.enum(FUEL_TYPES),
  hourlyRate: z.coerce.number().min(0),
  dailyRate: z.coerce.number().min(0),
  monthlyRate: z.coerce.number().min(0),
  ownership: z.enum(CAR_OWNERSHIPS),
  vendorId: z.string().optional(),
  commissionOverride: z.coerce.number().optional(),
  status: z.enum(CAR_STATUSES),
  available: z.boolean(),
  showOnSite: z.boolean(),
  featureTags: z.string().optional(),
  imageUrl: z.string().optional(),
});

/**
 * @param {{ defaultValues?: object, vendors?: { id: string, name: string }[], onSubmit: Function, loading?: boolean }} props
 */
export function AdminCarForm({ defaultValues, vendors = [], onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ownership: 'OWNED',
      status: 'ACTIVE',
      available: true,
      showOnSite: true,
      transmission: 'AUTOMATIC',
      fuel: 'PETROL',
      type: 'SEDAN',
      ...defaultValues,
      featureTags: defaultValues?.featureTags?.join(', ') || '',
    },
  });

  const ownership = watch('ownership');

  const submit = (values) => {
    onSubmit({
      ...values,
      featureTags: values.featureTags
        ? values.featureTags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Make" error={errors.make?.message}>
          <Input {...register('make')} />
        </Field>
        <Field label="Model" error={errors.model?.message}>
          <Input {...register('model')} />
        </Field>
        <Field label="Registration" error={errors.registration?.message}>
          <Input {...register('registration')} />
        </Field>
        <Field label="Year" error={errors.year?.message}>
          <Input type="number" {...register('year')} />
        </Field>
        <Field label="Colour" error={errors.colour?.message}>
          <Input {...register('colour')} />
        </Field>
        <Field label="Type">
          <Select {...register('type')}>
            {CAR_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Seats">
          <Input type="number" {...register('seats')} />
        </Field>
        <Field label="Transmission">
          <Select {...register('transmission')}>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Fuel">
          <Select {...register('fuel')}>
            {FUEL_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Hourly rate (AED)">
          <Input type="number" step="0.01" {...register('hourlyRate')} />
        </Field>
        <Field label="Daily rate (AED)">
          <Input type="number" step="0.01" {...register('dailyRate')} />
        </Field>
        <Field label="Monthly rate (AED)">
          <Input type="number" step="0.01" {...register('monthlyRate')} />
        </Field>
        <Field label="Ownership">
          <Select {...register('ownership')}>
            {CAR_OWNERSHIPS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>
        {ownership === 'VENDOR' ? (
          <Field label="Vendor">
            <Select {...register('vendorId')}>
              <option value="">Select vendor</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </Select>
          </Field>
        ) : null}
        <Field label="Commission override (%)">
          <Input type="number" step="0.1" {...register('commissionOverride')} />
        </Field>
        <Field label="Status">
          <Select {...register('status')}>
            {CAR_STATUSES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Image URL" className="sm:col-span-2">
          <Input {...register('imageUrl')} placeholder="https://..." />
        </Field>
        <Field label="Feature tags (comma-separated)" className="sm:col-span-2 lg:col-span-3">
          <Input {...register('featureTags')} placeholder="Bluetooth, GPS, Leather" />
        </Field>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <Checkbox {...register('available')} />
          Available for booking
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <Checkbox {...register('showOnSite')} />
          Show on website
        </label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Vehicle'}
      </Button>
    </form>
  );
}

function Field({ label, error, children, className }) {
  return (
    <div className={`space-y-1.5 ${className || ''}`}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-danger" role="alert">{error}</p> : null}
    </div>
  );
}
