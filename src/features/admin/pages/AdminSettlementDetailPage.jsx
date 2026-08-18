import { Link, useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { SETTLEMENT_STATUSES } from '@/shared/models/enums';
import {
  useAdminSettlement,
  useDownloadSettlementExcel,
  useDownloadSettlementPdf,
  useUpdateAdminSettlementStatus,
} from '@/api/hooks/admin/useAdminSettlements';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  Breadcrumbs,
  CurrencyDisplay,
  PageHeader,
} from '@/shared/components';

export default function AdminSettlementDetailPage() {
  const { id } = useParams();
  const { data: settlement, isLoading, isError } = useAdminSettlement(id);
  const updateStatus = useUpdateAdminSettlementStatus();
  const downloadPdf = useDownloadSettlementPdf();
  const downloadExcel = useDownloadSettlementExcel();

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !settlement) return <Alert variant="danger" title="Settlement not found" />;

  const statusVariant = settlement.status === 'PAID' ? 'success' : settlement.status === 'FINALISED' ? 'info' : 'muted';

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Settlements', to: '/admin/settlements' },
          { label: settlement.vendorName },
        ]}
      />
      <PageHeader
        title={`Settlement — ${settlement.vendorName}`}
        description={`${settlement.periodStart} to ${settlement.periodEnd}`}
        eyebrow="Insights"
        actions={
          <div className="flex flex-wrap gap-2">
            <Select
              value={settlement.status}
              onChange={(e) => updateStatus.mutate({ id, status: e.target.value })}
              className="w-36"
            >
              {SETTLEMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Button variant="outline" onClick={() => downloadPdf.mutate(id)} disabled={downloadPdf.isPending}>
              <Download className="size-4" />PDF
            </Button>
            <Button variant="outline" onClick={() => downloadExcel.mutate(id)} disabled={downloadExcel.isPending}>
              <Download className="size-4" />Excel
            </Button>
          </div>
        }
      />
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Status</span>
            <Badge variant={statusVariant}>{settlement.status}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Gross amount</span>
            <CurrencyDisplay amount={settlement.grossAmount} className="font-semibold" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Commission</span>
            <CurrencyDisplay amount={settlement.commission} />
          </div>
          <div className="flex items-center justify-between border-t border-border-brand pt-4">
            <span className="font-semibold">Net payable</span>
            <CurrencyDisplay amount={settlement.netPayable} className="text-lg font-bold" />
          </div>
        </CardContent>
      </Card>
      <Link to="/admin/settlements" className="text-sm text-primary hover:underline">Back to settlements</Link>
    </div>
  );
}
