import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Download, Building2, Users } from 'lucide-react';
import { TRANSPORT_STATUSES } from '@/shared/models/enums';
import { useAdminCars } from '@/api/hooks/admin/useAdminCars';
import { useAdminDrivers } from '@/api/hooks/admin/useAdminDrivers';
import {
  useAdminCorporateAccounts,
  useAdminCorporateMemberships,
  useAdminCorporateTrips,
  useDeleteAdminCorporateAccount,
  useDeleteAdminCorporateMembership,
  useDeleteAdminCorporateTrip,
  useExportCorporateTripsExcel,
  useSaveAdminCorporateAccount,
  useSaveAdminCorporateMembership,
  useSaveAdminCorporateTrip,
  useUpdateAdminCorporateTripStatus,
} from '@/api/hooks/admin/useAdminCorporateTrips';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select } from '@/components/ui/select';
import {
  Alert,
  ConfirmDialog,
  DataTable,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  PageHeader,
} from '@/shared/components';
import { formatDate } from '@/shared/utils/rental';
import { AdminCorporateTripForm } from '@/features/admin/components/AdminCorporateTripForm';
import { AdminCorporateAccountForm } from '@/features/admin/components/AdminCorporateAccountForm';
import { AdminCorporateMemberForm } from '@/features/admin/components/AdminCorporateMemberForm';

export default function AdminCorporateTripsListPage() {
  const { data: trips = [], isLoading, isError } = useAdminCorporateTrips();
  const { data: accounts = [] } = useAdminCorporateAccounts();
  const { data: memberships = [] } = useAdminCorporateMemberships();
  const { data: cars = [] } = useAdminCars();
  const { data: drivers = [] } = useAdminDrivers();

  const saveTrip = useSaveAdminCorporateTrip();
  const deleteTrip = useDeleteAdminCorporateTrip();
  const updateStatus = useUpdateAdminCorporateTripStatus();
  const saveAccount = useSaveAdminCorporateAccount();
  const deleteAccount = useDeleteAdminCorporateAccount();
  const saveMembership = useSaveAdminCorporateMembership();
  const deleteMembership = useDeleteAdminCorporateMembership();
  const exportExcel = useExportCorporateTripsExcel();

  const [tripModal, setTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [accountModal, setAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [memberModal, setMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteTripId, setDeleteTripId] = useState(null);
  const [activeTab, setActiveTab] = useState('trips');

  const tripColumns = [
    { key: 'accountName', label: 'Account', sortable: true },
    { key: 'passenger', label: 'Passenger' },
    {
      key: 'scheduledPickup',
      label: 'Pickup',
      render: (row) => formatDate(row.scheduledPickup),
    },
    { key: 'pickup', label: 'From' },
    { key: 'destination', label: 'To' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Select
          value={row.status}
          onChange={(e) => updateStatus.mutate({ id: row.id, status: e.target.value })}
          className="h-8 w-36 text-xs"
        >
          {TRANSPORT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      ),
    },
    {
      key: 'invoice',
      label: 'Invoice',
      render: (row) => row.serviceAmount ? (
        <Link to={`/admin/corporate-trips/${row.id}/invoice`} className="text-sm text-primary hover:underline">
          View
        </Link>
      ) : (
        <span className="text-xs text-text-muted">Not ready</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setEditingTrip(row); setTripModal(true); }}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteTripId(row.id)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const accountColumns = [
    { key: 'name', label: 'Company', sortable: true },
    { key: 'contactPerson', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setEditingAccount(row); setAccountModal(true); }}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteAccount.mutate(row.id)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const memberColumns = [
    { key: 'userName', label: 'User', sortable: true },
    { key: 'accountName', label: 'Account' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setEditingMember(row); setMemberModal(true); }}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteMembership.mutate(row.id)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const tabs = [
    { id: 'trips', label: 'Trips', icon: null },
    { id: 'accounts', label: 'Accounts', icon: Building2 },
    { id: 'memberships', label: 'Memberships', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corporate Trips"
        description="Manage corporate transport bookings, accounts, and memberships."
        eyebrow="Bookings"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportExcel.mutate()} disabled={exportExcel.isPending}>
              <Download className="size-4" />Export Excel
            </Button>
            <Button onClick={() => { setEditingTrip(null); setTripModal(true); }}>
              <Plus className="size-4" />New Trip
            </Button>
          </div>
        }
      />

      <div className="flex gap-2 border-b border-border-brand">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.icon ? <tab.icon className="size-4" /> : null}
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? <Skeleton className="h-64 rounded-xl" /> : isError ? (
        <Alert variant="danger" title="Failed to load corporate trips" />
      ) : activeTab === 'trips' ? (
        <DataTable columns={tripColumns} data={trips} searchPlaceholder="Search trips..." />
      ) : activeTab === 'accounts' ? (
        <div className="space-y-4">
          <Button onClick={() => { setEditingAccount(null); setAccountModal(true); }}>
            <Plus className="size-4" />Add Account
          </Button>
          <DataTable columns={accountColumns} data={accounts} searchPlaceholder="Search accounts..." />
        </div>
      ) : (
        <div className="space-y-4">
          <Button onClick={() => { setEditingMember(null); setMemberModal(true); }}>
            <Plus className="size-4" />Add Membership
          </Button>
          <DataTable columns={memberColumns} data={memberships} searchPlaceholder="Search memberships..." />
        </div>
      )}

      <Modal open={tripModal} onOpenChange={setTripModal}>
        <ModalContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <ModalHeader>
            <ModalTitle>{editingTrip ? 'Edit Corporate Trip' : 'New Corporate Trip'}</ModalTitle>
          </ModalHeader>
          <AdminCorporateTripForm
            accounts={accounts}
            cars={cars}
            drivers={drivers}
            defaultValues={editingTrip ? {
              ...editingTrip,
              scheduledPickup: editingTrip.scheduledPickup?.slice(0, 16),
              expectedCompletion: editingTrip.expectedCompletion?.slice(0, 16),
            } : undefined}
            loading={saveTrip.isPending}
            onSubmit={async (values) => {
              await saveTrip.mutateAsync(editingTrip ? { ...values, id: editingTrip.id } : values);
              setTripModal(false);
              setEditingTrip(null);
            }}
          />
          <ModalFooter>
            <Button variant="outline" onClick={() => setTripModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={accountModal} onOpenChange={setAccountModal}>
        <ModalContent>
          <ModalHeader><ModalTitle>{editingAccount ? 'Edit Account' : 'New Corporate Account'}</ModalTitle></ModalHeader>
          <AdminCorporateAccountForm
            defaultValues={editingAccount}
            loading={saveAccount.isPending}
            onSubmit={async (values) => {
              await saveAccount.mutateAsync(editingAccount ? { ...values, id: editingAccount.id } : values);
              setAccountModal(false);
              setEditingAccount(null);
            }}
          />
          <ModalFooter>
            <Button variant="outline" onClick={() => setAccountModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={memberModal} onOpenChange={setMemberModal}>
        <ModalContent>
          <ModalHeader><ModalTitle>{editingMember ? 'Edit Membership' : 'New Membership'}</ModalTitle></ModalHeader>
          <AdminCorporateMemberForm
            accounts={accounts}
            defaultValues={editingMember}
            loading={saveMembership.isPending}
            onSubmit={async (values) => {
              await saveMembership.mutateAsync(editingMember ? { ...values, id: editingMember.id } : values);
              setMemberModal(false);
              setEditingMember(null);
            }}
          />
          <ModalFooter>
            <Button variant="outline" onClick={() => setMemberModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTripId)}
        onOpenChange={(open) => !open && setDeleteTripId(null)}
        title="Delete corporate trip?"
        description="This cannot be undone."
        onConfirm={async () => {
          await deleteTrip.mutateAsync(deleteTripId);
          setDeleteTripId(null);
        }}
        loading={deleteTrip.isPending}
      />
    </div>
  );
}
