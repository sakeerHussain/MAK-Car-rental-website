import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EMPLOYEE_STATUSES } from '@/shared/models/enums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  department: z.string().min(1, 'Required'),
  designation: z.string().min(1, 'Required'),
  status: z.enum(EMPLOYEE_STATUSES),
  joinDate: z.string().min(1, 'Required'),
});

export function AdminEmployeeForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'ACTIVE', joinDate: new Date().toISOString().slice(0, 10), ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Full name" error={errors.name?.message}><Input {...register('name')} /></Field>
        <Field label="Phone" error={errors.phone?.message}><Input {...register('phone')} /></Field>
        <Field label="Email" error={errors.email?.message}><Input type="email" {...register('email')} /></Field>
        <Field label="Department" error={errors.department?.message}><Input {...register('department')} /></Field>
        <Field label="Designation" error={errors.designation?.message}><Input {...register('designation')} /></Field>
        <Field label="Join date" error={errors.joinDate?.message}><Input type="date" {...register('joinDate')} /></Field>
        <Field label="Status">
          <Select {...register('status')}>
            {EMPLOYEE_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </Select>
        </Field>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Employee'}</Button>
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
