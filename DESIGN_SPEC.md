# Barber Shop Reservation System: Design Specification & Build Plan

**Project:** Barber Shop Reservation Web App  
**Author:** Manus AI  
**Date:** November 2025  
**Status:** Design Phase Complete

---

## Executive Summary

The Barber Shop Reservation System is a responsive, mobile-first web application designed to streamline appointment booking for barber clients and provide comprehensive management tools for barber administrators. The system enables clients to browse real-time availability, book haircut appointments with automatic slot blocking, and receive email confirmations. Barbers gain a centralized dashboard to manage bookings, set availability windows, view analytics, and send appointment reminders. Built with a modern tech stack (React + Express + tRPC + MySQL), the application prioritizes simplicity, security, and scalability while maintaining a professional barber-themed design aesthetic (black/gold color scheme with modern typography).

---

## Detailed User Stories

### Client User Stories

**Story 1: Browse & Book Appointment**  
As a client, I want to view available haircut time slots for the next 30 days so that I can find a convenient time to get a haircut. I should see the date, time, and service type, then select a slot to proceed with booking.

**Story 2: Complete Booking with Confirmation**  
As a client, I want to enter my name, phone number, and email when booking, then receive an immediate email confirmation with appointment details (date, time, barber location) so that I have proof of my reservation.

**Story 3: Manage My Bookings**  
As a client, I want to view my upcoming appointments in a personal dashboard, with options to reschedule or cancel at least 24 hours before the appointment. If I cancel, I should receive a confirmation email.

**Story 4: Receive Appointment Reminders**  
As a client, I want to receive an email reminder 24 hours before my appointment so that I don't forget and can reschedule if needed.

**Story 5: View Barber Information**  
As a client, I want to see the barber's location on a map, view a gallery of haircut styles, and read customer reviews (star ratings) so that I can feel confident about my choice.

### Barber (Admin) User Stories

**Story 6: Admin Dashboard Overview**  
As a barber, I want to log in to a dedicated admin dashboard where I can see all upcoming bookings in a calendar view, sorted by date and time, so that I can manage my schedule efficiently.

**Story 7: Manage Availability**  
As a barber, I want to set my working hours (e.g., 9 AM–6 PM, Monday–Saturday) and block specific days off (e.g., holidays, vacation) so that clients only see available slots.

**Story 8: Approve/Reject Bookings**  
As a barber, I want to review pending bookings and approve or reject them (with optional notes) so that I can control my schedule and communicate with clients.

**Story 9: View Client List & Analytics**  
As a barber, I want to see a list of all clients with their contact information and booking history, plus analytics showing busiest days/times and total bookings per month so that I can optimize my schedule and marketing.

**Story 10: Send Reminders & Notifications**  
As a barber, I want to manually send appointment reminders or cancellation notices to clients via email so that I can reduce no-shows.

---

## Wireframes: Key Screens

### Screen 1: Client Homepage & Booking Entry
```
┌─────────────────────────────────────────────────────┐
│  [Logo] Barber Shop Booking       [Login] [Sign Up] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  "Reserve Your Haircut Today"                       │
│                                                     │
│  Select Service:  [Basic Haircut ▼]                │
│  Select Date:     [Calendar Picker]                │
│  Available Times: [9:00 AM] [9:30 AM] [10:00 AM]  │
│                  [10:30 AM] [11:00 AM] ...         │
│                                                     │
│  [Book Now Button]                                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Gallery | Reviews | Location | FAQ                │
└─────────────────────────────────────────────────────┘
```

### Screen 2: Booking Confirmation Form
```
┌─────────────────────────────────────────────────────┐
│  Complete Your Booking                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Selected: Basic Haircut | Saturday, Nov 23, 10 AM │
│                                                     │
│  Full Name:    [_____________________]              │
│  Email:        [_____________________]              │
│  Phone:        [_____________________]              │
│                                                     │
│  Payment (Optional):                                │
│  ☐ Pay $10 deposit to hold slot (Stripe)          │
│                                                     │
│  [Cancel]  [Confirm Booking]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Screen 3: Client Dashboard (My Bookings)
```
┌─────────────────────────────────────────────────────┐
│  My Bookings                          [Logout]      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Upcoming Appointments:                             │
│  ┌─────────────────────────────────────────────┐   │
│  │ Basic Haircut                               │   │
│  │ Saturday, Nov 23, 2025 at 10:00 AM         │   │
│  │ Status: Confirmed                           │   │
│  │ [Reschedule] [Cancel]                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Past Appointments:                                 │
│  ┌─────────────────────────────────────────────┐   │
│  │ Basic Haircut                               │   │
│  │ Saturday, Nov 16, 2025 at 2:00 PM          │   │
│  │ [Leave Review]                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Screen 4: Admin Dashboard (Calendar & Bookings)
```
┌─────────────────────────────────────────────────────┐
│  Admin Dashboard                      [Logout]      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Calendar View] [List View]                        │
│                                                     │
│  November 2025                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Mo Tu We Th Fr Sa Su                        │   │
│  │                       1  2                  │   │
│  │  3  4  5  6  7  8  9                        │   │
│  │ 10 11 12 13 14 15 16                        │   │
│  │ 17 18 19 20 21 22 23 ← 3 bookings          │   │
│  │ 24 25 26 27 28 29 30                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Today's Bookings:                                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ 10:00 AM - John Doe - Basic Haircut        │   │
│  │ [Approve] [Reject] [Mark No-Show]          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Manage Availability] [Analytics] [Settings]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Screen 5: Admin Settings (Availability & Hours)
```
┌─────────────────────────────────────────────────────┐
│  Manage Availability                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Working Hours:                                     │
│  Monday - Friday:   [09:00] to [18:00]             │
│  Saturday:          [09:00] to [17:00]             │
│  Sunday:            [OFF]                          │
│                                                     │
│  Slot Duration: [30 minutes ▼]                     │
│                                                     │
│  Block Days Off:                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Nov 27 (Thanksgiving) - [Remove]            │   │
│  │ Dec 25 (Christmas) - [Remove]               │   │
│  └─────────────────────────────────────────────┘   │
│  [Add Block Day]                                    │
│                                                     │
│  [Save Changes]                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Data Model

### Database Schema

#### Users Table
| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| openId | VARCHAR(64) | UNIQUE, NOT NULL | Manus OAuth identifier |
| name | TEXT | | User's full name |
| email | VARCHAR(320) | | User's email address |
| phone | VARCHAR(20) | | User's phone number (clients only) |
| role | ENUM('user', 'admin') | DEFAULT 'user' | User type (client or barber) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Account creation date |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last profile update |
| lastSignedIn | TIMESTAMP | DEFAULT NOW() | Last login timestamp |

#### Services Table
| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique service identifier |
| name | VARCHAR(100) | NOT NULL | Service name (e.g., "Basic Haircut") |
| description | TEXT | | Service description |
| durationMinutes | INT | NOT NULL | Appointment duration in minutes |
| price | INT | | Price in cents (optional, for future payment) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Service creation date |

#### Availability Table
| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique availability window |
| dayOfWeek | INT | 0-6 (Sun-Sat) | Day of week |
| startTime | VARCHAR(5) | HH:MM format | Opening time |
| endTime | VARCHAR(5) | HH:MM format | Closing time |
| isOpen | BOOLEAN | DEFAULT TRUE | Whether barber is open |
| createdAt | TIMESTAMP | DEFAULT NOW() | |

#### BlockedDates Table
| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique block entry |
| date | DATE | NOT NULL | Blocked date |
| reason | TEXT | | Reason for block (e.g., holiday) |
| createdAt | TIMESTAMP | DEFAULT NOW() | |

#### Bookings Table
| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique booking identifier |
| clientId | INT | FOREIGN KEY (users.id) | Client who made booking |
| serviceId | INT | FOREIGN KEY (services.id) | Service booked |
| appointmentDate | DATE | NOT NULL | Appointment date |
| appointmentTime | VARCHAR(5) | HH:MM format | Appointment start time |
| status | ENUM('pending', 'confirmed', 'cancelled', 'no-show') | DEFAULT 'pending' | Booking status |
| clientName | VARCHAR(100) | | Client name (for walk-ins) |
| clientEmail | VARCHAR(320) | | Client email |
| clientPhone | VARCHAR(20) | | Client phone |
| notes | TEXT | | Admin notes |
| reminderSent | BOOLEAN | DEFAULT FALSE | Whether 24-hour reminder sent |
| createdAt | TIMESTAMP | DEFAULT NOW() | Booking creation time |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update time |

#### Reviews Table
| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique review identifier |
| bookingId | INT | FOREIGN KEY (bookings.id) | Associated booking |
| clientId | INT | FOREIGN KEY (users.id) | Reviewer |
| rating | INT | 1-5 | Star rating |
| comment | TEXT | | Review text |
| createdAt | TIMESTAMP | DEFAULT NOW() | Review date |

#### Gallery Table
| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique image identifier |
| imageUrl | TEXT | NOT NULL | S3 image URL |
| caption | VARCHAR(255) | | Image description |
| displayOrder | INT | | Sort order for gallery |
| createdAt | TIMESTAMP | DEFAULT NOW() | Upload date |

---

## Step-by-Step Build Guide

### Phase 1: Database Schema & Core Setup (Hours 1-2)

**Step 1.1:** Update `drizzle/schema.ts` with all tables listed above (users, services, availability, blockedDates, bookings, reviews, gallery).

**Step 1.2:** Run `pnpm db:push` to migrate schema to the database.

**Step 1.3:** Create seed data script (`seed-db.mjs`) to populate default services (Basic Haircut, Beard Trim) and default availability (9 AM–6 PM, Mon–Sat).

**Step 1.4:** Add database query helpers in `server/db.ts` for common operations:
- `getAvailableSlots(date, serviceId)` → returns list of open time slots
- `createBooking(clientId, serviceId, date, time, clientDetails)` → creates booking
- `getBookingsByDate(date)` → returns all bookings for a date
- `getClientBookings(clientId)` → returns client's upcoming bookings
- `updateBookingStatus(bookingId, status)` → updates booking status
- `getReviews()` → returns all reviews with ratings

### Phase 2: Authentication & User Roles (Hours 2-3)

**Step 2.1:** Verify Manus OAuth is configured (already set up in template). Test login/logout flow.

**Step 2.2:** Create role-based access control:
- Add `adminProcedure` in `server/routers.ts` that checks `ctx.user.role === 'admin'`
- Ensure only users with `role='admin'` can access admin endpoints

**Step 2.3:** Create tRPC procedures for auth:
- `auth.me` → returns current user (public)
- `auth.logout` → clears session (already exists)
- `auth.updateProfile` → allows clients to update phone/email (protected)

### Phase 3: Client Booking Flow (Hours 3-5)

**Step 3.1:** Create tRPC procedures:
- `bookings.getAvailableSlots(date, serviceId)` → public, returns open slots
- `bookings.create(serviceId, date, time, clientName, clientEmail, clientPhone)` → public, creates booking
- `bookings.getMyBookings()` → protected, returns user's bookings
- `bookings.cancel(bookingId)` → protected, cancels booking if >24 hours away
- `bookings.reschedule(bookingId, newDate, newTime)` → protected, reschedules booking

**Step 3.2:** Build frontend pages:
- `client/src/pages/BookingPage.tsx` → service selection, date/time picker, booking form
- `client/src/pages/MyBookings.tsx` → dashboard showing client's appointments
- `client/src/pages/BookingConfirmation.tsx` → confirmation screen after booking

**Step 3.3:** Implement date/time picker UI using shadcn/ui components (Calendar, Select).

**Step 3.4:** Add form validation for email, phone, name fields.

### Phase 4: Admin Dashboard (Hours 5-7)

**Step 4.1:** Create tRPC admin procedures:
- `admin.getBookings(date?)` → returns all bookings (admin only)
- `admin.getClients()` → returns list of all clients (admin only)
- `admin.updateBookingStatus(bookingId, status, notes?)` → approve/reject/mark no-show (admin only)
- `admin.getAvailability()` → returns current availability settings (admin only)
- `admin.updateAvailability(dayOfWeek, startTime, endTime)` → updates hours (admin only)
- `admin.blockDate(date, reason)` → blocks a date (admin only)
- `admin.getAnalytics()` → returns booking stats (admin only)

**Step 4.2:** Build admin pages using DashboardLayout:
- `client/src/pages/AdminDashboard.tsx` → calendar view of bookings
- `client/src/pages/AdminClients.tsx` → client list with booking history
- `client/src/pages/AdminSettings.tsx` → manage hours, block days
- `client/src/pages/AdminAnalytics.tsx` → booking stats, busiest days

**Step 4.3:** Implement calendar component (use shadcn/ui Calendar or integrate a library like react-big-calendar).

**Step 4.4:** Add role-based routing in `App.tsx` to show admin pages only to users with `role='admin'`.

### Phase 5: Notifications & Integrations (Hours 7-8)

**Step 5.1:** Set up email notifications using Manus built-in notification API:
- Booking confirmation email (sent immediately after booking)
- Appointment reminder email (sent 24 hours before)
- Cancellation confirmation email (sent when client cancels)

**Step 5.2:** Create background job (or use tRPC mutation) to send reminders:
- Query all bookings with `appointmentDate = tomorrow` and `reminderSent = false`
- Send email to client
- Update `reminderSent = true`

**Step 5.3:** (Optional) Integrate Stripe for optional $10 deposit:
- Add `depositPaid` boolean field to bookings table
- Create Stripe payment flow in booking form
- Update booking status to "confirmed" only after payment

### Phase 6: Gallery, Reviews & Location (Hours 8-9)

**Step 6.1:** Create tRPC procedures:
- `gallery.getImages()` → public, returns gallery images
- `reviews.getAll()` → public, returns all reviews with ratings
- `reviews.create(bookingId, rating, comment)` → protected, allows clients to leave reviews

**Step 6.2:** Build frontend components:
- `client/src/components/Gallery.tsx` → image carousel/grid
- `client/src/components/Reviews.tsx` → star ratings and comments
- `client/src/components/Map.tsx` → Google Maps showing barber location (use built-in Map component)

**Step 6.3:** Add gallery management to admin dashboard (upload images, reorder, delete).

### Phase 7: UI/UX Polish & Testing (Hours 9-10)

**Step 7.1:** Apply barber-themed design:
- Color scheme: Black (#1a1a1a) and Gold (#d4af37) with white accents
- Typography: Modern sans-serif (e.g., Inter, Poppins)
- Icons: Scissors, calendar, clock, user, settings
- Update `client/src/index.css` with theme colors

**Step 7.2:** Ensure mobile responsiveness:
- Test all pages on mobile (375px width)
- Use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`)
- Ensure touch-friendly buttons and spacing

**Step 7.3:** Write Vitest tests:
- Test booking creation (success and edge cases)
- Test availability slot generation
- Test admin procedures (role-based access)
- Test email notification triggers

**Step 7.4:** Manual testing:
- Book appointment as client, verify confirmation email
- Cancel appointment, verify cancellation email
- Admin approve/reject bookings
- Verify 24-hour reminder email
- Test on mobile and desktop browsers

### Phase 8: Deployment & Launch (Hour 10)

**Step 8.1:** Create checkpoint with `webdev_save_checkpoint`.

**Step 8.2:** Deploy via Manus (click Publish button in Management UI).

**Step 8.3:** Test live URL on mobile and desktop.

**Step 8.4:** Share demo URL with barber for feedback.

---

## Launch Plan

### Hosting & Domain
- **Platform:** Manus (auto-deployed after checkpoint)
- **Domain:** Auto-generated `xxx.manus.space` or custom domain via Management UI
- **SSL/HTTPS:** Automatic (required for payment processing)
- **Uptime:** 99.9% SLA

### Pre-Launch Checklist
- [ ] Database schema migrated and seeded
- [ ] All tRPC procedures tested and working
- [ ] Email notifications configured and tested
- [ ] Admin user promoted to `role='admin'` in database
- [ ] Gallery images uploaded (at least 3-5 photos)
- [ ] Barber location set in Map component
- [ ] Mobile responsiveness verified
- [ ] All user flows tested end-to-end
- [ ] Vitest suite passing (>80% coverage)

### Testing Strategy
1. **Functional Testing:** Book appointment, cancel, reschedule, review
2. **Admin Testing:** Approve/reject bookings, set availability, view analytics
3. **Email Testing:** Verify confirmation, reminder, cancellation emails arrive
4. **Mobile Testing:** Test on iOS Safari and Android Chrome
5. **Performance:** Verify page load time <3 seconds

### Marketing Tips for Barber
1. **Social Media:** Share booking link on Instagram, Facebook with "Book Now" CTA
2. **Email:** Send booking link to existing clients
3. **In-Store:** Display QR code linking to booking page
4. **Google Business:** Add booking link to Google Business Profile
5. **Incentives:** Offer first-time booking discount code (implement in future phase)

---

## Potential Future Upgrades

### Upgrade 1: Loyalty Program
- Add `loyaltyPoints` field to users table
- Award points per booking (e.g., 10 points per $50 spent)
- Allow clients to redeem points for discounts
- Display points balance in client dashboard

### Upgrade 2: SMS Notifications
- Integrate Twilio for SMS reminders and confirmations
- Allow clients to opt-in to SMS vs. email
- Send SMS reminder 2 hours before appointment (in addition to 24-hour email)

### Upgrade 3: Staff Management
- Extend schema to support multiple barbers
- Allow clients to choose preferred barber
- Each barber has separate availability and booking calendar
- Admin can assign bookings to specific barbers

### Upgrade 4: Waitlist & Cancellation Alerts
- Implement waitlist for fully booked time slots
- Auto-notify waitlisted clients if slot becomes available
- Allow clients to join waitlist and receive SMS/email alerts

### Upgrade 5: Recurring Appointments
- Allow clients to book recurring appointments (weekly, bi-weekly, monthly)
- Auto-create bookings for recurring appointments
- Admin can manage recurring appointment series

---

## Tech Stack Summary

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend | React 19 + Tailwind CSS 4 | Modern, responsive, component-based |
| Backend | Express 4 + tRPC 11 | Type-safe RPC, minimal boilerplate |
| Database | MySQL (TiDB) | Reliable, scalable relational database |
| Authentication | Manus OAuth | Built-in, secure, no setup required |
| Deployment | Manus | Auto-deployed, HTTPS, CDN included |
| Notifications | Manus Built-in API | Email delivery, no external service |
| Maps | Google Maps API (via Manus proxy) | Location display, no API key needed |
| Payments (Optional) | Stripe | Industry standard, PCI compliant |
| Testing | Vitest | Fast, modern, TypeScript-first |
| UI Components | shadcn/ui | Accessible, customizable, Tailwind-based |

---

## Security Considerations

1. **Authentication:** Manus OAuth ensures secure login; session cookies are httpOnly and secure.
2. **Authorization:** Role-based access control via `adminProcedure` prevents unauthorized admin access.
3. **Data Privacy:** All bookings and client data stored in encrypted database; no data shared with third parties.
4. **HTTPS:** All traffic encrypted in transit; required for payment processing.
5. **SQL Injection:** Drizzle ORM with parameterized queries prevents SQL injection.
6. **CSRF Protection:** tRPC handles CSRF tokens automatically.
7. **Rate Limiting:** Implement rate limiting on booking creation to prevent spam (future enhancement).

---

## Estimated Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Database & Setup | 2 hours | Schema migrated, seed data loaded |
| 2. Auth & Roles | 1 hour | OAuth configured, role-based access working |
| 3. Client Booking | 2 hours | Booking flow complete, confirmation emails sent |
| 4. Admin Dashboard | 2 hours | Calendar view, booking management, analytics |
| 5. Notifications | 1 hour | Email reminders, confirmations working |
| 6. Gallery & Reviews | 1 hour | Gallery, reviews, map integrated |
| 7. Polish & Testing | 1 hour | UI themed, mobile responsive, tests passing |
| 8. Deployment | 0.5 hours | Live on Manus, demo URL ready |
| **Total** | **10.5 hours** | **Production-ready app** |

---

## Conclusion

This barber shop reservation system provides a complete, user-friendly solution for appointment booking and management. By leveraging modern web technologies and following a phased build approach, the system can be deployed within 1-2 days. The design prioritizes simplicity, security, and mobile responsiveness, ensuring both clients and barbers have a seamless experience. Future upgrades (loyalty programs, SMS notifications, multi-staff support) can be added incrementally without disrupting the core system.

