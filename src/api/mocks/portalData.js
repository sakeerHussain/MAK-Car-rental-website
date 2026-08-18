import { MOCK_CARS, MOCK_DRIVERS } from './data';
import { adminCorporateTrips, adminSettlements } from './adminData';

/** @returns {Blob} */
export function createMockPdfBlob(label) {
  const pdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 100>>stream
BT /F1 14 Tf 72 720 Td (MAK International) Tj 0 -24 Td (${label}) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000400 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
470
%%EOF`;
  return new Blob([pdfContent], { type: 'application/pdf' });
}

export const MARKETING_DOCS = {
  brochure: { title: 'Company Brochure', description: 'Overview of MAK International services and fleet capabilities.' },
  'trade-license': { title: 'Trade License', description: 'Official trade license documentation.' },
  'vat-certificate': { title: 'VAT Certificate', description: 'VAT registration certificate.' },
  quotation: { title: 'Sample Quotation', description: 'Sample quotation format for corporate clients.' },
  invoice: { title: 'Sample Invoice', description: 'Sample invoice layout and terms.' },
  'trip-sheet': { title: 'Trip Sheet', description: 'Standard trip sheet template.' },
  permit: { title: 'Permit', description: 'Vehicle permit documentation.' },
};

export let vendorTrips = [
  {
    id: 'vtrip-001',
    vendorId: 'vendor-001',
    carName: 'Hyundai Accent',
    driverName: null,
    customerName: 'Walk-in Customer',
    pickupDate: '2026-07-15T09:00:00',
    returnDate: '2026-07-18T09:00:00',
    pickup: 'Sharjah City Centre',
    destination: 'Dubai Marina',
    status: 'COMPLETED',
    total: 285,
  },
  {
    id: 'vtrip-002',
    vendorId: 'vendor-001',
    carName: 'Hyundai Accent',
    driverName: 'Rajesh Kumar',
    customerName: 'Sarah Mitchell',
    pickupDate: '2026-08-20T10:00:00',
    returnDate: '2026-08-22T10:00:00',
    pickup: 'DXB Airport',
    destination: 'Business Bay',
    status: 'CONFIRMED',
    total: 190,
  },
  {
    id: 'vtrip-003',
    vendorId: 'vendor-002',
    carName: 'Toyota Yaris',
    driverName: 'Mohammed Hassan',
    customerName: 'Omar Farouk',
    pickupDate: '2026-08-10T08:00:00',
    returnDate: '2026-08-12T08:00:00',
    pickup: 'Abu Dhabi City',
    destination: 'Dubai Mall',
    status: 'COMPLETED',
    total: 320,
  },
];

export function getVendorCars(vendorId) {
  return MOCK_CARS.filter((c) => c.vendorId === vendorId);
}

export function getVendorDrivers(vendorId) {
  return MOCK_DRIVERS.filter((d) => d.vendorId === vendorId);
}

export function getVendorTrips(vendorId, startDate, endDate) {
  return vendorTrips.filter((t) => {
    if (t.vendorId !== vendorId) return false;
    if (startDate && new Date(t.pickupDate) < new Date(startDate)) return false;
    if (endDate && new Date(t.pickupDate) > new Date(endDate)) return false;
    return true;
  });
}

export function getVendorSettlements(vendorId) {
  return adminSettlements.filter((s) => s.vendorId === vendorId);
}

export function getVendorDashboard(vendorId) {
  const trips = getVendorTrips(vendorId);
  const settlements = getVendorSettlements(vendorId);
  const completed = trips.filter((t) => t.status === 'COMPLETED');
  const revenue = completed.reduce((sum, t) => sum + t.total, 0);
  const upcoming = trips.filter((t) => ['CONFIRMED', 'PENDING'].includes(t.status));

  return {
    kpis: {
      totalCars: getVendorCars(vendorId).length,
      totalDrivers: getVendorDrivers(vendorId).length,
      totalTrips: trips.length,
      completedTrips: completed.length,
      totalRevenue: revenue,
      pendingSettlement: settlements.filter((s) => s.status !== 'PAID').reduce((sum, s) => sum + s.netPayable, 0),
    },
    upcomingTrips: upcoming.slice(0, 5),
    recentTrips: trips.slice(0, 5),
  };
}

export let driverTrips = [
  {
    id: 'dtrip-001',
    driverId: 'drv-001',
    carName: 'Toyota Camry',
    customerName: 'Sarah Mitchell',
    pickupDate: '2026-08-20T09:00:00',
    returnDate: '2026-08-20T17:00:00',
    pickup: 'Dubai International Airport',
    destination: 'DIFC Conference Centre',
    status: 'CONFIRMED',
    type: 'CORPORATE',
    earnings: 200,
  },
  {
    id: 'dtrip-002',
    driverId: 'drv-001',
    carName: 'Mercedes-Benz E-Class',
    customerName: 'Fatima Al Nuaimi',
    pickupDate: '2026-08-05T14:00:00',
    returnDate: '2026-08-05T18:00:00',
    pickup: 'Dubai Marina',
    destination: 'Palm Jumeirah',
    status: 'COMPLETED',
    type: 'CORPORATE',
    earnings: 160,
  },
  {
    id: 'dtrip-003',
    driverId: 'drv-001',
    carName: 'Toyota Camry',
    customerName: 'James Wilson',
    pickupDate: '2026-07-22T08:00:00',
    returnDate: '2026-07-25T08:00:00',
    pickup: 'DXB Airport',
    destination: 'JBR Beach',
    status: 'COMPLETED',
    type: 'RENTAL',
    earnings: 600,
  },
  {
    id: 'dtrip-004',
    driverId: 'drv-002',
    carName: 'Nissan Patrol',
    customerName: 'Omar Farouk',
    pickupDate: '2026-08-18T10:00:00',
    returnDate: '2026-08-19T10:00:00',
    pickup: 'Business Bay',
    destination: 'Abu Dhabi',
    status: 'CONFIRMED',
    type: 'RENTAL',
    earnings: 300,
  },
];

export function getDriverTrips(driverId, startDate, endDate) {
  return driverTrips.filter((t) => {
    if (t.driverId !== driverId) return false;
    if (startDate && new Date(t.pickupDate) < new Date(startDate)) return false;
    if (endDate && new Date(t.pickupDate) > new Date(endDate)) return false;
    return true;
  });
}

export function getDriverDashboard(driverId) {
  const trips = getDriverTrips(driverId);
  const now = new Date();
  const upcoming = trips
    .filter((t) => new Date(t.pickupDate) >= now && ['CONFIRMED', 'ASSIGNED', 'REQUESTED', 'PENDING'].includes(t.status))
    .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate));
  const recent = trips
    .filter((t) => t.status === 'COMPLETED')
    .sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate))
    .slice(0, 5);

  const driver = MOCK_DRIVERS.find((d) => d.id === driverId);

  return {
    driver,
    kpis: {
      upcomingTrips: upcoming.length,
      completedTrips: trips.filter((t) => t.status === 'COMPLETED').length,
      totalEarnings: trips.filter((t) => t.status === 'COMPLETED').reduce((sum, t) => sum + (t.earnings || 0), 0),
      status: driver?.status || 'OFF',
    },
    upcomingTrips: upcoming.slice(0, 5),
    recentTrips: recent,
  };
}

export function getDriverProfile(driverId) {
  const driver = MOCK_DRIVERS.find((d) => d.id === driverId);
  if (!driver) return null;
  return {
    ...driver,
    email: `${driver.name.split(' ')[0].toLowerCase()}@mak.ae`,
    joinedDate: '2021-03-10',
    totalTrips: getDriverTrips(driverId).length,
  };
}
