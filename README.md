# Vero Patient Booking Flow Work Sample

## Overview

This is a simple patient appointment booking workflow built for the Vero software engineering co-op work sample. It focuses on the requested product surface: physician selection, appointment availability, patient booking details, and an admin view for reviewing and updating booking status.

## How to Run

```bash
npm install
npm run dev
```

Patient flow: [http://localhost:3000](http://localhost:3000)

Admin view: [http://localhost:3000/admin](http://localhost:3000/admin)

## What I Built

- Patient-facing physician selection with physician details.
- Available appointment time selection from mock physician availability.
- Patient details and reason-for-visit form.
- Booking confirmation with a `pending` status.
- Admin/physician view for upcoming bookings.
- Confirm and cancel status actions.
- `localStorage` persistence so bookings survive refreshes during local testing.
- Prevention of duplicate active bookings for the same physician and time slot.
- Responsive layout for desktop and mobile review.

## Key Technical and Product Decisions

- Used `localStorage` instead of a database to keep the exercise lightweight and easy to run.
- Focused on the core workflow rather than production infrastructure.
- Used a simple booking status model: `pending`, `confirmed`, and `cancelled`.
- Treated `pending` and `confirmed` bookings as active, so they block the same physician/time slot. `cancelled` bookings do not block availability.
- Re-checks stored bookings when a request is submitted, which prevents duplicate active bookings even if the UI has stale state.
- Organized the patient flow in the natural order: choose physician, choose time, enter details, submit request.
- Built an admin view focused on the highest-value actions: reviewing, confirming, and cancelling bookings.
- Made phone optional because email is enough for this lightweight request flow, while phone remains available for patients who want to provide it.
- Avoided auth, calendar integration, notifications, payments, insurance, and AI features because they were outside the requested scope.

## What I Would Improve With More Time

- Backend API and database such as Postgres.
- Authentication and role-based access for patients and physicians.
- Server-side validation.
- Stronger race-condition handling around appointment availability.
- Email/SMS notifications.
- Calendar integration.
- Filtering/search in the admin view.
- Audit history for status changes.
- Unit tests for booking validation and status transitions.
- Accessibility testing with keyboard and screen readers.
