import { Link } from 'react-router-dom';
import { Car, Building2, Plane, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components';

const SERVICES = [
  {
    icon: Car,
    title: 'Self-Drive Rental',
    description: 'Daily, weekly, and monthly rentals with flexible pickup locations across the UAE.',
    href: '/cars',
  },
  {
    icon: Users,
    title: 'Chauffeur Service',
    description: 'Professional drivers for airport transfers, events, and business travel.',
    href: '/cars?withDriver=true',
  },
  {
    icon: Building2,
    title: 'Corporate Transport',
    description: 'Account-based booking, consolidated billing, and dedicated coordinators for enterprises.',
    href: '/contact',
  },
  {
    icon: Plane,
    title: 'Airport Transfers',
    description: 'Meet-and-greet at DXB, DWC, and AUH with flight monitoring and luggage assistance.',
    href: '/contact',
  },
  {
    icon: Truck,
    title: 'Long-Term Fleet',
    description: 'Monthly and annual contracts for businesses needing dedicated vehicle allocation.',
    href: '/contact',
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-12 pb-16">
      <PageHeader
        title="Our Services"
        description="End-to-end mobility solutions for individuals, corporates, and government entities."
        eyebrow="What we offer"
      />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
        {SERVICES.map(({ icon: Icon, title, description, href }) => (
          <div key={title} className="rounded-2xl border border-border-brand bg-surface p-6 shadow-soft transition-shadow hover:shadow-card">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Icon className="size-6" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
            <Button variant="link" className="mt-4 px-0" asChild>
              <Link to={href}>Learn more</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
