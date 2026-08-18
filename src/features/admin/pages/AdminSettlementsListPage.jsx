import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAdminVendors } from '@/api/hooks/admin/useAdminVendors';
import {
  useAdminSettlements,
  useGenerateAdminSettlement,
} from '@/api/hooks/admin/useAdminSettlements';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  CurrencyDisplay,
  DataTable,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  PageHeader,
} from '@/shared/components';

export default function AdminSettlementsListPage() {
  const { data: settlements = [], isLoading, isError } = useAdminSettlements();
  const { data: vendors = [] } = useAdminVendors();
  const generateSettlement = useGenerateAdminSettlement();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ vendorId: '', periodStart: '', periodEnd: '' });

  const statusVariant = (status) => {
    if (status === 'PAID') return 'success';
    if (status === 'FINALISED') return 'info';
    return 'muted';
  };

  const columns = [
    { key: 'vendorName', label: 'Vendor', sortable: true },
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
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/admin/settlements/${row.id}`}>View</Link>
        </Button>
      ),
    },
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    await generateSettlement.mutateAsync(form);
    setModalOpen(false);
    setForm({ vendorId: '', periodStart: '', periodEnd: '' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Settlements"
        description="Generate and manage vendor settlement statements."
        eyebrow="Insights"
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />Generate Settlement
          </Button>
        }
      />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load settlements" />
      ) : (
        <DataTable columns={columns} data={settlements} searchPlaceholder="Search settlements..." />
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Generate Settlement</ModalTitle>
          </ModalHeader>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Vendor</Label>
              <Select
                value={form.vendorId}
                onChange={(e) => setForm((f) => ({ ...f, vendorId: e.target.value }))}
                required
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Period start</Label>
              <Input
                type="date"
                value={form.periodStart}
                onChange={(e) => setForm((f) => ({ ...f, periodStart: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Period end</Label>
              <Input
                type="date"
                value={form.periodEnd}
                onChange={(e) => setForm((f) => ({ ...f, periodEnd: e.target.value }))}
                required
              />
            </div>
            <ModalFooter className="px-0">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={generateSettlement.isPending}>
                {generateSettlement.isPending ? 'Generating...' : 'Generate'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
