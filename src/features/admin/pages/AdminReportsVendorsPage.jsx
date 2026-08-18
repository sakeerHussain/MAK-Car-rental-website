import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { useAdminVendors } from '@/api/hooks/admin/useAdminVendors';
import { useDownloadVendorReport } from '@/api/hooks/admin/useAdminReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Breadcrumbs,
  FilterField,
  FilterPanel,
  PageHeader,
} from '@/shared/components';

export default function AdminReportsVendorsPage() {
  const { data: vendors = [] } = useAdminVendors();
  const downloadReport = useDownloadVendorReport();
  const [filters, setFilters] = useState({ startDate: '', endDate: '', vendorId: '' });

  const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Vendor-wise' },
      ]} />
      <PageHeader
        title="Vendor-wise Report"
        description="Revenue and trip breakdown by vendor partner."
        eyebrow="Insights"
      />
      <FilterPanel title="Filters" onReset={() => setFilters({ startDate: '', endDate: '', vendorId: '' })}>
        <div className="grid gap-4 sm:grid-cols-3">
          <FilterField label="Start date">
            <Input type="date" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
          </FilterField>
          <FilterField label="End date">
            <Input type="date" value={filters.endDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
          </FilterField>
          <FilterField label="Vendor">
            <Select value={filters.vendorId} onChange={(e) => setFilters((f) => ({ ...f, vendorId: e.target.value }))}>
              <option value="">All vendors</option>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
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
