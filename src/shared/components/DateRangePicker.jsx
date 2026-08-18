import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = 'Pickup date',
  endLabel = 'Return date',
  className,
}) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      <div className="space-y-1.5">
        <Label htmlFor="start-date">{startLabel}</Label>
        <Input
          id="start-date"
          type="datetime-local"
          value={startDate || ''}
          onChange={(e) => onStartDateChange?.(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="end-date">{endLabel}</Label>
        <Input
          id="end-date"
          type="datetime-local"
          value={endDate || ''}
          min={startDate || undefined}
          onChange={(e) => onEndDateChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
