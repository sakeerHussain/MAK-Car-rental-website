import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BILLING_ARRANGEMENTS, TRANSPORT_STATUSES } from '@/shared/models/enums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const schema = z.object({
  id: z.string().optional(),
  accountId: z.string().min(1, 'Select account'),
  bookedBy: z.string().min(1, 'Required'),
  bookerPhone: z.string().min(1, 'Required'),
  bookerEmail: z.string().email('Invalid email'),
  passenger: z.string().min(1, 'Required'),
  scheduledPickup: z.string().min(1, 'Required'),
  expectedCompletion: z.string().min(1, 'Required'),
  carId: z.string().optional(),
  driverId: z.string().optional(),
  status: z.enum(TRANSPORT_STATUSES).optional(),
  pickup: z.string().min(1, 'Required'),
  destination: z.string().min(1, 'Required'),
  stopsText: z.string().optional(),
  waitingTime: z.coerce.number().min(0).optional(),
  billingArrangement: z.enum(BILLING_ARRANGEMENTS),
  projectCode: z.string().optional(),
  projectManager: z.string().optional(),
  coordinator: z.string().optional(),
  remarks: z.string().optional(),
  serviceAmount: z.coerce.number().min(0).optional(),
  taxPercent: z.coerce.number().min(0).max(100).optional(),
  poNumber: z.string().optional(),
  externalReference: z.string().optional(),
});

export function AdminCorporateTripForm({
  defaultValues,
  accounts = [],
  cars = [],
  drivers = [],
  onSubmit,
  loading,
}) {
  const stopsDefault = defaultValues?.stops?.join(', ') || '';
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      billingArrangement: 'NOT_SET',
      status: 'REQUESTED',
      stopsText: stopsDefault,
      ...defaultValues,
    },
  });

  const submit = (values) => {
    const stops = values.stopsText
      ? values.stopsText.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const { stopsText, ...rest } = values;
    onSubmit({ ...rest, stops });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Corporate account" error={errors.accountId?.message}>
          <Select {...register('accountId')}>
            <option value="">Select account</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </Field>
        <Field label="Booked by" error={errors.bookedBy?.message}><Input {...register('bookedBy')} /></Field>
        <Field label="Booker phone" error={errors.bookerPhone?.message}><Input {...register('bookerPhone')} /></Field>
        <Field label="Booker email" error={errors.bookerEmail?.message}><Input type="email" {...register('bookerEmail')} /></Field>
        <Field label="Passenger" error={errors.passenger?.message}><Input {...register('passenger')} /></Field>
        <Field label="Scheduled pickup" error={errors.scheduledPickup?.message}><Input type="datetime-local" {...register('scheduledPickup')} /></Field>
        <Field label="Expected completion" error={errors.expectedCompletion?.message}><Input type="datetime-local" {...register('expectedCompletion')} /></Field>
        <Field label="Vehicle">
          <Select {...register('carId')}>
            <option value="">Unassigned</option>
            {cars.map((c) => <option key={c.id} value={c.id}>{c.make} {c.model}</option>)}
          </Select>
        </Field>
        <Field label="Driver">
          <Select {...register('driverId')}>
            <option value="">Unassigned</option>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </Field>
        <Field label="Pickup" error={errors.pickup?.message}><Input {...register('pickup')} /></Field>
        <Field label="Destination" error={errors.destination?.message}><Input {...register('destination')} /></Field>
        <Field label="Stops (comma-separated)"><Input {...register('stopsText')} placeholder="Stop 1, Stop 2" /></Field>
        <Field label="Waiting time (min)"><Input type="number" {...register('waitingTime')} /></Field>
        <Field label="Billing arrangement">
          <Select {...register('billingArrangement')}>
            {BILLING_ARRANGEMENTS.map((b) => <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>)}
          </Select>
        </Field>
        <Field label="Project code"><Input {...register('projectCode')} /></Field>
        <Field label="Project manager"><Input {...register('projectManager')} /></Field>
        <Field label="Coordinator"><Input {...register('coordinator')} /></Field>
        <Field label="Service amount"><Input type="number" {...register('serviceAmount')} /></Field>
        <Field label="Tax %"><Input type="number" {...register('taxPercent')} /></Field>
        <Field label="PO number"><Input {...register('poNumber')} /></Field>
        <Field label="External reference"><Input {...register('externalReference')} /></Field>
        <Field label="Remarks" className="sm:col-span-2 lg:col-span-3"><Input {...register('remarks')} /></Field>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Trip'}</Button>
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
