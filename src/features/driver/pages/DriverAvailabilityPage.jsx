import { useDriverDashboard, useUpdateDriverAvailability } from '@/api/hooks/useDriver';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, PageHeader } from '@/shared/components';

export default function DriverAvailabilityPage() {
  const { data, isLoading, isError } = useDriverDashboard();
  const updateAvailability = useUpdateDriverAvailability();

  if (isLoading) return <Skeleton className="h-48 rounded-xl" />;
  if (isError || !data) return <Alert variant="danger" title="Failed to load availability" />;

  const isAvailable = data.kpis.status === 'AVAILABLE';

  const toggle = () => {
    updateAvailability.mutate(isAvailable ? 'OFF' : 'AVAILABLE');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Availability"
        description="Toggle your duty status. When off duty, you won't receive new trip assignments."
        eyebrow="Driver Portal"
      />
      <Card>
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <p className="text-lg font-semibold">
              You are currently <span className="text-primary">{isAvailable ? 'Available' : 'Off Duty'}</span>
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {isAvailable
                ? 'You can receive new trip assignments. Switch off when you are not working.'
                : 'You are not receiving new assignments. Switch on when ready to work.'}
            </p>
          </div>
          <Button
            size="lg"
            variant={isAvailable ? 'outline' : 'default'}
            onClick={toggle}
            disabled={updateAvailability.isPending}
          >
            {updateAvailability.isPending
              ? 'Updating...'
              : isAvailable
                ? 'Go Off Duty'
                : 'Go Available'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
