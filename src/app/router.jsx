import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { VendorLayout } from '@/app/layouts/VendorLayout';
import { DriverLayout } from '@/app/layouts/DriverLayout';
import { placeholders as p } from '@/app/placeholders';
import {
  AdminRoute,
  AdminPermissionRoute,
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
import AdminLoginPage from '@/features/admin/pages/AdminLoginPage';
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import AdminCarsListPage from '@/features/admin/pages/AdminCarsListPage';
import AdminCarNewPage from '@/features/admin/pages/AdminCarNewPage';
import AdminCarDetailPage from '@/features/admin/pages/AdminCarDetailPage';
import AdminCarEditPage from '@/features/admin/pages/AdminCarEditPage';
import AdminDriversListPage from '@/features/admin/pages/AdminDriversListPage';
import AdminDriverNewPage from '@/features/admin/pages/AdminDriverNewPage';
import AdminDriverDetailPage from '@/features/admin/pages/AdminDriverDetailPage';
import AdminDriverEditPage from '@/features/admin/pages/AdminDriverEditPage';
import AdminBookingsListPage from '@/features/admin/pages/AdminBookingsListPage';
import AdminTrackingPage from '@/features/admin/pages/AdminTrackingPage';
import AdminEmployeesListPage from '@/features/admin/pages/AdminEmployeesListPage';
import AdminEmployeeNewPage from '@/features/admin/pages/AdminEmployeeNewPage';
import AdminEmployeeDetailPage from '@/features/admin/pages/AdminEmployeeDetailPage';
import AdminVendorsListPage from '@/features/admin/pages/AdminVendorsListPage';
import AdminVendorNewPage from '@/features/admin/pages/AdminVendorNewPage';
import AdminVendorDetailPage from '@/features/admin/pages/AdminVendorDetailPage';
import AdminVendorEditPage from '@/features/admin/pages/AdminVendorEditPage';
import AdminMaintenanceListPage from '@/features/admin/pages/AdminMaintenanceListPage';
import AdminInspectionsListPage from '@/features/admin/pages/AdminInspectionsListPage';
import AdminCorporateTripsListPage from '@/features/admin/pages/AdminCorporateTripsListPage';
import AdminCorporateInvoicePage from '@/features/admin/pages/AdminCorporateInvoicePage';
import AdminSettlementsListPage from '@/features/admin/pages/AdminSettlementsListPage';
import AdminSettlementDetailPage from '@/features/admin/pages/AdminSettlementDetailPage';
import AdminReportsPage from '@/features/admin/pages/AdminReportsPage';
import AdminReportsVendorsPage from '@/features/admin/pages/AdminReportsVendorsPage';
import AdminReportsDriversPage from '@/features/admin/pages/AdminReportsDriversPage';
import AdminReviewsListPage from '@/features/admin/pages/AdminReviewsListPage';
import VendorLoginPage from '@/features/vendor/pages/VendorLoginPage';
import VendorDashboardPage from '@/features/vendor/pages/VendorDashboardPage';
import VendorCarsPage from '@/features/vendor/pages/VendorCarsPage';
import VendorDriversPage from '@/features/vendor/pages/VendorDriversPage';
import VendorTripsPage from '@/features/vendor/pages/VendorTripsPage';
import VendorSettlementsPage from '@/features/vendor/pages/VendorSettlementsPage';
import VendorSettlementPdfPage from '@/features/vendor/pages/VendorSettlementPdfPage';
import VendorSettlementExcelPage from '@/features/vendor/pages/VendorSettlementExcelPage';
import DriverLoginPage from '@/features/driver/pages/DriverLoginPage';
import DriverDashboardPage from '@/features/driver/pages/DriverDashboardPage';
import DriverTripsPage from '@/features/driver/pages/DriverTripsPage';
import DriverProfilePage from '@/features/driver/pages/DriverProfilePage';
import DriverAvailabilityPage from '@/features/driver/pages/DriverAvailabilityPage';
import DriverPasswordPage from '@/features/driver/pages/DriverPasswordPage';
import AboutPage from '@/features/marketing/pages/AboutPage';
import FleetPage from '@/features/marketing/pages/FleetPage';
import ServicesPage from '@/features/marketing/pages/ServicesPage';
import ManpowerPage from '@/features/marketing/pages/ManpowerPage';
import OperationsPage from '@/features/marketing/pages/OperationsPage';
import ClientsPage from '@/features/marketing/pages/ClientsPage';
import ContactPage from '@/features/marketing/pages/ContactPage';
import DocumentPage from '@/features/marketing/pages/DocumentPage';

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
          { path: 'about', element: <AboutPage /> },
          { path: 'fleet', element: <FleetPage /> },
          { path: 'services', element: <ServicesPage /> },
          { path: 'manpower', element: <ManpowerPage /> },
          { path: 'operations', element: <OperationsPage /> },
          { path: 'clients', element: <ClientsPage /> },
          { path: 'contact', element: <ContactPage /> },
          { path: 'docs/:slug', element: <DocumentPage /> },
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

  { path: 'admin/login', element: <AdminLoginPage /> },

  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'admin', element: <AdminDashboardPage /> },
          {
            element: <AdminPermissionRoute permission="MANAGE_FLEET" />,
            children: [
              { path: 'admin/cars', element: <AdminCarsListPage /> },
              { path: 'admin/cars/new', element: <AdminCarNewPage /> },
              { path: 'admin/cars/:id', element: <AdminCarDetailPage /> },
              { path: 'admin/cars/:id/edit', element: <AdminCarEditPage /> },
              { path: 'admin/employees', element: <AdminEmployeesListPage /> },
              { path: 'admin/employees/new', element: <AdminEmployeeNewPage /> },
              { path: 'admin/employees/:id', element: <AdminEmployeeDetailPage /> },
              { path: 'admin/maintenance', element: <AdminMaintenanceListPage /> },
              { path: 'admin/inspections', element: <AdminInspectionsListPage /> },
              { path: 'admin/tracking', element: <AdminTrackingPage /> },
            ],
          },
          {
            element: <AdminPermissionRoute permission="MANAGE_VENDORS" />,
            children: [
              { path: 'admin/vendors', element: <AdminVendorsListPage /> },
              { path: 'admin/vendors/new', element: <AdminVendorNewPage /> },
              { path: 'admin/vendors/:id', element: <AdminVendorDetailPage /> },
              { path: 'admin/vendors/:id/edit', element: <AdminVendorEditPage /> },
            ],
          },
          {
            element: <AdminPermissionRoute permission="MANAGE_DRIVERS" />,
            children: [
              { path: 'admin/drivers', element: <AdminDriversListPage /> },
              { path: 'admin/drivers/new', element: <AdminDriverNewPage /> },
              { path: 'admin/drivers/:id', element: <AdminDriverDetailPage /> },
              { path: 'admin/drivers/:id/edit', element: <AdminDriverEditPage /> },
            ],
          },
          {
            element: <AdminPermissionRoute permission="MANAGE_BOOKINGS" />,
            children: [
              { path: 'admin/bookings', element: <AdminBookingsListPage /> },
              { path: 'admin/bookings/:id/invoice', element: ph(p.adminBookingInvoice) },
              { path: 'admin/corporate-trips', element: <AdminCorporateTripsListPage /> },
              { path: 'admin/corporate-trips/:id/invoice', element: <AdminCorporateInvoicePage /> },
              { path: 'admin/reviews', element: <AdminReviewsListPage /> },
            ],
          },
          {
            element: <AdminPermissionRoute permission="MANAGE_BILLING" />,
            children: [
              { path: 'admin/settlements', element: <AdminSettlementsListPage /> },
              { path: 'admin/settlements/:id', element: <AdminSettlementDetailPage /> },
            ],
          },
          {
            element: <AdminPermissionRoute permission="VIEW_REPORTS" />,
            children: [
              { path: 'admin/reports', element: <AdminReportsPage /> },
              { path: 'admin/reports/vendors', element: <AdminReportsVendorsPage /> },
              { path: 'admin/reports/drivers', element: <AdminReportsDriversPage /> },
            ],
          },
          { path: 'admin/users', element: ph(p.adminUsers) },
          { path: 'admin/audit', element: ph(p.adminAudit) },
          { path: 'admin/settings', element: ph(p.adminSettings) },
          { path: 'admin/settings/categories', element: ph(p.adminSettingsCategories) },
          { path: 'admin/profile', element: ph(p.adminProfile) },
        ],
      },
    ],
  },

  { path: 'vendor/login', element: <VendorLoginPage /> },

  {
    element: <VendorRoute />,
    children: [
      {
        element: <VendorLayout />,
        children: [
          { path: 'vendor', element: <VendorDashboardPage /> },
          { path: 'vendor/cars', element: <VendorCarsPage /> },
          { path: 'vendor/drivers', element: <VendorDriversPage /> },
          { path: 'vendor/trips', element: <VendorTripsPage /> },
          { path: 'vendor/settlements', element: <VendorSettlementsPage /> },
          { path: 'vendor/settlements/:id/pdf', element: <VendorSettlementPdfPage /> },
          { path: 'vendor/settlements/:id/excel', element: <VendorSettlementExcelPage /> },
        ],
      },
    ],
  },

  { path: 'driver/login', element: <DriverLoginPage /> },

  {
    element: <DriverRoute />,
    children: [
      {
        element: <DriverLayout />,
        children: [
          { path: 'driver', element: <DriverDashboardPage /> },
          { path: 'driver/trips', element: <DriverTripsPage /> },
          { path: 'driver/profile', element: <DriverProfilePage /> },
          { path: 'driver/availability', element: <DriverAvailabilityPage /> },
          { path: 'driver/password', element: <DriverPasswordPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
