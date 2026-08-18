import { Link, useParams } from 'react-router-dom';
import { useBookingInvoice } from '@/api/hooks/useBookings';
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
import { formatDate, getLocationLabel } from '@/shared/utils/rental';
import { useConfig } from '@/api/hooks/useConfig';

export default function BookingInvoicePage() {
  const { id } = useParams();
  const { data: invoice, isLoading, isError } = useBookingInvoice(id);
  const { data: config } = useConfig();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Alert variant="danger" title="Invoice not found" />
        <Button className="mt-4" asChild>
          <Link to="/my-bookings">Back to bookings</Link>
        </Button>
      </div>
    );
  }

  const { booking } = invoice;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: 'My Bookings', to: '/my-bookings' },
          { label: 'Invoice' },
        ]}
      />

      <PageHeader
        title="Booking Invoice"
        description={`Invoice ${invoice.invoiceNumber}`}
        eyebrow="MAK International"
        actions={
          <Button variant="outline" asChild>
            <Link to={`/my-bookings/${id}/invoice/pdf`}>Download PDF</Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted">Issued</p>
              <p className="font-medium">{formatDate(invoice.issuedAt)}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Vehicle</p>
              <p className="font-medium">{booking.carName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Booking ID</p>
              <p className="font-medium">{booking.id}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Pickup</p>
              <p className="text-sm">{formatDate(booking.pickupDate)}</p>
              <p className="text-sm text-text-secondary">
                {getLocationLabel(booking.pickupLocation, config?.locations || [])}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Return</p>
              <p className="text-sm">{formatDate(booking.returnDate)}</p>
              <p className="text-sm text-text-secondary">
                {getLocationLabel(booking.dropLocation, config?.locations || [])}
              </p>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-brand text-left text-text-muted">
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 text-end font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, index) => (
                <tr key={index} className="border-b border-border-brand">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-end">
                    <CurrencyDisplay amount={item.amount} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-2 border-t border-border-brand pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <CurrencyDisplay amount={invoice.subtotal} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Tax</span>
              <CurrencyDisplay amount={invoice.tax} />
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <CurrencyDisplay amount={invoice.total} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Paid</span>
              <CurrencyDisplay amount={invoice.amountPaid} className="text-success" />
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Balance due</span>
              <CurrencyDisplay
                amount={invoice.balance}
                className={invoice.balance > 0 ? 'text-warning' : 'text-success'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link to="/my-bookings">Back to bookings</Link>
      </Button>
    </div>
  );
}
