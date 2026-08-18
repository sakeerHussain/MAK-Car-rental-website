import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminCars } from '@/api/hooks/admin/useAdminCars';
import {
  useAdminInspections,
  useDeleteAdminInspection,
  useSaveAdminInspection,
} from '@/api/hooks/admin/useAdminInspections';
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
import { AdminInspectionForm } from '@/features/admin/components/AdminInspectionForm';

export default function AdminInspectionsListPage() {
  const { data: records = [], isLoading, isError } = useAdminInspections();
  const { data: cars = [] } = useAdminCars();
  const saveRecord = useSaveAdminInspection();
  const deleteRecord = useDeleteAdminInspection();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const resultVariant = (result) => {
    if (result === 'PASS') return 'success';
    if (result === 'FAIL') return 'danger';
    return 'warning';
  };

  const columns = [
    { key: 'carName', label: 'Vehicle', sortable: true },
    { key: 'inspectorName', label: 'Inspector' },
    { key: 'inspectionDate', label: 'Date', sortable: true },
    {
      key: 'result',
      label: 'Result',
      render: (row) => <Badge variant={resultVariant(row.result)}>{row.result}</Badge>,
    },
    { key: 'notes', label: 'Notes' },
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
        title="Fleet — Inspections"
        description="Vehicle inspection records and compliance tracking."
        eyebrow="Fleet"
        actions={
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="size-4" />Add Inspection
          </Button>
        }
      />
      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load inspections" />
      ) : (
        <DataTable columns={columns} data={records} searchPlaceholder="Search inspections..." />
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit Inspection' : 'New Inspection'}</ModalTitle>
          </ModalHeader>
          <AdminInspectionForm
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
        title="Delete inspection?"
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
