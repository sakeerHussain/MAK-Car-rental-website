import { Link, useParams } from 'react-router-dom';
import { useAdminCorporateTrip } from '@/api/hooks/admin/useAdminCorporateTrips';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Alert,
  Breadcrumbs,
  CurrencyDisplay,
  PageHeader,
  StatusBadge,
} from '@/shared/components';
import { formatDate } from '@/shared/utils/rental';

export default function AdminCorporateInvoicePage() {
  const { id } = useParams();
  const { data: trip, isLoading, isError } = useAdminCorporateTrip(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (isError || !trip) {
    return <Alert variant="danger" title="Trip not found" />;
  }

  if (!trip.serviceAmount) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[
          { label: 'Corporate Trips', to: '/admin/corporate-trips' },
          { label: 'Invoice' },
        ]} />
        <Alert variant="warning" title="Invoice not ready" description="Service amount has not been set for this trip yet." />
        <Button asChild variant="outline">
          <Link to="/admin/corporate-trips">Back to trips</Link>
        </Button>
      </div>
    );
  }

  const taxAmount = (trip.serviceAmount * (trip.taxPercent || 0)) / 100;
  const total = trip.serviceAmount + taxAmount;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Corporate Trips', to: '/admin/corporate-trips' },
          { label: 'Invoice' },
        ]}
      />
      <PageHeader
        title="Corporate Trip Invoice"
        description={`Trip ${trip.id}`}
        eyebrow="MAK International"
        actions={<StatusBadge status={trip.status} type="transport" />}
      />
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Account</p>
              <p className="font-medium">{trip.accountName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Passenger</p>
              <p className="font-medium">{trip.passenger}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Pickup</p>
              <p className="font-medium">{trip.pickup}</p>
              <p className="text-sm text-text-muted">{formatDate(trip.scheduledPickup)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Destination</p>
              <p className="font-medium">{trip.destination}</p>
            </div>
            {trip.poNumber ? (
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">PO Number</p>
                <p className="font-medium">{trip.poNumber}</p>
              </div>
            ) : null}
            {trip.projectCode ? (
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Project Code</p>
                <p className="font-medium">{trip.projectCode}</p>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-border-brand">
            <div className="flex justify-between border-b border-border-brand px-4 py-3 text-sm">
              <span>Service amount</span>
              <CurrencyDisplay amount={trip.serviceAmount} />
            </div>
            <div className="flex justify-between border-b border-border-brand px-4 py-3 text-sm">
              <span>Tax ({trip.taxPercent || 0}%)</span>
              <CurrencyDisplay amount={taxAmount} />
            </div>
            <div className="flex justify-between px-4 py-3 font-semibold">
              <span>Total</span>
              <CurrencyDisplay amount={total} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" asChild>
        <Link to="/admin/corporate-trips">Back to trips</Link>
      </Button>
    </div>
  );
}
