import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { VendorLayout } from '@/app/layouts/VendorLayout';
import { DriverLayout } from '@/app/layouts/DriverLayout';
import { placeholders as p } from '@/app/placeholders';
import {
  AdminRoute,
  CorporateInvoiceRoute,
  CorporateRoute,
  CustomerRoute,
  DriverRoute,
  PublicRoute,
  VendorRoute,
} from '@/features/auth/RouteGuards';
import { PlaceholderPage } from '@/shared/components';
import HomePage from '@/features/marketing/pages/HomePage';
import CarsBrowsePage from '@/features/cars/pages/CarsBrowsePage';
import CarDetailPage from '@/features/cars/pages/CarDetailPage';
import BookCarPage from '@/features/bookings/pages/BookCarPage';
import MyBookingsPage from '@/features/bookings/pages/MyBookingsPage';
import BookingInvoicePage from '@/features/bookings/pages/BookingInvoicePage';
import BookingInvoicePdfPage from '@/features/bookings/pages/BookingInvoicePdfPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import LogoutPage from '@/features/auth/pages/LogoutPage';

function ph({ title, description, breadcrumbs }) {
  return <PlaceholderPage title={title} description={description} breadcrumbs={breadcrumbs} />;
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'about', element: ph(p.about) },
          { path: 'fleet', element: ph(p.fleet) },
          { path: 'services', element: ph(p.services) },
          { path: 'manpower', element: ph(p.manpower) },
          { path: 'operations', element: ph(p.operations) },
          { path: 'clients', element: ph(p.clients) },
          { path: 'contact', element: ph(p.contact) },
          { path: 'docs/brochure', element: ph(p.docBrochure) },
          { path: 'docs/trade-license', element: ph(p.docTradeLicense) },
          { path: 'docs/vat-certificate', element: ph(p.docVatCertificate) },
          { path: 'docs/quotation', element: ph(p.docQuotation) },
          { path: 'docs/invoice', element: ph(p.docInvoice) },
          { path: 'docs/trip-sheet', element: ph(p.docTripSheet) },
          { path: 'docs/permit', element: ph(p.docPermit) },
          { path: 'cars', element: <CarsBrowsePage /> },
          { path: 'cars/:id', element: <CarDetailPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'logout', element: <LogoutPage /> },
          {
            element: <CustomerRoute />,
            children: [
              { path: 'cars/:id/book', element: <BookCarPage /> },
              { path: 'my-bookings', element: <MyBookingsPage /> },
              { path: 'my-bookings/:id/invoice', element: <BookingInvoicePage /> },
              { path: 'my-bookings/:id/invoice/pdf', element: <BookingInvoicePdfPage /> },
            ],
          },
          {
            element: <CorporateRoute />,
            children: [{ path: 'my-corporate-trips', element: ph(p.corporateTrips) }],
          },
          {
            element: <CorporateInvoiceRoute />,
            children: [
              { path: 'my-corporate-trips/:id/invoice', element: ph(p.corporateInvoice) },
              { path: 'my-corporate-trips/:id/invoice/pdf', element: ph(p.corporateInvoicePdf) },
            ],
          },
        ],
      },
    ],
  },

  { path: 'admin/login', element: ph(p.adminLogin) },

  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'admin', element: ph(p.adminDashboard) },
          { path: 'admin/cars', element: ph(p.adminCars) },
          { path: 'admin/cars/new', element: ph(p.adminCarNew) },
          { path: 'admin/cars/:id', element: ph(p.adminCarDetail) },
          { path: 'admin/cars/:id/edit', element: ph(p.adminCarEdit) },
          { path: 'admin/drivers', element: ph(p.adminDrivers) },
          { path: 'admin/drivers/new', element: ph(p.adminDriverNew) },
          { path: 'admin/drivers/:id', element: ph(p.adminDriverDetail) },
          { path: 'admin/drivers/:id/edit', element: ph(p.adminDriverEdit) },
          { path: 'admin/employees', element: ph(p.adminEmployees) },
          { path: 'admin/employees/new', element: ph(p.adminEmployeeNew) },
          { path: 'admin/employees/:id', element: ph(p.adminEmployeeDetail) },
          { path: 'admin/vendors', element: ph(p.adminVendors) },
          { path: 'admin/vendors/new', element: ph(p.adminVendorNew) },
          { path: 'admin/vendors/:id', element: ph(p.adminVendorDetail) },
          { path: 'admin/vendors/:id/edit', element: ph(p.adminVendorEdit) },
          { path: 'admin/maintenance', element: ph(p.adminMaintenance) },
          { path: 'admin/inspections', element: ph(p.adminInspections) },
          { path: 'admin/tracking', element: ph(p.adminTracking) },
          { path: 'admin/bookings', element: ph(p.adminBookings) },
          { path: 'admin/bookings/:id/invoice', element: ph(p.adminBookingInvoice) },
          { path: 'admin/corporate-trips', element: ph(p.adminCorporateTrips) },
          { path: 'admin/corporate-trips/:id/invoice', element: ph(p.adminCorporateInvoice) },
          { path: 'admin/settlements', element: ph(p.adminSettlements) },
          { path: 'admin/settlements/:id', element: ph(p.adminSettlementDetail) },
          { path: 'admin/reports', element: ph(p.adminReports) },
          { path: 'admin/reports/vendors', element: ph(p.adminReportsVendors) },
          { path: 'admin/reports/drivers', element: ph(p.adminReportsDrivers) },
          { path: 'admin/reviews', element: ph(p.adminReviews) },
          { path: 'admin/users', element: ph(p.adminUsers) },
          { path: 'admin/audit', element: ph(p.adminAudit) },
          { path: 'admin/settings', element: ph(p.adminSettings) },
          { path: 'admin/settings/categories', element: ph(p.adminSettingsCategories) },
          { path: 'admin/profile', element: ph(p.adminProfile) },
        ],
      },
    ],
  },

  { path: 'vendor/login', element: ph(p.vendorLogin) },

  {
    element: <VendorRoute />,
    children: [
      {
        element: <VendorLayout />,
        children: [
          { path: 'vendor', element: ph(p.vendorDashboard) },
          { path: 'vendor/cars', element: ph(p.vendorCars) },
          { path: 'vendor/drivers', element: ph(p.vendorDrivers) },
          { path: 'vendor/trips', element: ph(p.vendorTrips) },
          { path: 'vendor/settlements', element: ph(p.vendorSettlements) },
          { path: 'vendor/settlements/:id/pdf', element: ph(p.vendorSettlementPdf) },
          { path: 'vendor/settlements/:id/excel', element: ph(p.vendorSettlementExcel) },
        ],
      },
    ],
  },

  { path: 'driver/login', element: ph(p.driverLogin) },

  {
    element: <DriverRoute />,
    children: [
      {
        element: <DriverLayout />,
        children: [
          { path: 'driver', element: ph(p.driverDashboard) },
          { path: 'driver/trips', element: ph(p.driverTrips) },
          { path: 'driver/profile', element: ph(p.driverProfile) },
          { path: 'driver/availability', element: ph(p.driverAvailability) },
          { path: 'driver/password', element: ph(p.driverPassword) },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
