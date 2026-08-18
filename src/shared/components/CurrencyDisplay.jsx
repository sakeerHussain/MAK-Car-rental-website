import { cn } from '@/lib/utils';

export function CurrencyDisplay({
  amount,
  currency = 'AED',
  locale = 'en-AE',
  className,
  showDecimals = true,
}) {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount ?? 0);

  return <span className={cn('tabular-nums font-semibold', className)}>{formatted}</span>;
}
