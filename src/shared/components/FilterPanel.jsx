import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function FilterPanel({ title = 'Filters', children, className, onReset }) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-primary hover:text-primary-hover"
          >
            Reset
          </button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function FilterField({ label, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? <label className="text-sm font-medium text-text-primary">{label}</label> : null}
      {children}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-brand bg-primary-pale px-6 py-12 text-center',
        className,
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <Icon className="size-7" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-text-secondary">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
