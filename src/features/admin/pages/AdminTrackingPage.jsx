import { useState } from 'react';
import { useTrackingData } from '@/api/hooks/admin/useAdminDashboard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, PageHeader } from '@/shared/components';
import { LiveTrackingMap } from '@/features/admin/components/LiveTrackingMap';

export default function AdminTrackingPage() {
  const [intervalSec, setIntervalSec] = useState(10);
  const { data: markers = [], isLoading, isError, dataUpdatedAt } = useTrackingData(intervalSec * 1000);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Fleet Tracking"
        description="Real-time vehicle positions across the UAE. Map auto-refreshes without reloading the page."
        eyebrow="Fleet"
      />

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="refresh-interval">Refresh interval (seconds)</Label>
          <Input
            id="refresh-interval"
            type="number"
            min={5}
            max={120}
            value={intervalSec}
            onChange={(e) => setIntervalSec(Number(e.target.value) || 10)}
            className="w-32"
          />
        </div>
        {dataUpdatedAt ? (
          <p className="text-sm text-text-muted">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <Skeleton className="h-[600px] w-full rounded-xl" />
      ) : isError ? (
        <Alert variant="danger" title="Failed to load tracking data" />
      ) : (
        <>
          <LiveTrackingMap markers={markers} cluster={markers.length > 10} />
          <p className="text-sm text-text-secondary">
            Showing {markers.length} active vehicle{markers.length !== 1 ? 's' : ''} on map
          </p>
        </>
      )}
    </div>
  );
}
