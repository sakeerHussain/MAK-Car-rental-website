import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DownloadButton({ href, label = 'Download', className, ...props }) {
  return (
    <Button variant="outline" className={className} asChild {...props}>
      <a href={href} download target="_blank" rel="noopener noreferrer">
        <Download className="size-4" />
        {label}
      </a>
    </Button>
  );
}

export function PdfViewer({ url, title = 'Document preview', className }) {
  if (!url) {
    return (
      <div
        className={cn(
          'flex h-96 items-center justify-center rounded-xl border border-border-brand bg-primary-pale text-sm text-text-muted',
          className,
        )}
      >
        No document available
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-text-primary">{title}</h3>
        <Button variant="ghost" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" />
            Open in new tab
          </a>
        </Button>
      </div>
      <iframe
        title={title}
        src={url}
        className="h-[70vh] w-full rounded-xl border border-border-brand bg-surface"
      />
    </div>
  );
}
