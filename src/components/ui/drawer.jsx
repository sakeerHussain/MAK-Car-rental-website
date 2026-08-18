import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function Drawer({ open, onOpenChange, children, side = 'end' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const sideClasses = {
    end: 'inset-y-0 end-0 w-full max-w-md',
    start: 'inset-y-0 start-0 w-full max-w-md',
    bottom: 'inset-x-0 bottom-0 max-h-[85vh]',
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close drawer overlay"
        className="absolute inset-0 bg-primary-deep/40 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        className={cn(
          'absolute flex flex-col border border-border-brand bg-surface shadow-card-hover',
          sideClasses[side],
        )}
      >
        {children}
      </div>
    </div>
  );
}

function DrawerHeader({ className, title, description, onClose, ...props }) {
  return (
    <div className={cn('flex items-start justify-between border-b border-border-brand p-4', className)} {...props}>
      <div>
        {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
        {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      </div>
      {onClose ? (
        <Button type="button" variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}

function DrawerContent({ className, ...props }) {
  return <div className={cn('flex-1 overflow-y-auto p-4', className)} {...props} />;
}

function DrawerFooter({ className, ...props }) {
  return (
    <div className={cn('border-t border-border-brand p-4', className)} {...props} />
  );
}

export { Drawer, DrawerHeader, DrawerContent, DrawerFooter };
