import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CORPORATE_MEMBER_ROLES } from '@/shared/models/enums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const schema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, 'Required'),
  userName: z.string().optional(),
  accountId: z.string().min(1, 'Select account'),
  role: z.enum(CORPORATE_MEMBER_ROLES),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export function AdminCorporateMemberForm({ defaultValues, accounts = [], onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'BOOKER', status: 'ACTIVE', ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="User ID" error={errors.userId?.message}><Input {...register('userId')} placeholder="user-002" /></Field>
        <Field label="User name"><Input {...register('userName')} /></Field>
        <Field label="Corporate account" error={errors.accountId?.message}>
          <Select {...register('accountId')}>
            <option value="">Select account</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </Field>
        <Field label="Role">
          <Select {...register('role')}>
            {CORPORATE_MEMBER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select {...register('status')}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </Select>
        </Field>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Membership'}</Button>
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
