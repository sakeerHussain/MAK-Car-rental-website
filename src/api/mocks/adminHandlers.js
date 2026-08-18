import { delay, http, HttpResponse } from 'msw';
import { mockSessions } from './data';
import {
  adminBookings,
  adminCars,
  adminCustomers,
  adminDrivers,
  adminVendors,
  getDashboardData,
  getTrackingLocations,
} from './adminData';

const latency = () => delay(300 + Math.random() * 500);

function getToken(request) {
  const auth = request.headers.get('Authorization');
  return auth?.replace('Bearer ', '') || null;
}

function requireAdmin(request) {
  const token = getToken(request);
  const user = mockSessions.get(token);
  if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
    return null;
  }
  return user;
}

export const adminHandlers = [
  http.get('/admin/api/dashboard', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json(getDashboardData());
  }),

  http.get('/admin/api/vendors', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json(adminVendors);
  }),

  http.get('/admin/tracking/data', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json(getTrackingLocations());
  }),

  // Cars
  http.get('/admin/api/cars', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json(adminCars);
  }),

  http.get('/admin/api/cars/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const car = adminCars.find((c) => c.id === params.id);
    if (!car) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(car);
  }),

  http.post('/admin/api/cars', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (body.id) {
      const index = adminCars.findIndex((c) => c.id === body.id);
      if (index >= 0) {
        adminCars[index] = { ...adminCars[index], ...body };
        return HttpResponse.json(adminCars[index]);
      }
    }
    const newCar = {
      ...body,
      id: `car-${Date.now()}`,
      documents: body.documents || [],
      media: body.media || [],
    };
    adminCars.unshift(newCar);
    return HttpResponse.json(newCar, { status: 201 });
  }),

  http.post('/admin/api/cars/:id/delete', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const index = adminCars.findIndex((c) => c.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminCars.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  http.get('/admin/api/cars/:id/media', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const car = adminCars.find((c) => c.id === params.id);
    return HttpResponse.json(car?.media || []);
  }),

  http.post('/admin/api/cars/:id/documents', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const car = adminCars.find((c) => c.id === params.id);
    if (!car) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const doc = { id: `doc-${Date.now()}`, ...body };
    car.documents = [...(car.documents || []), doc];
    return HttpResponse.json(doc, { status: 201 });
  }),

  http.delete('/admin/api/cars/:id/documents/:docId', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const car = adminCars.find((c) => c.id === params.id);
    if (!car) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    car.documents = (car.documents || []).filter((d) => d.id !== params.docId);
    return HttpResponse.json({ success: true });
  }),

  http.post('/admin/api/cars/:id/photos', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const car = adminCars.find((c) => c.id === params.id);
    if (!car) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const photo = { id: `media-${Date.now()}`, type: 'PHOTO', url: body.url };
    car.media = [...(car.media || []), photo];
    if (!car.imageUrl) car.imageUrl = photo.url;
    return HttpResponse.json(photo, { status: 201 });
  }),

  http.delete('/admin/api/cars/:id/photos/:photoId', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const car = adminCars.find((c) => c.id === params.id);
    if (!car) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    car.media = (car.media || []).filter((m) => m.id !== params.photoId);
    return HttpResponse.json({ success: true });
  }),

  // Drivers
  http.get('/admin/api/drivers', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json(adminDrivers);
  }),

  http.get('/admin/api/drivers/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const driver = adminDrivers.find((d) => d.id === params.id);
    if (!driver) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(driver);
  }),

  http.post('/admin/api/drivers', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (body.id) {
      const index = adminDrivers.findIndex((d) => d.id === body.id);
      if (index >= 0) {
        adminDrivers[index] = { ...adminDrivers[index], ...body };
        return HttpResponse.json(adminDrivers[index]);
      }
    }
    const newDriver = { ...body, id: `drv-${Date.now()}`, documents: body.documents || [] };
    adminDrivers.unshift(newDriver);
    return HttpResponse.json(newDriver, { status: 201 });
  }),

  http.delete('/admin/api/drivers/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const index = adminDrivers.findIndex((d) => d.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminDrivers.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  http.post('/admin/api/drivers/:id/status', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const driver = adminDrivers.find((d) => d.id === params.id);
    if (!driver) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    driver.status = body.status;
    return HttpResponse.json(driver);
  }),

  http.post('/admin/api/drivers/:id/documents', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const driver = adminDrivers.find((d) => d.id === params.id);
    if (!driver) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const doc = { id: `ddoc-${Date.now()}`, ...body };
    driver.documents = [...(driver.documents || []), doc];
    return HttpResponse.json(doc, { status: 201 });
  }),

  http.delete('/admin/api/drivers/:id/documents/:docId', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const driver = adminDrivers.find((d) => d.id === params.id);
    if (!driver) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    driver.documents = (driver.documents || []).filter((d) => d.id !== params.docId);
    return HttpResponse.json({ success: true });
  }),

  // Bookings
  http.get('/admin/api/bookings', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json(adminBookings);
  }),

  http.post('/admin/api/bookings', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const car = adminCars.find((c) => c.id === body.carId);
    const driver = body.driverId
      ? adminDrivers.find((d) => d.id === body.driverId)
      : null;
    const customer = adminCustomers.find((c) => c.id === body.customerId);
    const booking = {
      id: `bkg-${Date.now()}`,
      ...body,
      status: 'PENDING',
      total: body.total || car?.dailyRate || 0,
      amountPaid: 0,
      carName: car ? `${car.make} ${car.model}` : 'Unknown',
      driverName: driver?.name || null,
      customerName: customer?.name || body.customerName || 'Walk-in',
      payments: [],
    };
    adminBookings.unshift(booking);
    return HttpResponse.json(booking, { status: 201 });
  }),

  http.post('/admin/api/bookings/:id/status', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const booking = adminBookings.find((b) => b.id === params.id);
    if (!booking) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    booking.status = body.status;
    return HttpResponse.json(booking);
  }),

  http.get('/admin/api/bookings/:id/payments', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const booking = adminBookings.find((b) => b.id === params.id);
    return HttpResponse.json(booking?.payments || []);
  }),

  http.post('/admin/api/bookings/:id/payments', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const booking = adminBookings.find((b) => b.id === params.id);
    if (!booking) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const payment = {
      id: `pay-${Date.now()}`,
      ...body,
      paidAt: body.paidAt || new Date().toISOString(),
    };
    booking.payments = [...(booking.payments || []), payment];
    booking.amountPaid = booking.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    return HttpResponse.json(payment, { status: 201 });
  }),

  http.delete('/admin/api/bookings/:id/payments/:paymentId', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const booking = adminBookings.find((b) => b.id === params.id);
    if (!booking) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    booking.payments = (booking.payments || []).filter((p) => p.id !== params.paymentId);
    booking.amountPaid = booking.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    return HttpResponse.json({ success: true });
  }),
];
