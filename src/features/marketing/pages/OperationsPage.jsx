import { Radio, MapPin, FileCheck, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/shared/components';

const OPERATIONS = [
  {
    icon: Radio,
    title: 'Live Fleet Tracking',
    description: 'GPS-enabled vehicles with real-time dispatch visibility and route optimisation.',
  },
  {
    icon: MapPin,
    title: 'Multi-Hub Network',
    description: 'Pickup and drop points across Dubai, Abu Dhabi, Sharjah, and northern emirates.',
  },
  {
    icon: FileCheck,
    title: 'Compliance Management',
    description: 'RC, insurance, permits, and pollution certificates tracked with automated expiry alerts.',
  },
  {
    icon: BarChart3,
    title: 'Reporting & Analytics',
    description: 'Utilisation reports, cost breakdowns, and vendor settlement statements for partners.',
  },
];

export default function OperationsPage() {
  return (
    <div className="space-y-12 pb-16">
      <PageHeader
        title="Operations Overview"
        description="How we run a modern, compliant, and scalable transport operation."
        eyebrow="Behind the wheel"
      />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="leading-relaxed text-text-secondary">
          Our operations centre manages fleet allocation, driver scheduling, maintenance windows,
          and corporate trip coordination. Every vehicle in our network is inspected, insured,
          and tracked — giving clients confidence in reliability and safety.
        </p>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:px-8 sm:px-6">
        {OPERATIONS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex gap-4 rounded-xl border border-border-brand bg-surface p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Icon className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
