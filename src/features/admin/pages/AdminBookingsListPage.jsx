import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { BOOKING_STATUSES } from '@/shared/models/enums';
import {
  useAdminBookings,
  useCreateAdminBooking,
  useUpdateAdminBookingStatus,
  useAdminBookingPayments,
  useSaveAdminBookingPayment,
  useDeleteAdminBookingPayment,
} from '@/api/hooks/admin/useAdminBookings';
import { useAdminCars } from '@/api/hooks/admin/useAdminCars';
import { useAdminDrivers } from '@/api/hooks/admin/useAdminDrivers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Alert,
  CurrencyDisplay,
  DataTable,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  PageHeader,
  StatusBadge,
} from '@/shared/components';
import { formatDate } from '@/shared/utils/rental';

export default function AdminBookingsListPage() {
  const { data: bookings = [], isLoading, isError } = useAdminBookings();
  const { data: cars = [] } = useAdminCars();
  const { data: drivers = [] } = useAdminDrivers();
  const createBooking = useCreateAdminBooking();
  const updateStatus = useUpdateAdminBookingStatus();

  const [createOpen, setCreateOpen] = useState(false);
  const [paymentsBooking, setPaymentsBooking] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      customerName: '',
      carId: '',
      driverId: '',
      pickupDate: '',
      returnDate: '',
      rentalUnit: 'DAY',
      pickupLocation: 'dxb-airport',
      dropLocation: 'dxb-airport',
      withDriver: false,
      total: 0,
    },
  });

  const columns = [
    { key: 'id', label: 'ID', render: (row) => <span className="font-mono text-xs">{row.id}</span> },
    { key: 'carName', label: 'Vehicle', sortable: true },
    { key: 'customerName', label: 'Customer' },
    {
      key: 'pickupDate',
      label: 'Dates',
      render: (row) => (
        <div className="text-sm">
          <p>{formatDate(row.pickupDate)}</p>
          <p className="text-text-muted">to {formatDate(row.returnDate)}</p>
        </div>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (row) => <CurrencyDisplay amount={row.total} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Select
          value={row.status}
          onChange={(e) => updateStatus.mutate({ id: row.id, status: e.target.value })}
          className="h-8 w-36 text-xs"
        >
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Button variant="outline" size="sm" onClick={() => setPaymentsBooking(row)}>
          Payments
        </Button>
      ),
    },
  ];

  const onCreate = async (values) => {
    const car = cars.find((c) => c.id === values.carId);
    await createBooking.mutateAsync({
      ...values,
      withDriver: Boolean(values.driverId),
      total: values.total || car?.dailyRate || 0,
    });
    setCreateOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="Manage reservations, walk-in counter bookings, and payments."
        eyebrow="Bookings"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Counter Booking
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : isError ? (
        <Alert variant="danger" title="Failed to load bookings" />
      ) : (
        <DataTable columns={columns} data={bookings} searchPlaceholder="Search bookings..." />
      )}

      <Modal open={createOpen} onOpenChange={setCreateOpen}>
        <ModalContent onClose={() => setCreateOpen(false)}>
          <ModalHeader>
            <ModalTitle>Create Counter Booking</ModalTitle>
          </ModalHeader>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Customer name</Label>
              <Input {...register('customerName', { required: true })} placeholder="Walk-in or existing customer" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Vehicle</Label>
                <Select {...register('carId', { required: true })}>
                  <option value="">Select car</option>
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>{c.make} {c.model}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Driver (optional)</Label>
                <Select {...register('driverId')}>
                  <option value="">Self-drive</option>
                  {drivers.filter((d) => d.status === 'AVAILABLE').map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Pickup</Label>
                <Input type="datetime-local" {...register('pickupDate', { required: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>Return</Label>
                <Input type="datetime-local" {...register('returnDate', { required: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>Total (AED)</Label>
                <Input type="number" {...register('total')} />
              </div>
            </div>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createBooking.isPending}>
                {createBooking.isPending ? 'Creating...' : 'Create Booking'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <PaymentsDrawer booking={paymentsBooking} onClose={() => setPaymentsBooking(null)} />
    </div>
  );
}

function PaymentsDrawer({ booking, onClose }) {
  const bookingId = booking?.id;
  const { data: payments = [], isLoading } = useAdminBookingPayments(bookingId);
  const savePayment = useSaveAdminBookingPayment(bookingId);
  const deletePayment = useDeleteAdminBookingPayment(bookingId);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { amount: '', method: 'CASH', reference: '', notes: '' },
  });

  if (!booking) return null;

  const paid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const balance = (booking.total || 0) - paid;

  const onAddPayment = async (values) => {
    await savePayment.mutateAsync({
      ...values,
      amount: Number(values.amount),
      paidAt: new Date().toISOString(),
    });
    reset();
  };

  return (
    <Drawer open={Boolean(booking)} onOpenChange={(open) => !open && onClose()}>
      <DrawerHeader title={`Payments — ${booking.carName}`} onClose={onClose} />
      <DrawerContent>
        <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
          <Card><CardContent className="p-3"><p className="text-text-muted">Total</p><CurrencyDisplay amount={booking.total} /></CardContent></Card>
          <Card><CardContent className="p-3"><p className="text-text-muted">Paid</p><CurrencyDisplay amount={paid} className="text-success" /></CardContent></Card>
          <Card><CardContent className="p-3"><p className="text-text-muted">Balance</p><CurrencyDisplay amount={balance} className={balance > 0 ? 'text-warning' : 'text-success'} /></CardContent></Card>
        </div>

        <StatusBadge status={booking.status} className="mb-4" />

        {isLoading ? <Skeleton className="h-24" /> : (
          <ul className="mb-4 space-y-2">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg border border-border-brand px-3 py-2 text-sm">
                <div>
                  <CurrencyDisplay amount={p.amount} /> · {p.method} · {p.reference}
                  <p className="text-xs text-text-muted">{formatDate(p.paidAt)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deletePayment.mutate(p.id)}>Delete</Button>
              </li>
            ))}
            {payments.length === 0 ? <p className="text-sm text-text-muted">No payments recorded.</p> : null}
          </ul>
        )}

        <form onSubmit={handleSubmit(onAddPayment)} className="space-y-3 border-t border-border-brand pt-4">
          <p className="font-medium">Record payment</p>
          <Input type="number" placeholder="Amount" {...register('amount', { required: true })} />
          <Select {...register('method')}>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="TRANSFER">Bank Transfer</option>
          </Select>
          <Input placeholder="Reference" {...register('reference')} />
          <Input placeholder="Notes" {...register('notes')} />
          <Button type="submit" disabled={savePayment.isPending} className="w-full">
            Add Payment
          </Button>
        </form>
      </DrawerContent>
      <DrawerFooter />
    </Drawer>
  );
}
