import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { useAdminDrivers } from '@/api/hooks/admin/useAdminDrivers';
import { useDownloadDriverReport } from '@/api/hooks/admin/useAdminReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Breadcrumbs,
  FilterField,
  FilterPanel,
  PageHeader,
} from '@/shared/components';

export default function AdminReportsDriversPage() {
  const { data: drivers = [] } = useAdminDrivers();
  const downloadReport = useDownloadDriverReport();
  const [filters, setFilters] = useState({ startDate: '', endDate: '', driverId: '' });

  const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Driver-wise' },
      ]} />
      <PageHeader
        title="Driver-wise Report"
        description="Trip and earnings breakdown by chauffeur."
        eyebrow="Insights"
      />
      <FilterPanel title="Filters" onReset={() => setFilters({ startDate: '', endDate: '', driverId: '' })}>
        <div className="grid gap-4 sm:grid-cols-3">
          <FilterField label="Start date">
            <Input type="date" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
          </FilterField>
          <FilterField label="End date">
            <Input type="date" value={filters.endDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
          </FilterField>
          <FilterField label="Driver">
            <Select value={filters.driverId} onChange={(e) => setFilters((f) => ({ ...f, driverId: e.target.value }))}>
              <option value="">All drivers</option>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </FilterField>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={() => downloadReport.mutate({ params, format: 'excel' })} disabled={downloadReport.isPending}>
            <Download className="size-4" />Export Excel
          </Button>
          <Button variant="outline" onClick={() => downloadReport.mutate({ params, format: 'pdf' })} disabled={downloadReport.isPending}>
            <FileText className="size-4" />Export PDF
          </Button>
        </div>
      </FilterPanel>
    </div>
  );
}
