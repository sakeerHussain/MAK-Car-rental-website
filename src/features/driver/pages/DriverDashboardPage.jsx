import { Link } from 'react-router-dom';
import { CalendarCheck, DollarSign, MapPin } from 'lucide-react';
import { useDriverDashboard } from '@/api/hooks/useDriver';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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

export default function DriverDashboardPage() {
  const { data, isLoading, isError } = useDriverDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !data) return <Alert variant="danger" title="Failed to load dashboard" />;

  const { kpis, upcomingTrips, recentTrips } = data;

  const columns = [
    { key: 'carName', label: 'Vehicle' },
    { key: 'customerName', label: 'Customer' },
    { key: 'pickupDate', label: 'Date', render: (row) => formatDate(row.pickupDate) },
    { key: 'pickup', label: 'From' },
    { key: 'destination', label: 'To' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} type="transport" />,
    },
    {
      key: 'earnings',
      label: 'Earnings',
      render: (row) => row.earnings ? <CurrencyDisplay amount={row.earnings} /> : '—',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Dashboard"
        description="Your upcoming assignments and recent trip history."
        eyebrow="Driver Portal"
        actions={
          <Badge variant={kpis.status === 'AVAILABLE' ? 'success' : 'muted'} className="text-sm">
            {kpis.status === 'AVAILABLE' ? 'On Duty' : 'Off Duty'}
          </Badge>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Upcoming" value={kpis.upcomingTrips} icon={<CalendarCheck className="size-5" />} />
        <KpiCard title="Completed" value={kpis.completedTrips} icon={<MapPin className="size-5" />} />
        <KpiCard title="Total Earnings" value={<CurrencyDisplay amount={kpis.totalEarnings} />} icon={<DollarSign className="size-5" />} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Trips</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/driver/trips">View all</Link></Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={upcomingTrips} searchable={false} pageSize={5} emptyTitle="No upcoming trips" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Trips</CardTitle></CardHeader>
          <CardContent>
            <DataTable columns={columns} data={recentTrips} searchable={false} pageSize={5} emptyTitle="No completed trips yet" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
