import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { INSPECTION_RESULTS } from '@/shared/models/enums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const schema = z.object({
  id: z.string().optional(),
  carId: z.string().min(1, 'Select a vehicle'),
  inspectorName: z.string().min(1, 'Required'),
  inspectionDate: z.string().min(1, 'Required'),
  result: z.enum(INSPECTION_RESULTS),
  notes: z.string().optional(),
});

export function AdminInspectionForm({ defaultValues, cars = [], onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { result: 'PASS', inspectionDate: new Date().toISOString().slice(0, 10), ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vehicle" error={errors.carId?.message}>
          <Select {...register('carId')}>
            <option value="">Select vehicle</option>
            {cars.map((c) => <option key={c.id} value={c.id}>{c.make} {c.model} ({c.registration})</option>)}
          </Select>
        </Field>
        <Field label="Inspector" error={errors.inspectorName?.message}><Input {...register('inspectorName')} /></Field>
        <Field label="Inspection date" error={errors.inspectionDate?.message}><Input type="date" {...register('inspectionDate')} /></Field>
        <Field label="Result">
          <Select {...register('result')}>
            {INSPECTION_RESULTS.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
        <Field label="Notes" className="sm:col-span-2"><Input {...register('notes')} /></Field>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Inspection'}</Button>
    </form>
  );
}

function Field({ label, error, children, className }) {
  return (
    <div className={`space-y-1.5 ${className || ''}`}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
