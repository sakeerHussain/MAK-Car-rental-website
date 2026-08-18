import { delay, http, HttpResponse } from 'msw';
import {
  LOCATIONS,
  MOCK_BANNERS,
  MOCK_CARS,
  MOCK_DRIVERS,
  MOCK_PROMOTIONS,
  MOCK_REVIEWS,
  MOCK_TESTIMONIALS,
  mockBookings,
  mockSessions,
} from './data';
import { adminHandlers } from './adminHandlers';
import { createPortalHandlers } from './portalHandlers';

const latency = () => delay(300 + Math.random() * 500);

function getToken(request) {
  const auth = request.headers.get('Authorization');
  return auth?.replace('Bearer ', '') || null;
}

function getUserFromToken(token) {
  if (!token) return null;
  return mockSessions.get(token) || null;
}

function filterCars(params) {
  let cars = MOCK_CARS.filter((c) => c.showOnSite);

  const type = params.get('type');
  const minSeats = params.get('minSeats');
  const transmission = params.get('transmission');
  const maxPrice = params.get('maxPrice');
  const withDriver = params.get('withDriver');
  const vehicleKind = params.get('vehicleKind');

  if (vehicleKind === 'BIKE') {
    cars = cars.filter((c) => c.type === 'BIKE');
  } else if (vehicleKind === 'CAR') {
    cars = cars.filter((c) => c.type !== 'BIKE');
  }

  if (type) cars = cars.filter((c) => c.type === type);
  if (minSeats) cars = cars.filter((c) => c.seats >= Number(minSeats));
  if (transmission) cars = cars.filter((c) => c.transmission === transmission);
  if (maxPrice) cars = cars.filter((c) => c.dailyRate <= Number(maxPrice));
  if (withDriver === 'true') {
    cars = cars.filter((c) => c.type !== 'BIKE');
  }

  return cars;
}

function calculatePrice(car, pickupDate, returnDate, rentalUnit, withDriver, driverId) {
  const pickup = new Date(pickupDate);
  const ret = new Date(returnDate);
  const ms = ret.getTime() - pickup.getTime();
  const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));

  const base =
    rentalUnit === 'MONTH'
      ? car.monthlyRate * Math.max(1, Math.ceil(days / 30))
      : car.dailyRate * days;

  let driverCharge = 0;
  if (withDriver && driverId) {
    const driver = MOCK_DRIVERS.find((d) => d.id === driverId);
    if (driver) driverCharge = driver.dailyCharge * days;
  }

  const subtotal = base + driverCharge;
  const tax = subtotal * 0.05;
  return { days, base, driverCharge, subtotal, tax, total: subtotal + tax };
}

export const handlers = [
  http.get('/api/config', async () => {
    await latency();
    return HttpResponse.json({
      orgName: 'MAK International',
      currency: 'AED',
      currencySymbol: 'AED',
      taxPercent: 5,
      locations: LOCATIONS,
    });
  }),

  http.get('/api/home', async () => {
    await latency();
    const featuredCars = MOCK_CARS.filter((c) => c.showOnSite && c.available).slice(0, 4);
    const minRate = Math.min(...MOCK_CARS.filter((c) => c.showOnSite).map((c) => c.dailyRate));
    return HttpResponse.json({
      banners: MOCK_BANNERS,
      featuredCars,
      minDailyRate: minRate,
      testimonials: MOCK_TESTIMONIALS,
      promotions: MOCK_PROMOTIONS,
    });
  }),

  http.get('/api/cars', async ({ request }) => {
    await latency();
    const url = new URL(request.url);
    const cars = filterCars(url.searchParams);
    return HttpResponse.json({ cars, total: cars.length });
  }),

  http.get('/api/cars/:id', async ({ params }) => {
    await latency();
    const car = MOCK_CARS.find((c) => c.id === params.id);
    if (!car) {
      return HttpResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    return HttpResponse.json(car);
  }),

  http.get('/api/cars/:id/reviews', async ({ params }) => {
    await latency();
    const reviews = MOCK_REVIEWS.filter(
      (r) => r.carId === params.id && r.status === 'APPROVED',
    );
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    return HttpResponse.json({ reviews, avgRating, count: reviews.length });
  }),

  http.post('/api/reviews', async ({ request }) => {
    await latency();
    const token = getToken(request);
    const user = getUserFromToken(token);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const review = {
      id: `rev-${Date.now()}`,
      carId: body.carId,
      customerId: user.id,
      customerName: user.name,
      rating: body.rating,
      comment: body.comment,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
    };
    MOCK_REVIEWS.unshift(review);
    return HttpResponse.json(review, { status: 201 });
  }),

  http.get('/api/drivers/available', async ({ request }) => {
    await latency();
    const url = new URL(request.url);
    const pickup = url.searchParams.get('pickup');
    const ret = url.searchParams.get('return');

    const bookedDriverIds = mockBookings
      .filter((b) => {
        if (!b.driverId || b.status === 'CANCELLED') return false;
        const bStart = new Date(b.pickupDate).getTime();
        const bEnd = new Date(b.returnDate).getTime();
        const pStart = new Date(pickup).getTime();
        const pEnd = new Date(ret).getTime();
        return pStart < bEnd && pEnd > bStart;
      })
      .map((b) => b.driverId);

    const drivers = MOCK_DRIVERS.filter(
      (d) => d.status === 'AVAILABLE' && !bookedDriverIds.includes(d.id),
    );
    return HttpResponse.json({ drivers });
  }),

  http.post('/api/bookings/price-preview', async ({ request }) => {
    await latency();
    const body = await request.json();
    const car = MOCK_CARS.find((c) => c.id === body.carId);
    if (!car) {
      return HttpResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    const pricing = calculatePrice(
      car,
      body.pickupDate,
      body.returnDate,
      body.rentalUnit || 'DAY',
      body.withDriver,
      body.driverId,
    );
    return HttpResponse.json(pricing);
  }),

  http.post('/api/bookings', async ({ request }) => {
    await latency();
    const token = getToken(request);
    const user = getUserFromToken(token);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const car = MOCK_CARS.find((c) => c.id === body.carId);

    if (!car) {
      return HttpResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    if (car.status === 'MAINTENANCE' || !car.available) {
      return HttpResponse.json(
        { message: 'This vehicle is currently in maintenance and cannot be booked.', fieldErrors: { carId: ['Vehicle unavailable'] } },
        { status: 409 },
      );
    }

    if (body.withDriver && body.driverId) {
      const conflict = mockBookings.some((b) => {
        if (b.driverId !== body.driverId || b.status === 'CANCELLED') return false;
        const bStart = new Date(b.pickupDate).getTime();
        const bEnd = new Date(b.returnDate).getTime();
        const pStart = new Date(body.pickupDate).getTime();
        const pEnd = new Date(body.returnDate).getTime();
        return pStart < bEnd && pEnd > bStart;
      });
      if (conflict) {
        return HttpResponse.json(
          { message: 'Selected driver is already booked for these dates.', fieldErrors: { driverId: ['Driver unavailable'] } },
          { status: 409 },
        );
      }
    }

    const pricing = calculatePrice(
      car,
      body.pickupDate,
      body.returnDate,
      body.rentalUnit || 'DAY',
      body.withDriver,
      body.driverId,
    );

    const driver = body.driverId
      ? MOCK_DRIVERS.find((d) => d.id === body.driverId)
      : null;

    const booking = {
      id: `bkg-${Date.now()}`,
      carId: car.id,
      driverId: body.driverId || null,
      customerId: user.id,
      pickupDate: body.pickupDate,
      returnDate: body.returnDate,
      rentalUnit: body.rentalUnit || 'DAY',
      pickupLocation: body.pickupLocation,
      dropLocation: body.dropLocation,
      withDriver: Boolean(body.withDriver),
      total: pricing.total,
      amountPaid: 0,
      status: 'PENDING',
      carName: `${car.make} ${car.model}`,
      driverName: driver?.name || null,
    };

    mockBookings.unshift(booking);
    return HttpResponse.json(booking, { status: 201 });
  }),

  http.get('/api/bookings/mine', async ({ request }) => {
    await latency();
    const token = getToken(request);
    const user = getUserFromToken(token);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const bookings = mockBookings.filter((b) => b.customerId === user.id);
    return HttpResponse.json({ bookings });
  }),

  http.get('/api/bookings/:id/invoice', async ({ params, request }) => {
    await latency();
    const token = getToken(request);
    const user = getUserFromToken(token);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const booking = mockBookings.find((b) => b.id === params.id);
    if (!booking || booking.customerId !== user.id) {
      return HttpResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }
    const car = MOCK_CARS.find((c) => c.id === booking.carId);
    const pricing = calculatePrice(
      car,
      booking.pickupDate,
      booking.returnDate,
      booking.rentalUnit,
      booking.withDriver,
      booking.driverId,
    );

    return HttpResponse.json({
      invoiceNumber: `INV-${booking.id.toUpperCase()}`,
      issuedAt: new Date().toISOString(),
      booking,
      lineItems: [
        {
          description: `${booking.carName} rental (${pricing.days} days)`,
          amount: pricing.base,
        },
        ...(pricing.driverCharge > 0
          ? [{ description: 'Chauffeur service', amount: pricing.driverCharge }]
          : []),
      ],
      subtotal: pricing.subtotal,
      tax: pricing.tax,
      total: pricing.total,
      amountPaid: booking.amountPaid,
      balance: pricing.total - booking.amountPaid,
      currency: 'AED',
    });
  }),

  http.get('/api/bookings/:id/invoice/pdf', async ({ params, request }) => {
    await latency();
    const token = getToken(request);
    const user = getUserFromToken(token);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const booking = mockBookings.find((b) => b.id === params.id);
    if (!booking || booking.customerId !== user.id) {
      return HttpResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    const pdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 120>>stream
BT /F1 18 Tf 72 720 Td (MAK International Invoice) Tj 0 -30 Td (${booking.id}) Tj 0 -30 Td (Total: AED ${booking.total}) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000438 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
512
%%EOF`;

    return new HttpResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="invoice-${booking.id}.pdf"`,
      },
    });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await latency();
    const body = await request.json();
    const email = body.email || '';

    let user;
    if (email.includes('admin@') || email === 'admin') {
      user = {
        id: 'admin-001',
        email: email || 'admin@mak.ae',
        name: 'Admin User',
        role: 'ADMIN',
        permissions: [
          'MANAGE_FLEET', 'MANAGE_DRIVERS', 'MANAGE_VENDORS', 'MANAGE_BOOKINGS',
          'MANAGE_BILLING', 'VIEW_REPORTS', 'MANAGE_CONFIG', 'MANAGE_USERS',
        ],
      };
    } else if (email.includes('staff@')) {
      user = {
        id: 'staff-001',
        email,
        name: 'Staff Operator',
        role: 'STAFF',
        permissions: ['MANAGE_FLEET', 'MANAGE_BOOKINGS', 'VIEW_REPORTS'],
      };
    } else if (email.includes('vendor@')) {
      user = {
        id: 'vendor-user-001',
        email: email || 'vendor@mak.ae',
        name: 'Hassan Ali',
        role: 'VENDOR',
        vendorId: 'vendor-001',
      };
    } else if (email.includes('driver@')) {
      user = {
        id: 'driver-user-001',
        email: email || 'driver@mak.ae',
        name: 'Ahmed Al Rashid',
        role: 'DRIVER',
        driverId: 'drv-001',
      };
    } else {
      user = {
        id: 'user-demo',
        email: email || 'demo@mak.ae',
        name: 'Demo Customer',
        role: 'CUSTOMER',
        hasCorporateAccess: email === 'corporate@mak.ae',
        corporateMemberRole: email === 'corporate@mak.ae' ? 'VIEWER' : undefined,
      };
    }

    const token = `mock-token-${Date.now()}`;
    mockSessions.set(token, user);
    return HttpResponse.json({ user, accessToken: token });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await latency();
    const body = await request.json();
    const user = {
      id: `user-${Date.now()}`,
      email: body.email,
      name: body.name || 'New Customer',
      role: 'CUSTOMER',
      hasCorporateAccess: false,
    };
    const token = `mock-token-${Date.now()}`;
    mockSessions.set(token, user);
    return HttpResponse.json({ user, accessToken: token }, { status: 201 });
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    await latency();
    const token = getToken(request);
    if (token) mockSessions.delete(token);
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await latency();
    const token = getToken(request);
    const user = getUserFromToken(token);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json({ user, accessToken: token });
  }),

  ...createPortalHandlers(mockSessions),
  ...adminHandlers,
];
