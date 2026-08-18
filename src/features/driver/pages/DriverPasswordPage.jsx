import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useChangeDriverPassword } from '@/api/hooks/useDriver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, PageHeader } from '@/shared/components';

const schema = z.object({
  currentPassword: z.string().min(6, 'Required'),
  newPassword: z.string().min(6, 'At least 6 characters'),
  confirmPassword: z.string().min(6, 'Required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function DriverPasswordPage() {
  const changePassword = useChangeDriverPassword();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    setSuccess(false);
    await changePassword.mutateAsync({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    setSuccess(true);
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Change Password" description="Update your driver portal login credentials." eyebrow="Driver Portal" />
      <Card className="max-w-md">
        <CardContent className="p-6">
          {success ? <Alert variant="success" title="Password updated successfully" className="mb-4" /> : null}
          {changePassword.isError ? (
            <Alert variant="danger" title={changePassword.error?.message || 'Failed to update password'} className="mb-4" />
          ) : null}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input id="currentPassword" type="password" {...register('currentPassword')} />
              {errors.currentPassword ? <p className="text-xs text-danger">{errors.currentPassword.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" type="password" {...register('newPassword')} />
              {errors.newPassword ? <p className="text-xs text-danger">{errors.newPassword.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
              {errors.confirmPassword ? <p className="text-xs text-danger">{errors.confirmPassword.message}</p> : null}
            </div>
            <Button type="submit" disabled={isSubmitting || changePassword.isPending}>
              {changePassword.isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
