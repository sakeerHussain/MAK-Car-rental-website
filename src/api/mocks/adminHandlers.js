import { delay, http, HttpResponse } from 'msw';
import { mockSessions } from './data';
import {
  adminBookings,
  adminCars,
  adminCustomers,
  adminDrivers,
  adminVendors,
  adminEmployees,
  adminMaintenance,
  adminInspections,
  adminCorporateAccounts,
  adminCorporateMemberships,
  adminCorporateTrips,
  adminSettlements,
  adminReviews,
  createMockExportBlob,
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

  // Vendors
  http.get('/admin/api/vendors/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const vendor = adminVendors.find((v) => v.id === params.id);
    if (!vendor) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(vendor);
  }),

  http.post('/admin/api/vendors', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    if (body.id) {
      const index = adminVendors.findIndex((v) => v.id === body.id);
      if (index >= 0) {
        adminVendors[index] = { ...adminVendors[index], ...body };
        return HttpResponse.json(adminVendors[index]);
      }
    }
    const newVendor = { ...body, id: `vendor-${Date.now()}`, status: body.status || 'ACTIVE' };
    adminVendors.unshift(newVendor);
    return HttpResponse.json(newVendor, { status: 201 });
  }),

  http.delete('/admin/api/vendors/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const index = adminVendors.findIndex((v) => v.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminVendors.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  // Employees
  http.get('/admin/api/employees', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(adminEmployees);
  }),

  http.get('/admin/api/employees/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const emp = adminEmployees.find((e) => e.id === params.id);
    if (!emp) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(emp);
  }),

  http.post('/admin/api/employees', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    if (body.id) {
      const index = adminEmployees.findIndex((e) => e.id === body.id);
      if (index >= 0) {
        adminEmployees[index] = { ...adminEmployees[index], ...body };
        return HttpResponse.json(adminEmployees[index]);
      }
    }
    const newEmp = { ...body, id: `emp-${Date.now()}`, status: body.status || 'ACTIVE' };
    adminEmployees.unshift(newEmp);
    return HttpResponse.json(newEmp, { status: 201 });
  }),

  http.delete('/admin/api/employees/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const index = adminEmployees.findIndex((e) => e.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminEmployees.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  // Maintenance
  http.get('/admin/api/maintenance', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(adminMaintenance);
  }),

  http.get('/admin/api/maintenance/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const record = adminMaintenance.find((m) => m.id === params.id);
    if (!record) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(record);
  }),

  http.post('/admin/api/maintenance', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const car = adminCars.find((c) => c.id === body.carId);
    if (body.id) {
      const index = adminMaintenance.findIndex((m) => m.id === body.id);
      if (index >= 0) {
        adminMaintenance[index] = { ...adminMaintenance[index], ...body, carName: car ? `${car.make} ${car.model}` : adminMaintenance[index].carName };
        return HttpResponse.json(adminMaintenance[index]);
      }
    }
    const newRecord = {
      ...body,
      id: `mnt-${Date.now()}`,
      carName: car ? `${car.make} ${car.model}` : 'Unknown',
      status: body.status || 'SCHEDULED',
    };
    adminMaintenance.unshift(newRecord);
    return HttpResponse.json(newRecord, { status: 201 });
  }),

  http.delete('/admin/api/maintenance/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const index = adminMaintenance.findIndex((m) => m.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminMaintenance.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  // Inspections
  http.get('/admin/api/inspections', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(adminInspections);
  }),

  http.get('/admin/api/inspections/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const record = adminInspections.find((i) => i.id === params.id);
    if (!record) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(record);
  }),

  http.post('/admin/api/inspections', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const car = adminCars.find((c) => c.id === body.carId);
    if (body.id) {
      const index = adminInspections.findIndex((i) => i.id === body.id);
      if (index >= 0) {
        adminInspections[index] = { ...adminInspections[index], ...body, carName: car ? `${car.make} ${car.model}` : adminInspections[index].carName };
        return HttpResponse.json(adminInspections[index]);
      }
    }
    const newRecord = {
      ...body,
      id: `ins-${Date.now()}`,
      carName: car ? `${car.make} ${car.model}` : 'Unknown',
    };
    adminInspections.unshift(newRecord);
    return HttpResponse.json(newRecord, { status: 201 });
  }),

  http.delete('/admin/api/inspections/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const index = adminInspections.findIndex((i) => i.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminInspections.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  // Corporate trips
  http.get('/admin/api/corporate-trips', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(adminCorporateTrips);
  }),

  http.get('/admin/api/corporate-trips/accounts', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(adminCorporateAccounts);
  }),

  http.post('/admin/api/corporate-trips/accounts', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    if (body.id) {
      const index = adminCorporateAccounts.findIndex((a) => a.id === body.id);
      if (index >= 0) {
        adminCorporateAccounts[index] = { ...adminCorporateAccounts[index], ...body };
        return HttpResponse.json(adminCorporateAccounts[index]);
      }
    }
    const newAccount = { ...body, id: `corp-acc-${Date.now()}`, status: body.status || 'ACTIVE' };
    adminCorporateAccounts.unshift(newAccount);
    return HttpResponse.json(newAccount, { status: 201 });
  }),

  http.delete('/admin/api/corporate-trips/accounts/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const index = adminCorporateAccounts.findIndex((a) => a.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminCorporateAccounts.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  http.get('/admin/api/corporate-trips/memberships', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(adminCorporateMemberships);
  }),

  http.post('/admin/api/corporate-trips/memberships', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const account = adminCorporateAccounts.find((a) => a.id === body.accountId);
    const customer = adminCustomers.find((c) => c.id === body.userId);
    if (body.id) {
      const index = adminCorporateMemberships.findIndex((m) => m.id === body.id);
      if (index >= 0) {
        adminCorporateMemberships[index] = {
          ...adminCorporateMemberships[index],
          ...body,
          accountName: account?.name || adminCorporateMemberships[index].accountName,
          userName: customer?.name || adminCorporateMemberships[index].userName,
        };
        return HttpResponse.json(adminCorporateMemberships[index]);
      }
    }
    const newMembership = {
      ...body,
      id: `corp-mem-${Date.now()}`,
      accountName: account?.name || 'Unknown',
      userName: customer?.name || body.userName || 'Unknown',
      status: body.status || 'ACTIVE',
    };
    adminCorporateMemberships.unshift(newMembership);
    return HttpResponse.json(newMembership, { status: 201 });
  }),

  http.delete('/admin/api/corporate-trips/memberships/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const index = adminCorporateMemberships.findIndex((m) => m.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminCorporateMemberships.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  http.get('/admin/api/corporate-trips/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const trip = adminCorporateTrips.find((t) => t.id === params.id);
    if (!trip) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(trip);
  }),

  http.post('/admin/api/corporate-trips', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const account = adminCorporateAccounts.find((a) => a.id === body.accountId);
    const car = body.carId ? adminCars.find((c) => c.id === body.carId) : null;
    const driver = body.driverId ? adminDrivers.find((d) => d.id === body.driverId) : null;
    if (body.id) {
      const index = adminCorporateTrips.findIndex((t) => t.id === body.id);
      if (index >= 0) {
        adminCorporateTrips[index] = {
          ...adminCorporateTrips[index],
          ...body,
          accountName: account?.name || adminCorporateTrips[index].accountName,
          carName: car ? `${car.make} ${car.model}` : adminCorporateTrips[index].carName,
          driverName: driver?.name || adminCorporateTrips[index].driverName,
        };
        return HttpResponse.json(adminCorporateTrips[index]);
      }
    }
    const newTrip = {
      ...body,
      id: `ctrip-${Date.now()}`,
      accountName: account?.name || 'Unknown',
      carName: car ? `${car.make} ${car.model}` : null,
      driverName: driver?.name || null,
      status: body.status || 'REQUESTED',
      stops: body.stops || [],
    };
    adminCorporateTrips.unshift(newTrip);
    return HttpResponse.json(newTrip, { status: 201 });
  }),

  http.delete('/admin/api/corporate-trips/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const index = adminCorporateTrips.findIndex((t) => t.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminCorporateTrips.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  http.post('/admin/api/corporate-trips/:id/status', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const trip = adminCorporateTrips.find((t) => t.id === params.id);
    if (!trip) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    trip.status = body.status;
    return HttpResponse.json(trip);
  }),

  http.get('/admin/corporate-trips/export', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return new HttpResponse(createMockExportBlob('Corporate Trips Export'), {
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    });
  }),

  // Settlements
  http.get('/admin/api/settlements', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(adminSettlements);
  }),

  http.get('/admin/api/settlements/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const settlement = adminSettlements.find((s) => s.id === params.id);
    if (!settlement) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(settlement);
  }),

  http.post('/admin/api/settlements', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const vendor = adminVendors.find((v) => v.id === body.vendorId);
    const gross = body.grossAmount || Math.floor(15000 + Math.random() * 10000);
    const commission = Math.round(gross * ((vendor?.commissionPercent || 15) / 100));
    const newSettlement = {
      id: `stl-${Date.now()}`,
      vendorId: body.vendorId,
      vendorName: vendor?.name || 'Unknown',
      periodStart: body.periodStart,
      periodEnd: body.periodEnd,
      grossAmount: gross,
      commission,
      netPayable: gross - commission,
      status: 'DRAFT',
    };
    adminSettlements.unshift(newSettlement);
    return HttpResponse.json(newSettlement, { status: 201 });
  }),

  http.post('/admin/api/settlements/:id/status', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const settlement = adminSettlements.find((s) => s.id === params.id);
    if (!settlement) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    settlement.status = body.status;
    return HttpResponse.json(settlement);
  }),

  http.get('/admin/settlements/:id/pdf', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return new HttpResponse(createMockExportBlob(`Settlement ${params.id} PDF`), {
      headers: { 'Content-Type': 'application/pdf' },
    });
  }),

  http.get('/admin/settlements/:id/excel', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return new HttpResponse(createMockExportBlob(`Settlement ${params.id} Excel`), {
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    });
  }),

  // Reports
  http.get('/admin/reports/excel', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return new HttpResponse(createMockExportBlob('General Report Excel'), {
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    });
  }),

  http.get('/admin/reports/pdf', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return new HttpResponse(createMockExportBlob('General Report PDF'), {
      headers: { 'Content-Type': 'application/pdf' },
    });
  }),

  http.get('/admin/reports/vendors/excel', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return new HttpResponse(createMockExportBlob('Vendor Report Excel'), {
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    });
  }),

  http.get('/admin/reports/vendors/pdf', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return new HttpResponse(createMockExportBlob('Vendor Report PDF'), {
      headers: { 'Content-Type': 'application/pdf' },
    });
  }),

  http.get('/admin/reports/drivers/excel', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return new HttpResponse(createMockExportBlob('Driver Report Excel'), {
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    });
  }),

  http.get('/admin/reports/drivers/pdf', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return new HttpResponse(createMockExportBlob('Driver Report PDF'), {
      headers: { 'Content-Type': 'application/pdf' },
    });
  }),

  // Reviews
  http.get('/admin/api/reviews', async ({ request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(adminReviews);
  }),

  http.post('/admin/api/reviews/:id/approve', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const review = adminReviews.find((r) => r.id === params.id);
    if (!review) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    review.status = 'APPROVED';
    return HttpResponse.json(review);
  }),

  http.delete('/admin/api/reviews/:id', async ({ params, request }) => {
    await latency();
    if (!requireAdmin(request)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const index = adminReviews.findIndex((r) => r.id === params.id);
    if (index < 0) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    adminReviews.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),
];
