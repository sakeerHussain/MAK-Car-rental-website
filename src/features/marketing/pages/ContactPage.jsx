import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { submitContactForm } from '@/api/marketing.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, PageHeader } from '@/shared/components';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Required'),
  message: z.string().min(10, 'Please provide more detail'),
});

const CONTACT_INFO = [
  { icon: MapPin, label: 'Head Office', value: 'Business Bay, Dubai, UAE' },
  { icon: Phone, label: 'Phone', value: '+971 4 123 4567' },
  { icon: Mail, label: 'Email', value: 'info@mak.ae' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat 8:00 AM – 8:00 PM' },
];

export default function ContactPage() {
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    setSubmitError('');
    setSubmitSuccess('');
    try {
      const result = await submitContactForm(values);
      setSubmitSuccess(result.message || 'Message sent successfully.');
      reset();
    } catch (err) {
      setSubmitError(err.message || 'Failed to send message');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      <PageHeader
        title="Contact Us"
        description="Reach our team for rentals, corporate accounts, or partnership enquiries."
        eyebrow="Get in touch"
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-3 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3 rounded-xl border border-border-brand bg-surface p-4">
              <Icon className="size-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {submitSuccess ? <Alert variant="success" title={submitSuccess} className="mb-4" /> : null}
            {submitError ? <Alert variant="danger" title={submitError} className="mb-4" /> : null}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name ? <p className="text-xs text-danger">{errors.name.message}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email ? <p className="text-xs text-danger">{errors.email.message}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register('phone')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register('subject')} />
                  {errors.subject ? <p className="text-xs text-danger">{errors.subject.message}</p> : null}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  rows={5}
                  className="flex w-full rounded-lg border border-border-brand bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  {...register('message')}
                />
                {errors.message ? <p className="text-xs text-danger">{errors.message.message}</p> : null}
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
