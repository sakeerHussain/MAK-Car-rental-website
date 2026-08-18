import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Required'),
  contactPerson: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Required'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export function AdminCorporateAccountForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'ACTIVE', ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company name" error={errors.name?.message}><Input {...register('name')} /></Field>
        <Field label="Contact person" error={errors.contactPerson?.message}><Input {...register('contactPerson')} /></Field>
        <Field label="Email" error={errors.email?.message}><Input type="email" {...register('email')} /></Field>
        <Field label="Phone" error={errors.phone?.message}><Input {...register('phone')} /></Field>
        <Field label="Status">
          <Select {...register('status')}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </Select>
        </Field>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Account'}</Button>
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
