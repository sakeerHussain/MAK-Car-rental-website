import { PageHeader } from '@/shared/components';

const CLIENTS = [
  { name: 'Emirates National Bank', sector: 'Banking & Finance' },
  { name: 'Gulf Logistics Partners', sector: 'Logistics' },
  { name: 'Dubai Healthcare Group', sector: 'Healthcare' },
  { name: 'Al Futtaim Group', sector: 'Conglomerate' },
  { name: 'ADNOC Services', sector: 'Energy' },
  { name: 'Marriott Hotels UAE', sector: 'Hospitality' },
  { name: 'Deloitte Middle East', sector: 'Professional Services' },
  { name: 'UAE Ministry of Interior', sector: 'Government' },
];

export default function ClientsPage() {
  return (
    <div className="space-y-12 pb-16">
      <PageHeader
        title="Our Clients"
        description="Trusted by leading organisations across banking, healthcare, hospitality, and government."
        eyebrow="Partnerships"
      />
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        {CLIENTS.map((client) => (
          <div
            key={client.name}
            className="flex flex-col items-center justify-center rounded-xl border border-border-brand bg-surface p-8 text-center shadow-soft"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-primary-light text-lg font-bold text-primary">
              {client.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
            </div>
            <h3 className="mt-4 font-semibold">{client.name}</h3>
            <p className="mt-1 text-xs text-text-muted">{client.sector}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
