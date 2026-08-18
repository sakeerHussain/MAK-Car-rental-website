import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useVendorSettlements, useDownloadVendorSettlementPdf, useDownloadVendorSettlementExcel } from '@/api/hooks/useVendor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, CurrencyDisplay, DataTable, PageHeader } from '@/shared/components';

export default function VendorSettlementsPage() {
  const { data: settlements = [], isLoading, isError } = useVendorSettlements();
  const downloadPdf = useDownloadVendorSettlementPdf();
  const downloadExcel = useDownloadVendorSettlementExcel();

  const statusVariant = (status) => {
    if (status === 'PAID') return 'success';
    if (status === 'FINALISED') return 'info';
    return 'muted';
  };

  const columns = [
    {
      key: 'period',
      label: 'Period',
      render: (row) => `${row.periodStart} → ${row.periodEnd}`,
    },
    {
      key: 'grossAmount',
      label: 'Gross',
      render: (row) => <CurrencyDisplay amount={row.grossAmount} />,
    },
    {
      key: 'commission',
      label: 'Commission',
      render: (row) => <CurrencyDisplay amount={row.commission} />,
    },
    {
      key: 'netPayable',
      label: 'Net Payable',
      render: (row) => <CurrencyDisplay amount={row.netPayable} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/vendor/settlements/${row.id}/pdf`}>PDF</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => downloadPdf.mutate(row.id)}>
            <Download className="size-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => downloadExcel.mutate(row.id)}>
            <Download className="size-3.5" />XLS
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settlements" description="Commission statements and payment status." eyebrow="Vendor Portal" />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load settlements" />
      ) : (
        <DataTable columns={columns} data={settlements} searchPlaceholder="Search settlements..." emptyTitle="No settlements yet" />
      )}
    </div>
  );
}
