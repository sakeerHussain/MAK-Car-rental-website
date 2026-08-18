import { Link } from 'react-router-dom';
import { Building2, Award, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components';

const VALUES = [
  { icon: Award, title: 'Excellence', description: 'Premium vehicles maintained to the highest standards across our entire fleet.' },
  { icon: Users, title: 'People First', description: 'Professional chauffeurs and dedicated support for every client interaction.' },
  { icon: Target, title: 'Reliability', description: 'On-time service backed by 15+ years of transport operations in the UAE.' },
  { icon: Building2, title: 'Partnership', description: 'Long-term relationships with corporates, vendors, and individual clients.' },
];

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-16">
      <PageHeader
        title="About MAK International"
        description="A trusted vehicle rental and corporate transport partner serving Dubai, Abu Dhabi, and the wider UAE since 2009."
        eyebrow="Our Story"
      />
      <section className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Who we are</h2>
        <p className="leading-relaxed text-text-secondary">
          MAK International provides self-drive rentals, chauffeur-driven services, and corporate
          transport solutions for businesses across the Emirates. From airport transfers to long-term
          fleet contracts, we combine a modern vehicle portfolio with operational rigour and transparent pricing.
        </p>
        <p className="leading-relaxed text-text-secondary">
          Our fleet spans hatchbacks, sedans, SUVs, luxury vehicles, and bikes — all fully insured
          and maintained in-house. Corporate clients benefit from dedicated account management,
          consolidated billing, and real-time trip coordination.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold">Our values</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-border-brand bg-surface p-6 shadow-soft">
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        {[
          { q: 'What documents do I need to rent?', a: 'A valid UAE driving licence or international permit, Emirates ID or passport, and a credit card for the security deposit.' },
          { q: 'Do you offer airport pickup?', a: 'Yes — DXB, DWC, and AUH airport pickups are available 24/7 with meet-and-greet service.' },
          { q: 'Can businesses set up corporate accounts?', a: 'Absolutely. We offer corporate accounts with role-based access, consolidated invoicing, and dedicated coordinators.' },
        ].map((item) => (
          <div key={item.q} className="rounded-xl border border-border-brand bg-surface p-5">
            <h3 className="font-semibold">{item.q}</h3>
            <p className="mt-2 text-sm text-text-secondary">{item.a}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Button size="lg" asChild>
          <Link to="/contact">Get in touch</Link>
        </Button>
      </section>
    </div>
  );
}
