/*

BOOKING CONFIRMATION

 Designed like something which can be screenshotted and saved by the patient.
 The "tear" divider mimics a physical appointment slip, which is familiar and
 /farmiliar/reassuring in a healthcare context.
 */

import { format, parseISO } from "date-fns";

export default function Confirmation({ booking, physician, slot, onNewBooking }) {
  const apptDate = parseISO(slot.datetime);

  return (
    <div className="step-container confirmation">

      {/*Success animation */}
      <div className="confirm-success-row">
        <div className="confirm-icon">✓</div>
        <div>
          <h2>You're booked!</h2>
          <p className="confirm-sub">
            Pending confirmation from {physician.name.split(" ")[0]}.
            We'll email <strong>{booking.patientInfo.email}</strong> once confirmed.
          </p>
        </div>
      </div>

      {/*appointment card */}
      <div className="appt-card">

        {/*header is coloured with the physician's brand colour */}
        <div className="appt-card-header" style={{ background: physician.color }}>
          <div className="appt-card-header-left">
            <div className="appt-card-avatar">{physician.avatar}</div>
            <div>
              <div className="appt-card-doctor">{physician.name}</div>
              <div className="appt-card-specialty">{physician.specialty}</div>
            </div>
          </div>
          <div className="appt-card-id">{booking.id}</div>
        </div>

        {/*divider*/}
        <div className="appt-card-perforation">
          <div className="perf-notch left" />
          <div className="perf-line" />
          <div className="perf-notch right" />
        </div>

        {/*card body*/}
        <div className="appt-card-body">
          <div className="appt-card-datetime">
            <div className="appt-card-day">{format(apptDate, "EEEE")}</div>
            <div className="appt-card-date">{format(apptDate, "MMMM d, yyyy")}</div>
            <div className="appt-card-time">{format(apptDate, "h:mm a")}</div>
          </div>

          <div className="appt-card-divider" />

          <div className="appt-card-details">
            <div className="appt-card-field">
              <span>Patient</span>
              <strong>{booking.patientInfo.firstName} {booking.patientInfo.lastName}</strong>
            </div>
            <div className="appt-card-field">
              <span>Reason</span>
              <strong>{booking.patientInfo.reason}</strong>
            </div>
            <div className="appt-card-field">
              <span>Status</span>
              <span className="status-badge pending">Pending confirmation</span>
            </div>
          </div>
        </div>

        {/*card footer*/}
        <div className="appt-card-footer">
          <span>🌸 Bloom Health</span>
          <span>Confirmation sent to {booking.patientInfo.email}</span>
        </div>
      </div>

      <button className="submit-btn outline" onClick={onNewBooking}>
        Book another appointment
      </button>
    </div>
  );
}
