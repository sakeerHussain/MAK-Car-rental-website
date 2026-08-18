import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * @param {{
 *   title: string,
 *   value: string | number,
 *   subtitle?: string,
 *   icon?: React.ReactNode,
 *   trend?: { value: string, positive?: boolean },
 *   className?: string,
 * }} props
 */
export function KpiCard({ title, value, subtitle, icon, trend, className }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="tabular-nums text-3xl font-bold text-text-primary">{value}</p>
            {subtitle ? <p className="text-xs text-text-muted">{subtitle}</p> : null}
            {trend ? (
              <p
                className={cn(
                  'text-xs font-medium',
                  trend.positive ? 'text-success' : 'text-danger',
                )}
              >
                {trend.value}
              </p>
            ) : null}
          </div>
          {icon ? (
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-light text-primary">
              {icon}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
