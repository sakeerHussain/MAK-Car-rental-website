import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterField, FilterPanel } from '@/shared/components';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CAR_TYPES, TRANSMISSIONS, parseCarFilters, filtersToSearchParams } from '@/shared/utils/carFilters';

export function CarFiltersPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseCarFilters(searchParams);

  const updateFilter = useCallback(
    (key, value) => {
      const next = { ...filters, [key]: value };
      setSearchParams(filtersToSearchParams(next), { replace: true });
    },
    [filters, setSearchParams],
  );

  const handleReset = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <FilterPanel title="Filter vehicles" onReset={handleReset}>
      <FilterField label="Pickup date">
        <Input
          type="datetime-local"
          value={filters.pickup}
          onChange={(e) => updateFilter('pickup', e.target.value)}
        />
      </FilterField>
      <FilterField label="Return date">
        <Input
          type="datetime-local"
          value={filters.ret}
          min={filters.pickup || undefined}
          onChange={(e) => updateFilter('ret', e.target.value)}
        />
      </FilterField>
      <FilterField label="Vehicle type">
        <Select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)}>
          <option value="">All types</option>
          {CAR_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
          ))}
        </Select>
      </FilterField>
      <FilterField label="Min seats">
        <Input
          type="number"
          min={1}
          value={filters.minSeats}
          onChange={(e) => updateFilter('minSeats', e.target.value)}
        />
      </FilterField>
      <FilterField label="Transmission">
        <Select
          value={filters.transmission}
          onChange={(e) => updateFilter('transmission', e.target.value)}
        >
          <option value="">Any</option>
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
          ))}
        </Select>
      </FilterField>
      <FilterField label="Max price / day (AED)">
        <Input
          type="number"
          min={0}
          value={filters.maxPrice}
          onChange={(e) => updateFilter('maxPrice', e.target.value)}
        />
      </FilterField>
      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox
          checked={filters.withDriver === 'true'}
          onChange={(e) => updateFilter('withDriver', e.target.checked ? 'true' : 'false')}
        />
        With driver available
      </label>
    </FilterPanel>
  );
}
