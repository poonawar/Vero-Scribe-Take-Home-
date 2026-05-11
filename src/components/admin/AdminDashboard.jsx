/*
 ADMIN VIEW
 This is where the physicians or admin staff would be able to see booking status/confirmations.
 
 Noteable Features:
 1. Gives at-a-glance stats
 2. Filtering tools: by status, physician or patient name
 3. Actionable items: confirm/cancel individual bookings 

 Polling/refresh ARE NOT required since all data comes from the shared global store (AppContext)
 */

import {useState, useMemo} from "react";
import {format, parseISO} from "date-fns";
import {useApp} from "../../store/AppContext";

//valid booking status options
const STATUS_OPTIONS = ["pending", "confirmed", "cancelled"];

 //mapping the booking status to the class name
const STATUS_COLORS = {
  pending:"pending",
  confirmed:"confirmed",
  cancelled:"cancelled",
};

export default function AdminDashboard() {
  const { state, dispatch } = useApp();
  //all the filters default to "show everything"
  const [filterStatus,    setFilterStatus]    = useState("all");
  const [filterPhysician, setFilterPhysician] = useState("all");
  const [search,          setSearch]          = useState("");

  //bookings are joined with the slot and the physicican data 
  const enrichedBookings = useMemo(() => {
    return state.bookings.map((b) => {
      const slot      = state.slots.find((s) => s.id === b.slotId);
      const physician = state.physicians.find((p) => p.id === slot?.physicianId);
      return { ...b, slot, physician };
    });
  }, [state.bookings, state.slots, state.physicians]);

  //filter sort searching
  const filtered = useMemo(() => {
    return enrichedBookings
      .filter((b) => filterStatus === "all" || b.status === filterStatus)
      .filter((b) => filterPhysician === "all" || b.physician?.id === filterPhysician)
      .filter((b) => {
        if (!search) return true;
        const q = search.toLowerCase();
        //search across name (first or last), email, or booking ID
        return (
          b.patientInfo.firstName.toLowerCase().includes(q) ||
          b.patientInfo.lastName.toLowerCase().includes(q)  ||
          b.patientInfo.email.toLowerCase().includes(q)     ||
          b.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(a.slot?.datetime) - new Date(b.slot?.datetime));
  }, [enrichedBookings, filterStatus, filterPhysician, search]);

  //summarized results on the admin dashboard for all bookings - intitially 0
  const stats = useMemo(() => {
    const counts = { pending: 0, confirmed: 0, cancelled: 0, total: 0 };
    enrichedBookings.forEach((b) => {
      counts[b.status]++;
      counts.total++;
    });
    return counts;
  }, [enrichedBookings]);

  //updates any changes to the global store
  const updateStatus = (bookingId, status) => {
    dispatch({ type: "UPDATE_BOOKING_STATUS", payload: { bookingId, status } });
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h2>Appointment Dashboard</h2>
        <p>Manage and review all incoming bookings</p>
      </div>

      {/* status result*/}
      <div className="stats-row">
        <div className="stat-card total">
          <span className="stat-num">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card pending-stat">
          <span className="stat-num">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card confirmed-stat">
          <span className="stat-num">{stats.confirmed}</span>
          <span className="stat-label">Confirmed</span>
        </div>
        <div className="stat-card cancelled-stat">
          <span className="stat-num">{stats.cancelled}</span>
          <span className="stat-label">Cancelled</span>
        </div>
      </div>

      {/* filtered section */}
      <div className="admin-filters">
        {/*use search to filter*/}
        <input
          className="search-input"
          type="text"
          placeholder="Search patient name, email, or booking ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterPhysician}
          onChange={(e) => setFilterPhysician(e.target.value)}
        >
          <option value="all">All providers</option>
          {state.physicians.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <div className="status-filters">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              className={`filter-pill ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No bookings found</h3>
          <p>
            {state.bookings.length === 0
              ? "Bookings created in the patient view will appear here."
              : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="bookings-table-wrap">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient</th>
                <th>Provider</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className={`row-${b.status}`}>

                  {/*booking ID: easy to read on phone/screenshot*/}
                  <td className="booking-id">{b.id}</td>

                  {/*patient name and email together so staff have contact info*/}
                  <td>
                    <div className="patient-cell">
                      <strong>{b.patientInfo.firstName} {b.patientInfo.lastName}</strong>
                      <span>{b.patientInfo.email}</span>
                    </div>
                  </td>

                  <td>
                    <div className="provider-cell">
                      <div className="mini-avatar" style={{ background: b.physician?.color }}>
                        {b.physician?.avatar}
                      </div>
                      <span>{b.physician?.name}</span>
                    </div>
                  </td>

                  {/* if the slot is somehow missing */}
                  <td className="datetime-cell">
                    {b.slot
                      ? format(parseISO(b.slot.datetime), "MMM d, yyyy · h:mm a")
                      : "—"}
                  </td>

                  <td className="reason-cell" title={b.patientInfo.reason}>
                    {b.patientInfo.reason}
                  </td>

                  <td>
                    <span className={`status-badge ${STATUS_COLORS[b.status]}`}>
                      {b.status}
                    </span>
                  </td>

                  {/*actionables: for pending/confirm/cancel */}
                  <td className="actions-cell">
                    {b.status === "pending" && (
                      <>
                        <button
                          className="action-btn confirm"
                          onClick={() => updateStatus(b.id, "confirmed")}
                        >
                          Confirm
                        </button>
                        <button
                          className="action-btn cancel"
                          onClick={() => updateStatus(b.id, "cancelled")}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {b.status === "confirmed" && (
                      <button
                        className="action-btn cancel"
                        onClick={() => updateStatus(b.id, "cancelled")}
                      >
                        Cancel
                      </button>
                    )}

                    {b.status === "cancelled" && (
                      <button
                        className="action-btn confirm"
                        onClick={() => updateStatus(b.id, "pending")}
                      >
                        Reopen
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
