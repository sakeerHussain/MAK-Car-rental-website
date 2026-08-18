import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

/**
 * @param {{
 *   options: { value: string, label: string }[],
 *   value: string[],
 *   onChange: (value: string[]) => void,
 *   placeholder?: string,
 *   className?: string,
 * }} props
 */
export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select options',
  className,
}) {
  const [open, setOpen] = useState(false);

  const toggleValue = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)
    .join(', ');

  return (
    <div className={cn('relative', className)}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between font-normal"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{selectedLabels || placeholder}</span>
        <ChevronDown className="size-4 opacity-60" />
      </Button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close select menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border-brand bg-surface p-2 shadow-card">
            {options.map((option) => {
              const checked = value.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-primary-pale"
                >
                  <Checkbox checked={checked} onChange={() => toggleValue(option.value)} />
                  <span className="flex-1">{option.label}</span>
                  {checked ? <Check className="size-4 text-primary" /> : null}
                </label>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}

/**
 * @param {{
 *   options: { value: string, label: string }[],
 *   value?: string,
 *   onChange?: (value: string) => void,
 *   placeholder?: string,
 *   className?: string,
 * }} props
 */
export function CategorySelect({
  options,
  value,
  onChange,
  placeholder = 'Select category',
  className,
}) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        'flex h-10 w-full rounded-lg border border-border-brand bg-surface px-3 text-sm text-text-primary shadow-soft focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20',
        className,
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
