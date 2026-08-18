import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '@/api/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, Breadcrumbs } from '@/shared/components';

export default function BookingInvoicePdfPage() {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = null;

    async function loadPdf() {
      try {
        const response = await apiClient.get(`/api/bookings/${id}/invoice/pdf`, {
          responseType: 'blob',
        });
        objectUrl = URL.createObjectURL(response.data);
        setPdfUrl(objectUrl);
      } catch (err) {
        setError(err.message || 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    }

    loadPdf();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[70vh] w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Alert variant="danger" title={error} />
        <Button className="mt-4" asChild>
          <Link to={`/my-bookings/${id}/invoice`}>Back to invoice</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: 'My Bookings', to: '/my-bookings' },
          { label: 'Invoice', to: `/my-bookings/${id}/invoice` },
          { label: 'PDF' },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Invoice PDF</h1>
        {pdfUrl ? (
          <Button variant="outline" asChild>
            <a href={pdfUrl} download={`invoice-${id}.pdf`}>
              Download
            </a>
          </Button>
        ) : null}
      </div>

      {pdfUrl ? (
        <iframe
          title="Booking invoice PDF"
          src={pdfUrl}
          className="h-[80vh] w-full rounded-xl border border-border-brand bg-surface"
        />
      ) : null}
    </div>
  );
}
