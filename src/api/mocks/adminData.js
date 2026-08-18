import { MOCK_CARS, MOCK_DRIVERS, mockBookings } from './data';

/** Mutable admin state — mirrors backend persistence in mock mode */
export let adminCars = MOCK_CARS.map((c) => ({
  ...c,
  documents: c.id === 'car-001'
    ? [
        { id: 'doc-1', type: 'RC', expiryDate: '2027-01-15', fileName: 'rc-camry.pdf' },
        { id: 'doc-2', type: 'INSURANCE', expiryDate: '2026-04-20', fileName: 'insurance-camry.pdf' },
      ]
    : [],
  media: (c.images || [c.imageUrl]).filter(Boolean).map((url, i) => ({
    id: `media-${c.id}-${i}`,
    url,
    type: 'PHOTO',
  })),
}));

export let adminDrivers = MOCK_DRIVERS.map((d) => ({
  ...d,
  documents: d.id === 'drv-001'
    ? [{ id: 'ddoc-1', type: 'LICENCE', expiryDate: d.licenceExpiry, fileName: 'licence.pdf' }]
    : [],
}));

export let adminBookings = mockBookings.map((b) => ({
  ...b,
  customerName: 'Demo Customer',
  payments: b.amountPaid > 0
    ? [{
        id: 'pay-001',
        amount: b.amountPaid,
        method: 'CARD',
        reference: 'TXN-8821',
        paidAt: b.pickupDate,
        notes: 'Full payment',
      }]
    : [],
}));

export const adminVendors = [
  {
    id: 'vendor-001',
    name: 'Gulf Fleet Partners',
    contactPerson: 'Hassan Ali',
    phone: '+971 50 123 4567',
    email: 'hassan@gulffleet.ae',
    commissionPercent: 15,
    status: 'ACTIVE',
  },
  {
    id: 'vendor-002',
    name: 'Emirates Auto Rentals',
    contactPerson: 'Sara Khan',
    phone: '+971 55 987 6543',
    email: 'sara@emiratesauto.ae',
    commissionPercent: 12,
    status: 'ACTIVE',
  },
];

export let adminEmployees = [
  {
    id: 'emp-001',
    name: 'Fatima Al-Rashid',
    phone: '+971 50 111 2233',
    email: 'fatima@mak.ae',
    department: 'Operations',
    designation: 'Fleet Coordinator',
    status: 'ACTIVE',
    joinDate: '2022-03-15',
  },
  {
    id: 'emp-002',
    name: 'James Wilson',
    phone: '+971 55 444 5566',
    email: 'james@mak.ae',
    department: 'Finance',
    designation: 'Accounts Manager',
    status: 'ACTIVE',
    joinDate: '2021-08-01',
  },
];

export let adminMaintenance = [
  {
    id: 'mnt-001',
    carId: 'car-001',
    carName: 'Toyota Camry',
    description: 'Full service — oil change, brake pads',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    status: 'SCHEDULED',
  },
  {
    id: 'mnt-002',
    carId: 'car-002',
    carName: 'Nissan Patrol',
    description: 'Engine diagnostics',
    startDate: '2026-07-20',
    endDate: '2026-07-22',
    status: 'COMPLETED',
  },
];

export let adminInspections = [
  {
    id: 'ins-001',
    carId: 'car-001',
    carName: 'Toyota Camry',
    inspectorName: 'Ahmed Hassan',
    inspectionDate: '2026-07-01',
    result: 'PASS',
    notes: 'All systems operational',
  },
  {
    id: 'ins-002',
    carId: 'car-002',
    carName: 'Nissan Patrol',
    inspectorName: 'Ravi Kumar',
    inspectionDate: '2026-06-15',
    result: 'CONDITIONAL',
    notes: 'Minor tyre wear noted',
  },
];

export let adminCorporateAccounts = [
  {
    id: 'corp-acc-001',
    name: 'Emirates National Bank',
    contactPerson: 'Layla Mohammed',
    email: 'layla@enbd.ae',
    phone: '+971 4 123 4567',
    status: 'ACTIVE',
  },
  {
    id: 'corp-acc-002',
    name: 'Dubai Healthcare Group',
    contactPerson: 'Dr. Omar Siddiqui',
    email: 'omar@dhg.ae',
    phone: '+971 4 987 6543',
    status: 'ACTIVE',
  },
];

export let adminCorporateMemberships = [
  {
    id: 'corp-mem-001',
    userId: 'user-002',
    userName: 'Sarah Mitchell',
    accountId: 'corp-acc-001',
    accountName: 'Emirates National Bank',
    role: 'BOOKER',
    status: 'ACTIVE',
  },
  {
    id: 'corp-mem-002',
    userId: 'user-003',
    userName: 'Omar Farouk',
    accountId: 'corp-acc-001',
    accountName: 'Emirates National Bank',
    role: 'VIEWER',
    status: 'ACTIVE',
  },
];

export let adminCorporateTrips = [
  {
    id: 'ctrip-001',
    accountId: 'corp-acc-001',
    accountName: 'Emirates National Bank',
    bookedBy: 'Sarah Mitchell',
    bookerPhone: '+971 50 222 3344',
    bookerEmail: 'sarah@example.com',
    passenger: 'Executive Team (4 pax)',
    scheduledPickup: '2026-08-20T09:00:00',
    expectedCompletion: '2026-08-20T17:00:00',
    carId: 'car-001',
    carName: 'Toyota Camry',
    driverId: 'drv-001',
    driverName: 'Rashid Al-Maktoum',
    status: 'CONFIRMED',
    pickup: 'Dubai International Airport',
    destination: 'DIFC Conference Centre',
    stops: ['Burj Khalifa'],
    waitingTime: 30,
    billingArrangement: 'BILL_TO_COMPANY',
    projectCode: 'ENBD-Q3-2026',
    projectManager: 'Layla Mohammed',
    coordinator: 'Fatima Al-Rashid',
    remarks: 'VIP pickup — meet at arrivals gate 3',
    serviceAmount: 850,
    taxPercent: 5,
    poNumber: 'PO-ENBD-8821',
    externalReference: 'EXT-REF-001',
  },
  {
    id: 'ctrip-002',
    accountId: 'corp-acc-002',
    accountName: 'Dubai Healthcare Group',
    bookedBy: 'Omar Farouk',
    bookerPhone: '+971 55 333 4455',
    bookerEmail: 'omar@example.com',
    passenger: 'Dr. Siddiqui',
    scheduledPickup: '2026-08-22T14:00:00',
    expectedCompletion: '2026-08-22T16:00:00',
    status: 'REQUESTED',
    pickup: 'Dubai Healthcare Group HQ',
    destination: 'Dubai Mall',
    stops: [],
    billingArrangement: 'NOT_SET',
    remarks: 'Awaiting vehicle assignment',
  },
];

export let adminSettlements = [
  {
    id: 'stl-001',
    vendorId: 'vendor-001',
    vendorName: 'Gulf Fleet Partners',
    periodStart: '2026-07-01',
    periodEnd: '2026-07-31',
    grossAmount: 24500,
    commission: 3675,
    netPayable: 20825,
    status: 'FINALISED',
  },
  {
    id: 'stl-002',
    vendorId: 'vendor-002',
    vendorName: 'Emirates Auto Rentals',
    periodStart: '2026-07-01',
    periodEnd: '2026-07-31',
    grossAmount: 18200,
    commission: 2184,
    netPayable: 16016,
    status: 'DRAFT',
  },
];

export let adminReviews = [
  {
    id: 'rev-001',
    carId: 'car-001',
    carName: 'Toyota Camry',
    customerId: 'user-002',
    customerName: 'Sarah Mitchell',
    rating: 5,
    comment: 'Excellent service, car was spotless and driver was professional.',
    status: 'PENDING',
    createdAt: '2026-08-10T10:30:00',
  },
  {
    id: 'rev-002',
    carId: 'car-002',
    carName: 'Nissan Patrol',
    customerId: 'user-003',
    customerName: 'Omar Farouk',
    rating: 4,
    comment: 'Great SUV for family trip. Slightly delayed pickup.',
    status: 'APPROVED',
    createdAt: '2026-07-28T15:45:00',
  },
  {
    id: 'rev-003',
    carId: 'car-001',
    carName: 'Toyota Camry',
    customerId: 'user-demo',
    customerName: 'Demo Customer',
    rating: 3,
    comment: 'Car was good but AC was not very cold.',
    status: 'PENDING',
    createdAt: '2026-08-15T09:00:00',
  },
];

/** @returns {Blob} */
export function createMockExportBlob(label) {
  return new Blob([`${label} — generated ${new Date().toISOString()}`], { type: 'text/plain' });
}

export const adminCustomers = [
  { id: 'user-demo', name: 'Demo Customer', email: 'demo@mak.ae' },
  { id: 'user-002', name: 'Sarah Mitchell', email: 'sarah@example.com' },
  { id: 'user-003', name: 'Omar Farouk', email: 'omar@example.com' },
];

export function getTrackingLocations() {
  const now = new Date().toISOString();
  return adminCars
    .filter((c) => c.status === 'ACTIVE')
    .map((car, index) => ({
      carId: car.id,
      carName: `${car.make} ${car.model}`,
      lat: 25.12 + index * 0.04 + Math.sin(Date.now() / 60000) * 0.01,
      lng: 55.2 + index * 0.03 + Math.cos(Date.now() / 60000) * 0.01,
      speed: Math.floor(20 + Math.random() * 60),
      ignitionOn: Math.random() > 0.3,
      lastUpdated: now,
    }));
}

export function getDashboardData() {
  const statusCounts = adminBookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = adminBookings.reduce((sum, b) => sum + (b.total || 0), 0);
  const ownedRevenue = adminBookings
    .filter((b) => {
      const car = adminCars.find((c) => c.id === b.carId);
      return car?.ownership === 'OWNED';
    })
    .reduce((sum, b) => sum + b.total, 0);

  const thirtyDays = new Date();
  thirtyDays.setDate(thirtyDays.getDate() + 30);

  const expiringDocuments = [];
  adminCars.forEach((car) => {
    car.documents?.forEach((doc) => {
      if (new Date(doc.expiryDate) <= thirtyDays) {
        expiringDocuments.push({
          entityType: 'CAR',
          entityName: `${car.make} ${car.model}`,
          documentType: doc.type,
          expiryDate: doc.expiryDate,
        });
      }
    });
  });
  adminDrivers.forEach((driver) => {
    if (new Date(driver.licenceExpiry) <= thirtyDays) {
      expiringDocuments.push({
        entityType: 'DRIVER',
        entityName: driver.name,
        documentType: 'LICENCE',
        expiryDate: driver.licenceExpiry,
      });
    }
  });

  return {
    kpis: {
      totalCars: adminCars.length,
      totalDrivers: adminDrivers.length,
      totalVendors: adminVendors.length,
      totalCustomers: adminCustomers.length,
      totalBookings: adminBookings.length,
      confirmedBookings: statusCounts.CONFIRMED || 0,
      totalRevenue,
    },
    revenueTrend: [
      { month: 'Jan', revenue: 42000 },
      { month: 'Feb', revenue: 38500 },
      { month: 'Mar', revenue: 51200 },
      { month: 'Apr', revenue: 47800 },
      { month: 'May', revenue: 55600 },
      { month: 'Jun', revenue: 62100 },
    ],
    bookingsByStatus: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
    revenueSplit: [
      { name: 'Owned Fleet', value: ownedRevenue },
      { name: 'Vendor Fleet', value: Math.max(0, totalRevenue - ownedRevenue) },
    ],
    expiringDocuments,
    recentBookings: adminBookings.slice(0, 6),
  };
}
