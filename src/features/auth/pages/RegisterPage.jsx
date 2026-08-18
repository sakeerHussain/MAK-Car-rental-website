import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as registerUser } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, PageHeader } from '@/shared/components';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setError('');
    try {
      await registerUser(values);
      navigate('/my-bookings', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create your account"
        description="Book premium vehicles and track your rentals in one place."
        eyebrow="Customer Portal"
      />
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Join MAK International in under a minute.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error ? <Alert variant="danger" title={error} /> : null}
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" autoComplete="name" {...register('name')} />
                {errors.name ? (
                  <p className="text-xs text-danger" role="alert">{errors.name.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" {...register('email')} />
                {errors.email ? (
                  <p className="text-xs text-danger" role="alert">{errors.email.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
                {errors.password ? (
                  <p className="text-xs text-danger" role="alert">{errors.password.message}</p>
                ) : null}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
              <Button type="button" variant="outline" className="w-full">
                Sign up with Google
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
