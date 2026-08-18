import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  phone: z.string().min(1),
  licenceNumber: z.string().min(1),
  licenceExpiry: z.string().min(1),
  experienceYears: z.coerce.number().min(0),
  category: z.string().min(1),
  employmentType: z.string().min(1),
  vendorId: z.string().optional(),
  hourlyCharge: z.coerce.number().min(0),
  dailyCharge: z.coerce.number().min(0),
  monthlyCharge: z.coerce.number().min(0),
  status: z.string().min(1),
  photoUrl: z.string().optional(),
});

export function AdminDriverForm({ defaultValues, vendors = [], onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'AVAILABLE',
      employmentType: 'FULL_TIME',
      category: 'STANDARD',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Full name" error={errors.name?.message}><Input {...register('name')} /></Field>
        <Field label="Phone" error={errors.phone?.message}><Input {...register('phone')} /></Field>
        <Field label="Licence number"><Input {...register('licenceNumber')} /></Field>
        <Field label="Licence expiry"><Input type="date" {...register('licenceExpiry')} /></Field>
        <Field label="Experience (years)"><Input type="number" {...register('experienceYears')} /></Field>
        <Field label="Category"><Input {...register('category')} /></Field>
        <Field label="Employment type">
          <Select {...register('employmentType')}>
            <option value="FULL_TIME">Full Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="PART_TIME">Part Time</option>
          </Select>
        </Field>
        <Field label="Vendor">
          <Select {...register('vendorId')}>
            <option value="">None (Direct)</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </Select>
        </Field>
        <Field label="Hourly charge"><Input type="number" {...register('hourlyCharge')} /></Field>
        <Field label="Daily charge"><Input type="number" {...register('dailyCharge')} /></Field>
        <Field label="Monthly charge"><Input type="number" {...register('monthlyCharge')} /></Field>
        <Field label="Status">
          <Select {...register('status')}>
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
            <option value="OFF">Off Duty</option>
          </Select>
        </Field>
        <Field label="Photo URL" className="sm:col-span-2"><Input {...register('photoUrl')} /></Field>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Driver'}</Button>
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
