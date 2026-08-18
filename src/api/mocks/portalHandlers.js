import { delay, http, HttpResponse } from 'msw';
import {
  createMockPdfBlob,
  getDriverDashboard,
  getDriverProfile,
  getDriverTrips,
  getVendorCars,
  getVendorDashboard,
  getVendorDrivers,
  getVendorSettlements,
  getVendorTrips,
  MARKETING_DOCS,
} from './portalData';
import { createMockExportBlob } from './adminData';
import { MOCK_DRIVERS } from './data';

const latency = () => delay(300 + Math.random() * 500);

function getToken(request) {
  const auth = request.headers.get('Authorization');
  return auth?.replace('Bearer ', '') || null;
}

function getUserFromToken(token, mockSessions) {
  if (!token) return null;
  return mockSessions.get(token) || null;
}

export function createPortalHandlers(mockSessions) {
  return [
    http.post('/api/contact', async ({ request }) => {
      await latency();
      const body = await request.json();
      if (!body.name || !body.email || !body.message) {
        return HttpResponse.json({ message: 'All fields are required' }, { status: 400 });
      }
      return HttpResponse.json({ success: true, message: 'Thank you — we will respond within 24 hours.' });
    }),

    http.get('/api/docs/:slug', async ({ params }) => {
      await latency();
      const doc = MARKETING_DOCS[params.slug];
      if (!doc) return HttpResponse.json({ message: 'Document not found' }, { status: 404 });
      return HttpResponse.json({ slug: params.slug, ...doc });
    }),

    http.get('/api/docs/:slug/pdf', async ({ params }) => {
      await latency();
      const doc = MARKETING_DOCS[params.slug];
      if (!doc) return HttpResponse.json({ message: 'Document not found' }, { status: 404 });
      return new HttpResponse(createMockPdfBlob(doc.title), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${params.slug}.pdf"`,
        },
      });
    }),

    // Vendor portal
    http.get('/api/vendor/dashboard', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'VENDOR') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return HttpResponse.json(getVendorDashboard(user.vendorId));
    }),

    http.get('/api/vendor/cars', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'VENDOR') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return HttpResponse.json({ cars: getVendorCars(user.vendorId) });
    }),

    http.get('/api/vendor/drivers', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'VENDOR') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return HttpResponse.json({ drivers: getVendorDrivers(user.vendorId) });
    }),

    http.get('/api/vendor/trips', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'VENDOR') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const url = new URL(request.url);
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      return HttpResponse.json({
        trips: getVendorTrips(user.vendorId, startDate, endDate),
      });
    }),

    http.get('/api/vendor/settlements', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'VENDOR') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return HttpResponse.json({ settlements: getVendorSettlements(user.vendorId) });
    }),

    http.get('/api/vendor/settlements/:id/pdf', async ({ params, request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'VENDOR') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const settlements = getVendorSettlements(user.vendorId);
      if (!settlements.find((s) => s.id === params.id)) {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      }
      return new HttpResponse(createMockPdfBlob(`Settlement ${params.id}`), {
        headers: { 'Content-Type': 'application/pdf' },
      });
    }),

    http.get('/api/vendor/settlements/:id/excel', async ({ params, request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'VENDOR') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const settlements = getVendorSettlements(user.vendorId);
      if (!settlements.find((s) => s.id === params.id)) {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      }
      return new HttpResponse(createMockExportBlob(`Settlement ${params.id}`), {
        headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      });
    }),

    // Driver portal
    http.get('/api/driver/dashboard', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'DRIVER') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return HttpResponse.json(getDriverDashboard(user.driverId));
    }),

    http.get('/api/driver/trips', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'DRIVER') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const url = new URL(request.url);
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      return HttpResponse.json({
        trips: getDriverTrips(user.driverId, startDate, endDate),
      });
    }),

    http.get('/api/driver/profile', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'DRIVER') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const profile = getDriverProfile(user.driverId);
      if (!profile) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      return HttpResponse.json(profile);
    }),

    http.post('/api/driver/availability', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'DRIVER') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const body = await request.json();
      const driver = MOCK_DRIVERS.find((d) => d.id === user.driverId);
      if (driver) driver.status = body.status;
      return HttpResponse.json({ status: body.status });
    }),

    http.post('/api/driver/password', async ({ request }) => {
      await latency();
      const user = getUserFromToken(getToken(request), mockSessions);
      if (!user || user.role !== 'DRIVER') {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const body = await request.json();
      if (!body.newPassword || body.newPassword.length < 6) {
        return HttpResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
      }
      return HttpResponse.json({ success: true });
    }),
  ];
}
