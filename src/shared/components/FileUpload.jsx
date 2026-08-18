import { useRef, useState } from 'react';
import { FileImage, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FileUpload({
  accept,
  multiple = false,
  onFilesSelected,
  preview = true,
  className,
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFiles = (fileList) => {
    const nextFiles = Array.from(fileList);
    setFiles(nextFiles);
    setProgress(35);
    window.setTimeout(() => setProgress(100), 300);
    onFilesSelected?.(nextFiles);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragOver
            ? 'border-primary bg-primary-light'
            : 'border-border-brand bg-primary-pale hover:border-primary hover:bg-primary-light/60',
        )}
      >
        <Upload className="mb-3 size-8 text-primary" />
        <p className="text-sm font-medium text-text-primary">
          Drag and drop files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-text-muted">PNG, JPG, PDF up to 10MB</p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {progress > 0 && progress < 100 ? (
        <div className="h-2 overflow-hidden rounded-full bg-primary-light">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      {preview && files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.size}`}
              className="flex items-center justify-between rounded-lg border border-border-brand bg-surface px-3 py-2 text-sm"
            >
              <span className="inline-flex items-center gap-2 truncate">
                <FileImage className="size-4 text-primary" />
                {file.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setFiles((current) => current.filter((f) => f !== file))}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
