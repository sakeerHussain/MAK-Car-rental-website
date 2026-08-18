# MASTER BUILD PROMPT — MAK International Vehicle Rental Platform (React + Tailwind Rebuild)

Paste this entire document into your AI coding tool as the project brief. It is written to be self-contained — the AI should not need to ask you what to build, only how you'd like to sequence the work.

---

## 0. CONTEXT — READ FIRST

You are rebuilding the frontend of **MAK International**, a multi-portal vehicle rental & transport management platform, currently implemented as a Spring Boot + Thymeleaf server-rendered app. You are **not** touching the backend logic — you are building a brand-new **React + JavaScript + Tailwind CSS** frontend that will eventually consume the backend's APIs (some exist today, some need to be mocked until the backend team ships them — see Section 9).

**This is a paid client project**, not a demo or a toy app. Treat every screen as production-grade:
- No placeholder Lorem Ipsum in final views — use realistic sample data (real-sounding car models, driver names, prices in the platform's currency).
- No unstyled default HTML elements (`<select>`, `<input>`, browser `alert()`/`confirm()`) — everything is a designed component.
- No console errors, no broken routes, no "TODO" left in shipped code without being organized into a visible backlog.
- Every list/table has loading, empty, and error states designed — not just the happy path.

**Environment:** A React project with Tailwind CSS is already installed and configured. Do not re-scaffold the project — work inside the existing setup. Confirm the existing `tailwind.config` and entry files before adding config, and extend rather than overwrite.

---

## 1. DESIGN DIRECTION — "PREMIUM BLUE & WHITE"

The client's brand is blue and white (their logo is blue-on-white), and the UI must read as premium, modern, and trustworthy — think a cross between a high-end car marketplace (e.g., Turo, Kinto) and a polished SaaS back office (e.g., Linear, Stripe Dashboard) — **not** a generic Bootstrap admin template.

### 1.1 Color Tokens (extend Tailwind theme with these — do not hardcode hex values in components)

```css
--color-primary:    #00A0E3;  /* Brand blue — primary actions, active states, links */
--color-primary-hover: #008CC7;
--color-primary-deep:  #005A82;  /* Headers, dark UI sections, sidebar active bg */
--color-primary-mid:   #0088C9;
--color-primary-light: #E6F6FD;  /* Subtle backgrounds, hover states, badges */
--color-primary-pale:  #F0FAFF;  /* Page background tint, card backgrounds */
--color-primary-bright:#33BEF0;  /* Accents, gradients, chart highlights */

--color-white:      #FFFFFF;
--color-surface:     #FFFFFF;
--color-bg:           #F7FBFD;   /* App background, warmer/whiter than pure gray */
--color-border:       #E2EEF3;
--color-text-primary: #0B1E28;
--color-text-secondary:#5B7686;
--color-text-muted:   #94A9B3;

/* Status colors — used sparingly, never as the dominant palette */
--color-success: #16A34A;
--color-warning: #F59E0B;
--color-danger:  #DC2626;
--color-info:    #00A0E3; /* reuse brand blue */
```

- The palette must stay **overwhelmingly blue and white** — status colors appear only on badges, alerts, and chart segments, never as large fills or backgrounds.
- Use **gradients sparingly and intentionally**: primary → primary-bright diagonal gradients for hero sections, KPI card accents, and CTA buttons — not on every element.
- Avoid pure black (`#000`) and pure gray (`#808080`) anywhere — use the tinted grays defined above so the whole UI feels like one cohesive blue-tinted system, not "blue theme slapped on Bootstrap gray."

### 1.2 Typography

- Font: **Plus Jakarta Sans** (Google Fonts) for everything — headings and body. Load via `@fontsource/plus-jakarta-sans` or a `<link>` in `index.html`; do not use a fallback system font as primary.
- Type scale should feel editorial, not cramped: generous line-height on body text (1.6+), tight tracking on large display headings (-0.02em), clear hierarchy between H1/H2/H3/body/caption.
- Numbers (prices, KPIs, stats) should use tabular figures and slightly bolder weight than surrounding text so dashboards feel scannable.

### 1.3 UI Craft Standards (non-negotiable)

- **Spacing rhythm:** use a consistent spacing scale (4/8/12/16/24/32/48/64px) — no arbitrary one-off margins.
- **Corner radius:** consistent system — e.g., 8px for inputs/buttons, 12–16px for cards, 20px+ for hero/feature panels. Pick one system and use it everywhere.
- **Shadows:** soft, layered, low-opacity blue-tinted shadows (not default gray box-shadow) — cards should feel like they're floating on the pale blue background.
- **Motion:** subtle transitions on hover/focus/state changes (150–250ms ease), page-level fade/slide on route change, skeleton loaders (not spinners) for data-heavy screens, staggered fade-in for card grids.
- **Empty states:** every empty list/table gets a custom illustration-or-icon + message + primary action, never a bare "No data."
- **Responsive:** every screen works at 375px, 768px, 1024px, 1440px+. Admin data tables collapse to card lists on mobile.
- **Accessibility:** visible focus rings in brand blue, sufficient contrast (verify white text on `--color-primary` passes AA), all interactive elements keyboard-reachable, form errors announced via `aria-describedby`.
- **Dark mode:** not required for v1 — skip unless asked.

If you (the AI) are ever unsure how a screen should look, default to: **generous white space, one blue accent per section, clear numeric hierarchy, soft cards on a pale blue-white canvas.** Never default to a dense, dark, gray SaaS-admin look.

---

## 2. TECH STACK (use exactly this — do not substitute without asking)

| Layer | Choice |
|---|---|
| Framework | React 18+ with JavaScript (JSX) |
| Routing | React Router v6 |
| Server state | TanStack Query |
| Client/UI state | Zustand (auth session, UI toggles) |
| Styling | Tailwind CSS + shadcn/ui components, themed to the tokens in Section 1.1 |
| Forms | React Hook Form + Zod validation |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap tiles |
| HTTP | Axios with request/response interceptors (auth token attach, 401 redirect, error normalization) |
| PDF viewing | Open in new tab for downloads; `react-pdf` for inline preview where the spec calls for an "HTML invoice view" |
| Icons | lucide-react |

---

## 3. APP ARCHITECTURE

```
src/
├── app/                     # Router config, providers, top-level layouts
│   ├── router.jsx
│   ├── providers.jsx        # QueryClientProvider, ThemeProvider, etc.
│   └── layouts/
│       ├── PublicLayout.jsx
│       ├── CustomerLayout.jsx
│       ├── AdminLayout.jsx
│       ├── VendorLayout.jsx
│       └── DriverLayout.jsx
├── features/
│   ├── auth/
│   ├── marketing/
│   ├── cars/
│   ├── bookings/
│   ├── corporate/
│   ├── admin/
│   │   ├── dashboard/ cars/ drivers/ employees/ vendors/ maintenance/
│   │   ├── inspections/ tracking/ bookings/ corporate-trips/
│   │   ├── settlements/ reports/ reviews/ users/ audit/ settings/
│   ├── vendor/
│   └── driver/
├── shared/
│   ├── components/          # See Section 5 — UI kit
│   ├── hooks/
│   ├── utils/
│   └── models/                # See Section 8 — JSDoc shape definitions
├── assets/
└── api/                      # One client module per domain, Axios instances + React Query hooks
    ├── client.js              # base Axios instance + interceptors
    ├── cars.api.js
    ├── bookings.api.js
    ├── admin.*.api.js
    ├── vendor.api.js
    ├── driver.api.js
    └── mocks/                 # MSW handlers for endpoints listed in Section 9
```

Each `features/<domain>` folder contains its own `pages/`, `components/`, and `hooks/` — keep feature code co-located rather than splitting by technical layer.

---

## 4. FULL ROUTE MAP

Build **every** route below. Use nested routing with the layout shells from Section 3.

### 4.1 Public / Marketing (no auth) — `PublicLayout`
| Route | Notes |
|---|---|
| `/` | Hero carousel (5 banners), advanced search widget (see 6.1), category chips (Hatchback/Sedan/SUV/MUV/Luxury/Bike), spot booking (30-min quick book), pickup/drop location selects, promo code field, live trip-summary sidebar, featured cars grid, feature highlights, promotions strip, testimonials, locations, newsletter CTA, mobile app promo |
| `/about` | Org info, founder/services sections, FAQ anchor |
| `/fleet` | Fleet gallery, dedupe by model |
| `/services` | Service offering cards |
| `/manpower` | Staffing/operations marketing content |
| `/operations` | Operations overview |
| `/clients` | Client/partner logo showcase |
| `/contact` | Contact form + org contact details |
| `/docs/brochure`, `/docs/trade-license`, `/docs/vat-certificate`, `/docs/quotation`, `/docs/invoice`, `/docs/trip-sheet`, `/docs/permit` | PDF viewer routes |

### 4.2 Customer — Car Rental
| Route | Auth | Notes |
|---|---|---|
| `/cars` | Public | Filters: pickup/return dates, type, min seats, transmission, max price/day, with-driver toggle; driver-availability notice; responsive grid; empty state + reset filters |
| `/cars/:id` | Public | Gallery, specs, feature tags, hourly/daily/monthly rate cards, live estimate for selected dates, Self-drive / With-driver CTAs, reviews (avg rating + list), write-review form (auth) |
| `/cars/:id/book` | Customer | Full booking form — see 6.4 |
| `/my-bookings` | Customer | Table: car, driver, dates, total, status badge, invoice links |
| `/my-bookings/:id/invoice` | Customer | HTML invoice: line items, tax, paid, balance |
| `/my-bookings/:id/invoice/pdf` | Customer | PDF download/inline |

### 4.3 Customer — Corporate Transport
| Route | Auth | Notes |
|---|---|---|
| `/my-corporate-trips` | Customer + active membership | Trip list; invoice links only for `VIEWER`/`BILLING` roles |
| `/my-corporate-trips/:id/invoice` | Customer + invoice permission | Invoice HTML |
| `/my-corporate-trips/:id/invoice/pdf` | Same | PDF |

### 4.4 Auth (customer)
`/login`, `/register`, `/logout` — plus Google OAuth button on login/register.

### 4.5 Admin / Staff Portal — `AdminLayout` (fixed sidebar + top bar)
Login at `/admin/login`. Build all of:

`/admin` (dashboard), `/admin/cars` (+ `/new`, `/:id`, `/:id/edit`), `/admin/drivers` (+ `/new`, `/:id`, `/:id/edit`), `/admin/employees` (+ `/new`, `/:id`), `/admin/vendors` (+ `/new`, `/:id`, `/:id/edit`), `/admin/maintenance`, `/admin/inspections`, `/admin/tracking`, `/admin/bookings` (+ `/:id/invoice`), `/admin/corporate-trips` (+ `/:id/invoice`), `/admin/settlements` (+ `/:id`), `/admin/reports` (+ `/vendors`, `/drivers`), `/admin/reviews`, `/admin/users`, `/admin/audit`, `/admin/settings` (+ `/categories`), `/admin/profile`.

Sidebar groups exactly as: **Fleet** (Dashboard, Cars, Drivers, Employees, Vendors, Maintenance, Inspections, Live Tracking) → **Bookings** (Bookings, Corporate Trips) → **Insights** (Billing/Settlements, Reports, Reviews) → **Administration** (Staff & Users, Audit Log, Settings). Each nav item hides if the logged-in staff user lacks the relevant permission (see Section 7).

### 4.6 Vendor Portal — `VendorLayout`
Login at `/vendor/login`. Routes: `/vendor` (dashboard), `/vendor/cars` (read-only), `/vendor/drivers` (read-only), `/vendor/trips`, `/vendor/settlements` (+ `/:id/pdf`, `/:id/excel`). All data scoped to the logged-in vendor only.

### 4.7 Driver Portal — `DriverLayout`
Login at `/driver/login`. Routes: `/driver` (dashboard), `/driver/trips`, `/driver/profile`, `/driver/availability` (toggle action), `/driver/password` (change password action).

---

## 5. SHARED UI COMPONENT LIBRARY (build these once, reuse everywhere)

**Layout:** `PublicHeader`, `PublicFooter`, `AdminSidebar`, `AdminTopBar`, `VendorTopBar`, `DriverTopBar`, `PageHeader` (gradient hero banner), `Breadcrumbs`

**Data display:** `DataTable` (sort, paginate, search, loading/empty states, mobile card-view fallback), `StatusBadge` (booking + corporate transport statuses, color-coded per Section 1), `KpiCard`, `ChartCard`, `VehicleCard`, `FilterPanel`, `Modal`/`Drawer`, `Toast`/`Alert`, `ConfirmDialog`, `FileUpload` (drag-drop, preview, progress), `PdfViewer`/`DownloadButton`, `MapView` (Leaflet wrapper), `StarRating` (display + input), `PermissionGate` (wraps children, hides by role/permission)

**Forms:** `DateRangePicker`, `CurrencyDisplay`, `SearchBar` (debounced), `MultiSelect`/`CategorySelect`

Build these as a small internal design system first (Section 10, Phase 1) before building feature screens — every feature screen should compose from this library, not invent one-off inputs/tables/cards.

---

## 6. KEY FEATURE BEHAVIOR (implement exactly as specified)

### 6.1 Home Search Widget
Vehicle kind tabs (Car/Bike) → Spot Booking quick-fill button (pickup = now+30min, return = pickup+24h) → category chips → pickup/return datetime pickers → pickup/drop location selects → with-driver checkbox → promo code field → live trip-summary panel (days × rate) → submit navigates to `/cars` with all fields as query params (`pickup`, `ret`, `type`, `minSeats`, `transmission`, `maxPrice`, `withDriver`, `pickupLocation`, `dropLocation`, `promo`).

### 6.2 Car Browse (`/cars`)
Read filters from URL query params on load and keep them in sync as the user changes filters (shareable/bookmarkable URLs). Card shows make/model/type/seats/transmission/fuel/feature tags and price — total for selected date range if dates are set, else "from ₹/day" style base rate.

### 6.3 Car Detail
Gallery with thumbnail strip, spec grid, rate cards (hourly/daily/monthly), live estimate recalculating on date change, gated "Book with driver" CTA that prompts login if unauthenticated, reviews list with average rating + count, review submission form for authenticated users.

### 6.4 Booking Form
Fields: `pickupDate`, `returnDate` (must be after pickup — validate client-side), `rentalUnit` (`DAY`|`MONTH`), `pickupLocation`, `dropLocation`, `withDriver` toggle (reveals `driverId` select, required when checked). Surface server-side conflict errors (car in maintenance, driver already booked) inline, not as generic toasts. On success, redirect to `/my-bookings` with a success toast.

### 6.5 Corporate Access
Corporate nav item and routes only render if the logged-in customer has `hasCorporateAccess`. Invoice column/links only appear for `VIEWER`/`BILLING` membership roles. If a trip has no `serviceAmount` set yet, show "Invoice not ready" instead of a broken link.

### 6.6 Admin Dashboard
KPI cards: totalCars, totalDrivers, totalVendors, totalCustomers, totalBookings, confirmed, totalRevenue. Charts: Revenue Trend (line, monthly), Bookings by Status (doughnut), Owned vs Vendor revenue split (doughnut). Alerts panel for cars/driver documents expiring within 30 days. Recent bookings table (6 rows).

### 6.7 Admin Fleet
Car CRUD with fields: make, model, registration, year, colour, type, seats, transmission, fuel, hourly/daily/monthly rates, ownership (OWNED/VENDOR) + vendor link, commission override, status, available/showOnSite toggles, feature tags, image URL. Car detail page manages documents (RC/INSURANCE/PERMIT/POLLUTION with expiry dates) and a photo gallery, each with upload/delete. Same pattern for Drivers (name, phone, licence + expiry, experience, category, employment type, vendor, hourly/daily/monthly charges, status, photo) and separately, Employees.

### 6.8 Admin Bookings
Full filterable list, inline status dropdown (`PENDING → CONFIRMED → COMPLETED / CANCELLED`), counter-booking creation for walk-ins or existing customers, a payments panel per booking (record amount/method/reference/date/notes; delete payment) showing paid vs balance.

### 6.9 Admin Corporate Trips
Modal-driven CRUD with fields: account, bookedBy, booker phone/email, passenger, scheduled pickup, expected completion, car, driver, status, pickup, destination, stops[] (dynamic list), waiting time, billing arrangement, project code/manager/coordinator, remarks, service amount, tax %, PO number, external reference. Status workflow strictly: `REQUESTED → ASSIGNED → CONFIRMED → IN_PROGRESS → COMPLETED`, with `CANCELLED` reachable from any non-terminal state. Include corporate account CRUD, membership CRUD (user + account + role + status), Excel export of all trips, and invoice generation once `serviceAmount` is set.

### 6.10 Admin Billing & Settlements
Generate settlement by vendor + period. Detail view: gross, commission, net payable. Status flow `DRAFT → FINALISED → PAID`. PDF + Excel export.

### 6.11 Admin Reports
Filters: date range, car, vendor, driver, customer category, ownership, booking status. Excel + PDF export. Separate vendor-wise and driver-wise report views.

### 6.12 Admin Settings
Organization profile form, system config form (tax %, commission %, currency, invoice prefix, settlement cycle, driver daily charge), category masters (VEHICLE/DRIVER/CUSTOMER types) with add/toggle/delete, test-email button, staff user management with a permission checkbox matrix (see Section 7), enable/disable + password reset actions.

### 6.13 Admin Live Tracking
Poll `/admin/tracking/data` on an interval (start with 10s, make configurable), plot markers with car name/lat/lng/speed/ignition state/last-updated timestamp, auto-refresh without full page reload, marker clustering if the fleet is large.

### 6.14 Reviews Moderation & Audit Log
Reviews: pending/approved list with approve/delete actions. Audit log: read-only table (admin-only route), filterable by date/user/action.

### 6.15 Vendor & Driver Portals
Vendor: dashboard KPIs from own trips only, read-only cars/drivers lists, trips with period filter, settlements list with PDF/Excel download. Driver: dashboard with upcoming + recent trips, full trip history, profile view, availability toggle (AVAILABLE ↔ OFF), change-password form.

---

## 7. AUTH & ROUTE GUARDS

Implement guard components exactly as:

| Guard | Access |
|---|---|
| `PublicRoute` | Marketing pages, `/cars` browse & detail |
| `CustomerRoute` | Role `CUSTOMER` |
| `AdminRoute` | Role `ADMIN` or `STAFF` |
| `AdminPermissionRoute` | `ADMIN`, or `STAFF` holding the specific required `Permission` |
| `VendorRoute` | Role `VENDOR` |
| `DriverRoute` | Role `DRIVER` |
| `CorporateRoute` | `CUSTOMER` with active corporate membership |
| `CorporateInvoiceRoute` | Membership role `VIEWER` or `BILLING` |

Staff permission enum: `MANAGE_FLEET`, `MANAGE_DRIVERS`, `MANAGE_VENDORS`, `MANAGE_BOOKINGS`, `MANAGE_BILLING`, `VIEW_REPORTS`, `MANAGE_CONFIG`, `MANAGE_USERS`.

Build the auth layer against a **unified token-based session** (JWT stored in memory + refresh, or httpOnly cookie session — pick one and be consistent) since the backend today uses 4 separate cookie-based login chains per portal; the React app should present as a single coherent auth system regardless of portal, calling one `/api/auth/*` surface (see Section 9).

---

## 8. JAVASCRIPT DOMAIN MODELS

This is a plain JavaScript project (no TypeScript compiler), but domain shapes still need to be defined once, documented, and reused everywhere — never inline ad hoc object shapes for the same entity in multiple places.

Create these in `shared/models/` as a combination of (a) exported **constant enums** for fixed value sets, and (b) **JSDoc `@typedef` blocks** for entity shapes, so editors (VS Code/WebStorm) still get autocomplete and inline docs via JSDoc IntelliSense even without TypeScript.

```javascript
// shared/models/enums.js

export const ROLES = ['ADMIN', 'STAFF', 'VENDOR', 'DRIVER', 'CUSTOMER'];

export const PERMISSIONS = [
  'MANAGE_FLEET', 'MANAGE_DRIVERS', 'MANAGE_VENDORS', 'MANAGE_BOOKINGS',
  'MANAGE_BILLING', 'VIEW_REPORTS', 'MANAGE_CONFIG', 'MANAGE_USERS',
];

export const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
export const RENTAL_UNITS = ['HOUR', 'DAY', 'MONTH'];

export const TRANSPORT_STATUSES = [
  'REQUESTED', 'ASSIGNED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED',
];

export const CORPORATE_MEMBER_ROLES = ['BOOKER', 'VIEWER', 'BILLING'];
export const BILLING_ARRANGEMENTS = ['BILL_TO_COMPANY', 'PAY_ON_TRIP', 'PREPAID', 'NOT_SET'];

export const CAR_TYPES = ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'LUXURY', 'BIKE'];
export const TRANSMISSIONS = ['MANUAL', 'AUTOMATIC'];
export const FUEL_TYPES = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG'];
export const CAR_STATUSES = ['ACTIVE', 'MAINTENANCE', 'RETIRED'];
export const CAR_OWNERSHIPS = ['OWNED', 'VENDOR'];
```

```javascript
// shared/models/typedefs.js — JSDoc-only file, no runtime exports needed beyond this comment block

/**
 * @typedef {Object} Car
 * @property {string} id
 * @property {string} make
 * @property {string} model
 * @property {string} registration
 * @property {number} year
 * @property {string} colour
 * @property {'HATCHBACK'|'SEDAN'|'SUV'|'MUV'|'LUXURY'|'BIKE'} type
 * @property {number} seats
 * @property {'MANUAL'|'AUTOMATIC'} transmission
 * @property {'PETROL'|'DIESEL'|'ELECTRIC'|'HYBRID'|'CNG'} fuel
 * @property {number} hourlyRate
 * @property {number} dailyRate
 * @property {number} monthlyRate
 * @property {'OWNED'|'VENDOR'} ownership
 * @property {string} [vendorId]
 * @property {number} [commissionOverride]
 * @property {'ACTIVE'|'MAINTENANCE'|'RETIRED'} status
 * @property {boolean} available
 * @property {boolean} showOnSite
 * @property {string[]} featureTags
 * @property {string} imageUrl
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} carId
 * @property {string} [driverId]
 * @property {string} customerId
 * @property {string} pickupDate
 * @property {string} returnDate
 * @property {'HOUR'|'DAY'|'MONTH'} rentalUnit
 * @property {string} pickupLocation
 * @property {string} dropLocation
 * @property {boolean} withDriver
 * @property {number} total
 * @property {number} amountPaid
 * @property {'PENDING'|'CONFIRMED'|'CANCELLED'|'COMPLETED'} status
 */

// Model the remaining entities the same way: Driver, Vendor, CorporateTrip,
// CorporateAccount, CorporateMember, Payment, Review, Category, Maintenance,
// Inspection, Staff, VehicleLocation, CarMedia, DriverMedia — matching the
// backend DTOs of the same names, inferring fields from the feature
// descriptions in Sections 5–6 above. Keep one @typedef per entity in this
// file so every feature module imports the same shared shape via JSDoc
// `@param {import('shared/models/typedefs').Car} car` annotations instead of
// redefining fields inline.
```

Use these JSDoc typedefs in function signatures and component prop docs (`/** @param {Car} car */`) so editor tooling can still catch shape mistakes at author-time even without a TypeScript build step. Do not reintroduce TypeScript files (`.ts`/`.tsx`) anywhere in the project.

---

## 9. API INTEGRATION STRATEGY

### 9.1 APIs that already exist — wire the Admin module directly to these (with an auth token attached via Axios interceptor):

```
/admin/api/cars           GET list, GET/:id, POST save, POST/:id/delete, GET/:id/media, POST documents/photos CRUD
/admin/api/drivers        GET, GET/:id, POST, DELETE, status, documents CRUD
/admin/api/employees      GET list
/admin/api/vendors        GET, GET/:id, POST, DELETE
/admin/api/bookings       GET, POST create, POST/:id/status, GET/:id/payments, POST payments CRUD
/admin/api/corporate-trips  Full CRUD + accounts + memberships + status
/admin/api/users          GET, GET/:id, POST, enable, password, delete
/admin/api/categories     GET, POST, toggle, delete
/admin/api/maintenance    GET, GET/:id, POST, delete
/admin/api/inspections    GET, GET/:id, POST, delete
/admin/api/reviews        GET, approve, delete
/admin/api/audit          GET
/admin/api/settings       POST organization, POST config
/admin/api/upload         POST file upload
/admin/tracking/data      GET JSON vehicle locations
/admin/corporate-trips/export  GET Excel
/admin/reports/**         GET Excel/PDF exports
/admin/settlements/**     PDF/Excel downloads
```

### 9.2 APIs that do NOT exist yet — build these features against a **mock service layer** (use MSW — Mock Service Worker — so the same fetch code runs unmodified once the real endpoints ship):

```
Auth (all portals):     POST /api/auth/login, /register, /logout, GET /api/auth/me, Google OAuth callback
Public cars:            GET /api/cars?filters, GET /api/cars/:id
Customer booking:       POST /api/bookings, GET /api/bookings/mine, price-preview endpoint
Customer invoice:       GET /api/bookings/:id/invoice, PDF blob endpoint
Reviews:                GET /api/cars/:id/reviews, POST /api/reviews
Corporate (customer):   GET /api/corporate-trips/mine, invoice endpoints
Home page data:         GET /api/home (featured cars, min rate, banners)
Contact form:           POST /api/contact
Vendor portal:          GET /api/vendor/dashboard, cars, drivers, trips, settlements
Driver portal:          GET /api/driver/dashboard, trips, profile, POST availability, POST password
Admin dashboard:        GET /api/admin/dashboard (KPIs + chart data)
Public config:          GET /api/config (currency symbol, org name)
```

Build every mock with realistic latency (300–800ms) and occasional realistic error responses (validation errors, 409 conflicts) so loading/error states get exercised during development — don't mock everything as instant and always-successful.

Isolate all mock handlers in `api/mocks/` behind a single feature flag (e.g., `VITE_USE_MOCKS`) so switching to the real backend later is a one-line change, not a rewrite.

---

## 10. BUILD ORDER (work through these phases in order; don't jump ahead to admin screens before the design system exists)

**Phase 1 — Foundation**
Tailwind theme extension with tokens from Section 1, the shared component library (Section 5), `PublicLayout` + `AdminLayout` shells, Axios client + interceptors, auth store, all route guards wired with placeholder pages so the full route tree resolves before content is built.

**Phase 2 — Customer Rental**
Home page + search widget, `/cars` browse + detail + booking + my-bookings + invoices, reviews.

**Phase 3 — Admin Core**
Dashboard, Cars, Drivers, Bookings — wired to the real `/admin/api/**` endpoints. Live tracking map.

**Phase 4 — Admin Extended**
Vendors, Employees, Maintenance, Inspections, Corporate Trips module, Settlements, Reports, Reviews moderation.

**Phase 5 — Portals + Marketing**
Vendor portal, Driver portal, marketing pages (About/Fleet/Services/Contact/etc.), PDF document routes.

**Phase 6 — Polish**
Full responsive QA pass, loading skeletons everywhere data loads, accessibility audit, RTL-readiness check (client logo suggests future Arabic support — don't build RTL now, but avoid hardcoded `left`/`right` where `start`/`end` logical properties would future-proof it), Playwright E2E smoke tests for the critical paths (login → browse → book → view invoice; admin login → create car → create booking).

At the end of each phase, summarize what was built, flag any assumptions made, and list anything that needs a real backend response to fully verify.

---

## 11. WHAT "DONE" LOOKS LIKE FOR EVERY SCREEN

Before considering any screen complete, verify:
- [ ] Matches the blue/white premium design language, not a generic template look
- [ ] Loading, empty, and error states are all designed (not just happy path)
- [ ] Fully responsive from 375px to 1440px+
- [ ] Keyboard accessible with visible focus states
- [ ] Uses shared components from Section 5, not one-off markup
- [ ] Uses shared API hooks (TanStack Query) from `api/` — no ad hoc inline `fetch`/`axios` calls in components
- [ ] Route guard applied per Section 7 where required
- [ ] No console warnings/errors

---

**Now build the project starting with Phase 1.** Confirm the existing Tailwind/React setup, then implement the design tokens and shared component library before writing any feature screens.