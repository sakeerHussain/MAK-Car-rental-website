import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '@/api/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, Breadcrumbs, PageHeader, PdfViewer } from '@/shared/components';

export default function DocumentPage() {
  const { slug } = useParams();
  const [meta, setMeta] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = null;

    async function load() {
      try {
        const { data: docMeta } = await apiClient.get(`/api/docs/${slug}`);
        setMeta(docMeta);
        const response = await apiClient.get(`/api/docs/${slug}/pdf`, { responseType: 'blob' });
        objectUrl = URL.createObjectURL(response.data);
        setPdfUrl(objectUrl);
      } catch (err) {
        setError(err.message || 'Document not found');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-[70vh] rounded-xl" />
      </div>
    );
  }

  if (error || !meta) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Alert variant="danger" title={error || 'Document not found'} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Documents', to: '/' }, { label: meta.title }]} />
      <PageHeader title={meta.title} description={meta.description} eyebrow="MAK International" />
      <div className="flex justify-end">
        {pdfUrl ? (
          <Button variant="outline" asChild>
            <a href={pdfUrl} download={`${slug}.pdf`}>Download PDF</a>
          </Button>
        ) : null}
      </div>
      {pdfUrl ? (
        <iframe
          title={meta.title}
          src={pdfUrl}
          className="h-[75vh] w-full rounded-xl border border-border-brand bg-surface"
        />
      ) : (
        <PdfViewer url={null} title={meta.title} />
      )}
    </div>
  );
}
