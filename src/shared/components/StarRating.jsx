import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({
  value = 0,
  max = 5,
  onChange,
  size = 'md',
  className,
}) {
  const sizes = { sm: 'size-4', md: 'size-5', lg: 'size-6' };
  const interactive = typeof onChange === 'function';

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Rating' : `Rating: ${value} out of ${max}`}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= Math.round(value);

        return (
          <button
            key={starValue}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(starValue)}
            className={cn(
              'transition-colors',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
              filled ? 'text-warning' : 'text-border-brand',
            )}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <Star className={cn(sizes[size], filled && 'fill-current')} />
          </button>
        );
      })}
    </div>
  );
}
