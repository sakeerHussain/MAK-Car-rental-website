import { cn } from '@/lib/utils';

function Select({ className, children, ...props }) {
  return (
    <select
      data-slot="select"
      className={cn(
        'flex h-10 w-full appearance-none rounded-lg border border-border-brand bg-surface px-3 py-2 text-sm text-text-primary shadow-soft transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };
