# Bloom Health: Patient Booking App

A patient appointment booking flow built with React and Vite.

## How to run

bash\
npm install\
npm run dev

Then open [http://localhost:5173](http://localhost:5173) and book your "appointment".

## What I built

A two-sided booking system with:

### Patient view (3 steps)
1. **Choose a physician** Browse providers by specialty and see who's available
2. **Select a time slot** Showing real available slots (mock data with randomized availability across 2 weeks)
3. **Patient details form** Name, DOB, contact info, reason for visit and notes

After submission, a confirmation screen shows the booking ID and pending status.

### Admin / provider view
- Stats dashboard (total bookings/pending/confirmed/cancelled)
- Filterable, searchable table of all bookings
- One-click status updates: confirm, cancel, or reopen bookings
- Filters by provider and status; search by patient name, email, or booking ID

---

## Key technical & product decisions

**React + Vite** Fast setup, no unnecessary complexity.

**Mock data with realistic slot generation** Slots are generated at startup across 14 days, with 30% randomly removed to simulate real availability. Slots get marked when claimed, preventing double-booking within a session.

**No router** The app uses a "view" field in global state instead of URL routing. For this scope it keeps things simple; in production I'd use React Router so views are deep-linkable.

---

## What I'd improve with more time

- **Real calendar UI** A proper month-grid calendar (e.g. react-day-picker) would feel more natural than the date list
- **Email notifications** Trigger confirmation/cancellation emails when admin updates status
- **Auth** Patients get a link to view/cancel their bookings; admins can log in with credentials
- **URL routing** React Router so views are separately linkable and the back button works intuitively
