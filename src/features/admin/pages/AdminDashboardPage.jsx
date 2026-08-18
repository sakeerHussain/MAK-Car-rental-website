import { Link } from 'react-router-dom';
import {
  Car,
  Users,
  Building2,
  UserCheck,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useAdminDashboard } from '@/api/hooks/admin/useAdminDashboard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Alert,
  ChartCard,
  CurrencyDisplay,
  DataTable,
  KpiCard,
  PageHeader,
  StatusBadge,
} from '@/shared/components';
import { formatDate } from '@/shared/utils/rental';

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <Alert variant="danger" title="Failed to load dashboard data" />;
  }

  const { kpis, revenueTrend, bookingsByStatus, revenueSplit, expiringDocuments, recentBookings } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Dashboard"
        description="Fleet performance, bookings, and revenue at a glance."
        eyebrow="Admin"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Cars" value={kpis.totalCars} icon={<Car className="size-5" />} />
        <KpiCard title="Total Drivers" value={kpis.totalDrivers} icon={<Users className="size-5" />} />
        <KpiCard title="Total Bookings" value={kpis.totalBookings} icon={<CalendarCheck className="size-5" />} />
        <KpiCard
          title="Total Revenue"
          value={<CurrencyDisplay amount={kpis.totalRevenue} />}
          icon={<DollarSign className="size-5" />}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Vendors" value={kpis.totalVendors} icon={<Building2 className="size-5" />} />
        <KpiCard title="Customers" value={kpis.totalCustomers} icon={<UserCheck className="size-5" />} />
        <KpiCard title="Confirmed" value={kpis.confirmedBookings} subtitle="Active bookings" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Revenue Trend"
          type="line"
          data={revenueTrend}
          dataKey="revenue"
          nameKey="month"
        />
        <ChartCard
          title="Bookings by Status"
          type="doughnut"
          data={bookingsByStatus}
          dataKey="value"
          nameKey="name"
        />
      </div>

      <ChartCard
        title="Owned vs Vendor Revenue"
        type="doughnut"
        data={revenueSplit}
        dataKey="value"
        nameKey="name"
        className="max-w-xl"
      />

      {expiringDocuments?.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="size-5" />
              Documents Expiring Within 30 Days
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expiringDocuments.map((doc, i) => (
              <div
                key={`${doc.entityName}-${doc.documentType}-${i}`}
                className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-sm"
              >
                <span>
                  <strong>{doc.entityName}</strong> — {doc.documentType}
                </span>
                <span className="text-text-muted">{doc.expiryDate}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/bookings">View all</Link>
          </Button>
        </div>
        <DataTable
          columns={[
            { key: 'carName', label: 'Vehicle', sortable: true },
            { key: 'customerName', label: 'Customer' },
            {
              key: 'pickupDate',
              label: 'Pickup',
              render: (row) => formatDate(row.pickupDate),
            },
            {
              key: 'total',
              label: 'Total',
              render: (row) => <CurrencyDisplay amount={row.total} />,
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => <StatusBadge status={row.status} />,
            },
          ]}
          data={recentBookings}
          searchable={false}
          pageSize={6}
        />
      </div>
    </div>
  );
}
