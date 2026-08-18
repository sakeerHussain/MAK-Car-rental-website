import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  info: {
    icon: Info,
    classes: 'border-primary/20 bg-primary-pale text-primary-deep',
    iconClasses: 'text-primary',
  },
  success: {
    icon: CheckCircle2,
    classes: 'border-success/20 bg-green-50 text-green-900',
    iconClasses: 'text-success',
  },
  warning: {
    icon: AlertCircle,
    classes: 'border-warning/20 bg-amber-50 text-amber-900',
    iconClasses: 'text-warning',
  },
  danger: {
    icon: AlertCircle,
    classes: 'border-danger/20 bg-red-50 text-red-900',
    iconClasses: 'text-danger',
  },
};

export function Alert({ variant = 'info', title, children, onClose, className }) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-xl border p-4', config.classes, className)}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', config.iconClasses)} />
      <div className="flex-1 space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="text-sm opacity-90">{children}</div> : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Dismiss alert"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
