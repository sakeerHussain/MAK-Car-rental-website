import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminCars } from '@/api/hooks/admin/useAdminCars';
import {
  useAdminMaintenance,
  useDeleteAdminMaintenance,
  useSaveAdminMaintenance,
} from '@/api/hooks/admin/useAdminMaintenance';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  DataTable,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  PageHeader,
  ConfirmDialog,
} from '@/shared/components';
import { AdminMaintenanceForm } from '@/features/admin/components/AdminMaintenanceForm';

export default function AdminMaintenanceListPage() {
  const { data: records = [], isLoading, isError } = useAdminMaintenance();
  const { data: cars = [] } = useAdminCars();
  const saveRecord = useSaveAdminMaintenance();
  const deleteRecord = useDeleteAdminMaintenance();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    { key: 'carName', label: 'Vehicle', sortable: true },
    { key: 'description', label: 'Description' },
    {
      key: 'dates',
      label: 'Period',
      render: (row) => `${row.startDate} → ${row.endDate}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'COMPLETED' ? 'success' : row.status === 'IN_PROGRESS' ? 'warning' : 'info'}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setEditing(row); setModalOpen(true); }}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(row.id)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet — Maintenance"
        description="Schedule and track vehicle maintenance records."
        eyebrow="Fleet"
        actions={
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="size-4" />Add Record
          </Button>
        }
      />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load maintenance records" />
      ) : (
        <DataTable columns={columns} data={records} searchPlaceholder="Search maintenance..." />
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit Maintenance' : 'New Maintenance Record'}</ModalTitle>
          </ModalHeader>
          <AdminMaintenanceForm
            cars={cars}
            defaultValues={editing}
            loading={saveRecord.isPending}
            onSubmit={async (values) => {
              await saveRecord.mutateAsync(editing ? { ...values, id: editing.id } : values);
              setModalOpen(false);
              setEditing(null);
            }}
          />
          <ModalFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete maintenance record?"
        description="This cannot be undone."
        onConfirm={async () => {
          await deleteRecord.mutateAsync(deleteId);
          setDeleteId(null);
        }}
        loading={deleteRecord.isPending}
      />
    </div>
  );
}
