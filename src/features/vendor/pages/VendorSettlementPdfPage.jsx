import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '@/api/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, Breadcrumbs } from '@/shared/components';

export default function VendorSettlementPdfPage() {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = null;
    async function loadPdf() {
      try {
        const response = await apiClient.get(`/api/vendor/settlements/${id}/pdf`, { responseType: 'blob' });
        objectUrl = URL.createObjectURL(response.data);
        setPdfUrl(objectUrl);
      } catch (err) {
        setError(err.message || 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    }
    loadPdf();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [id]);

  if (loading) return <Skeleton className="h-[80vh] rounded-xl" />;
  if (error) return <Alert variant="danger" title={error} />;

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[
        { label: 'Settlements', to: '/vendor/settlements' },
        { label: `Settlement ${id}` },
      ]} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Settlement PDF</h1>
        {pdfUrl ? (
          <Button variant="outline" asChild>
            <a href={pdfUrl} download={`settlement-${id}.pdf`}>Download</a>
          </Button>
        ) : null}
      </div>
      {pdfUrl ? (
        <iframe title="Settlement PDF" src={pdfUrl} className="h-[80vh] w-full rounded-xl border border-border-brand bg-surface" />
      ) : null}
      <Link to="/vendor/settlements" className="text-sm text-primary hover:underline">Back to settlements</Link>
    </div>
  );
}
