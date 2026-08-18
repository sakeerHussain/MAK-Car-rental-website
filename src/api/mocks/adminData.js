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
  { id: 'vendor-001', name: 'Gulf Fleet Partners', contactPerson: 'Hassan Ali', status: 'ACTIVE' },
  { id: 'vendor-002', name: 'Emirates Auto Rentals', contactPerson: 'Sara Khan', status: 'ACTIVE' },
];

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
