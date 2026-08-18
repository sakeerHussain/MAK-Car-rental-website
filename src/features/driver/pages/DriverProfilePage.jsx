import { useDriverProfile } from '@/api/hooks/useDriver';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, CurrencyDisplay, PageHeader } from '@/shared/components';

export default function DriverProfilePage() {
  const { data: profile, isLoading, isError } = useDriverProfile();

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !profile) return <Alert variant="danger" title="Failed to load profile" />;

  return (
    <div className="space-y-6">
      <PageHeader title={profile.name} description={`${profile.category} chauffeur`} eyebrow="Driver Portal" />
      <Card>
        <CardContent className="grid gap-4 p-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><p className="text-text-muted">Phone</p><p className="font-medium">{profile.phone}</p></div>
          <div><p className="text-text-muted">Email</p><p className="font-medium">{profile.email}</p></div>
          <div><p className="text-text-muted">Licence</p><p className="font-medium">{profile.licenceNumber}</p></div>
          <div><p className="text-text-muted">Licence expiry</p><p className="font-medium">{profile.licenceExpiry}</p></div>
          <div><p className="text-text-muted">Experience</p><p className="font-medium">{profile.experienceYears} years</p></div>
          <div><p className="text-text-muted">Employment</p><p className="font-medium">{profile.employmentType?.replace('_', ' ')}</p></div>
          <div><p className="text-text-muted">Daily charge</p><CurrencyDisplay amount={profile.dailyCharge} /></div>
          <div><p className="text-text-muted">Total trips</p><p className="font-medium">{profile.totalTrips}</p></div>
          <div><p className="text-text-muted">Joined</p><p className="font-medium">{profile.joinedDate}</p></div>
          <div>
            <p className="text-text-muted">Status</p>
            <Badge variant={profile.status === 'AVAILABLE' ? 'success' : profile.status === 'BUSY' ? 'warning' : 'muted'}>
              {profile.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
