import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-light text-primary-deep',
        success: 'border-transparent bg-green-50 text-success',
        warning: 'border-transparent bg-amber-50 text-warning',
        danger: 'border-transparent bg-red-50 text-danger',
        info: 'border-transparent bg-primary-light text-primary-mid',
        outline: 'border-border-brand text-text-secondary',
        muted: 'border-transparent bg-muted text-text-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
