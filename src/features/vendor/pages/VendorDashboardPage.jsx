import { Link } from 'react-router-dom';
import { Car, Users, CalendarCheck, DollarSign } from 'lucide-react';
import { useVendorDashboard } from '@/api/hooks/useVendor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Alert,
  CurrencyDisplay,
  DataTable,
  KpiCard,
  PageHeader,
  StatusBadge,
} from '@/shared/components';
import { formatDate } from '@/shared/utils/rental';

export default function VendorDashboardPage() {
  const { data, isLoading, isError } = useVendorDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !data) return <Alert variant="danger" title="Failed to load dashboard" />;

  const { kpis, upcomingTrips, recentTrips } = data;

  const tripColumns = [
    { key: 'carName', label: 'Vehicle' },
    { key: 'customerName', label: 'Customer' },
    { key: 'pickupDate', label: 'Pickup', render: (row) => formatDate(row.pickupDate) },
    { key: 'total', label: 'Amount', render: (row) => <CurrencyDisplay amount={row.total} /> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Dashboard"
        description="Your fleet performance and trip activity."
        eyebrow="Vendor Portal"
        actions={
          <Button variant="secondary" asChild>
            <Link to="/vendor/trips">View all trips</Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="Fleet Vehicles" value={kpis.totalCars} icon={<Car className="size-5" />} />
        <KpiCard title="Drivers" value={kpis.totalDrivers} icon={<Users className="size-5" />} />
        <KpiCard title="Total Trips" value={kpis.totalTrips} icon={<CalendarCheck className="size-5" />} />
        <KpiCard title="Completed" value={kpis.completedTrips} />
        <KpiCard title="Revenue" value={<CurrencyDisplay amount={kpis.totalRevenue} />} icon={<DollarSign className="size-5" />} />
        <KpiCard title="Pending Settlement" value={<CurrencyDisplay amount={kpis.pendingSettlement} />} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Upcoming Trips</CardTitle></CardHeader>
          <CardContent>
            <DataTable columns={tripColumns} data={upcomingTrips} searchable={false} pageSize={5} emptyTitle="No upcoming trips" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Trips</CardTitle></CardHeader>
          <CardContent>
            <DataTable columns={tripColumns} data={recentTrips} searchable={false} pageSize={5} emptyTitle="No recent trips" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
