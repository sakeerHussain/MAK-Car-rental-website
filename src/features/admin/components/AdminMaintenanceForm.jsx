import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MAINTENANCE_STATUSES } from '@/shared/models/enums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const schema = z.object({
  id: z.string().optional(),
  carId: z.string().min(1, 'Select a vehicle'),
  description: z.string().min(1, 'Required'),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().min(1, 'Required'),
  status: z.enum(MAINTENANCE_STATUSES),
});

export function AdminMaintenanceForm({ defaultValues, cars = [], onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'SCHEDULED', ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vehicle" error={errors.carId?.message}>
          <Select {...register('carId')}>
            <option value="">Select vehicle</option>
            {cars.map((c) => <option key={c.id} value={c.id}>{c.make} {c.model} ({c.registration})</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select {...register('status')}>
            {MAINTENANCE_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </Select>
        </Field>
        <Field label="Start date" error={errors.startDate?.message}><Input type="date" {...register('startDate')} /></Field>
        <Field label="End date" error={errors.endDate?.message}><Input type="date" {...register('endDate')} /></Field>
        <Field label="Description" error={errors.description?.message} className="sm:col-span-2">
          <Input {...register('description')} />
        </Field>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Record'}</Button>
    </form>
  );
}

function Field({ label, error, children, className }) {
  return (
    <div className={`space-y-1.5 ${className || ''}`}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
