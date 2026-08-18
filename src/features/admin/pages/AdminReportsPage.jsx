import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import { BOOKING_STATUSES } from '@/shared/models/enums';
import { useAdminCars } from '@/api/hooks/admin/useAdminCars';
import { useAdminDrivers } from '@/api/hooks/admin/useAdminDrivers';
import { useAdminVendors } from '@/api/hooks/admin/useAdminVendors';
import { useDownloadAdminReport } from '@/api/hooks/admin/useAdminReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  FilterField,
  FilterPanel,
  PageHeader,
} from '@/shared/components';

const defaultFilters = {
  startDate: '',
  endDate: '',
  carId: '',
  vendorId: '',
  driverId: '',
  status: '',
  ownership: '',
};

export default function AdminReportsPage() {
  const { data: cars = [] } = useAdminCars();
  const { data: vendors = [] } = useAdminVendors();
  const { data: drivers = [] } = useAdminDrivers();
  const downloadReport = useDownloadAdminReport();
  const [filters, setFilters] = useState(defaultFilters);

  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Export booking and revenue reports with custom filters."
        eyebrow="Insights"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <FilterPanel title="Report Filters" onReset={() => setFilters(defaultFilters)} className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <FilterField label="Start date">
              <Input type="date" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
            </FilterField>
            <FilterField label="End date">
              <Input type="date" value={filters.endDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
            </FilterField>
            <FilterField label="Vehicle">
              <Select value={filters.carId} onChange={(e) => setFilters((f) => ({ ...f, carId: e.target.value }))}>
                <option value="">All vehicles</option>
                {cars.map((c) => <option key={c.id} value={c.id}>{c.make} {c.model}</option>)}
              </Select>
            </FilterField>
            <FilterField label="Vendor">
              <Select value={filters.vendorId} onChange={(e) => setFilters((f) => ({ ...f, vendorId: e.target.value }))}>
                <option value="">All vendors</option>
                {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </Select>
            </FilterField>
            <FilterField label="Driver">
              <Select value={filters.driverId} onChange={(e) => setFilters((f) => ({ ...f, driverId: e.target.value }))}>
                <option value="">All drivers</option>
                {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </FilterField>
            <FilterField label="Booking status">
              <Select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
                <option value="">All statuses</option>
                {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FilterField>
            <FilterField label="Ownership">
              <Select value={filters.ownership} onChange={(e) => setFilters((f) => ({ ...f, ownership: e.target.value }))}>
                <option value="">All</option>
                <option value="OWNED">Owned</option>
                <option value="VENDOR">Vendor</option>
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

        <Card>
          <CardContent className="space-y-3 p-6">
            <h3 className="font-semibold text-text-primary">Specialised Reports</h3>
            <p className="text-sm text-text-secondary">Vendor-wise and driver-wise breakdowns.</p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/reports/vendors">Vendor-wise Report</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/reports/drivers">Driver-wise Report</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
