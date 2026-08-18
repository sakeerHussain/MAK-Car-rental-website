import { Link } from 'react-router-dom';
import { HardHat, Wrench, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components';

const CAPABILITIES = [
  { icon: HardHat, title: 'Operations Staff', description: 'Fleet coordinators, dispatch operators, and yard supervisors.' },
  { icon: Wrench, title: 'Maintenance Teams', description: 'Certified technicians for preventive and corrective vehicle servicing.' },
  { icon: ShieldCheck, title: 'Safety & Compliance', description: 'Document tracking, inspection schedules, and licence renewals.' },
  { icon: Clock, title: '24/7 Dispatch', description: 'Round-the-clock coordination for corporate and emergency transport.' },
];

export default function ManpowerPage() {
  return (
    <div className="space-y-12 pb-16">
      <PageHeader
        title="Manpower & Operations"
        description="Skilled staffing and operational support for transport and fleet management contracts."
        eyebrow="Beyond rental"
      />
      <section className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
        <p className="leading-relaxed text-text-secondary">
          MAK International supplies trained operations personnel for clients who need dedicated
          fleet management — from dispatch coordinators to maintenance supervisors. Our teams
          integrate with your existing workflows or operate as a fully managed service.
        </p>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        {CAPABILITIES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl border border-border-brand bg-surface p-6">
            <Icon className="mb-3 size-6 text-primary" />
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{description}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button asChild><Link to="/contact">Discuss a staffing contract</Link></Button>
      </div>
    </div>
  );
}
