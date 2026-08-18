import { cn } from '@/lib/utils';

function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        'size-4 rounded border-border-brand text-primary accent-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20',
        className,
      )}
      {...props}
    />
  );
}

export { Checkbox };
