import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function SearchBar({
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
  defaultValue = '',
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onChange?.(value);
    }, debounceMs);
    return () => window.clearTimeout(timer);
  }, [value, debounceMs, onChange]);

  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pe-9 ps-9"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
