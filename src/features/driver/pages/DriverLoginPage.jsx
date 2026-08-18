import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/shared/components';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function DriverLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'driver@mak.ae', password: 'driver123' },
  });

  const onSubmit = async (values) => {
    setError('');
    try {
      const { user } = await login(values);
      if (user.role !== 'DRIVER') {
        setError('This account does not have driver portal access.');
        return;
      }
      navigate('/driver', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-deep px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>MAK Driver Portal</CardTitle>
          <CardDescription>Sign in with driver@mak.ae (demo mode)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error ? <Alert variant="danger" title={error} /> : null}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email ? <p className="text-xs text-danger">{errors.email.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password ? <p className="text-xs text-danger">{errors.password.message}</p> : null}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-secondary">
            <Link to="/" className="text-primary hover:underline">Back to website</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
