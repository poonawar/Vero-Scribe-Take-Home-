import { useState } from "react";
import { format, parseISO } from "date-fns";
import { visitReasons } from "../../data/mockData";

export default function PatientForm({ physician, slot, onSubmit, onBack }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    reason: "",
    otherReason: "",
    notes: "",
    isNewPatient: "yes",
  });
  const [errors, setErrors] = useState({});

  const isOther = form.reason === "Other";

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.dob) e.dob = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.reason) e.reason = "Please select a reason";
    if (isOther && !form.otherReason.trim()) e.otherReason = "Please describe your reason";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    //if "other", use the custom text as the reason
    const finalForm = {
      ...form,
      reason: isOther ? form.otherReason : form.reason,
    };
    onSubmit(finalForm);
  };

  return (
    <div className="step-container">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <div className="step-header">
        <span className="step-badge">Step 3 of 3</span>
        <h2>Your information</h2>
      </div>

      <div className="booking-summary-bar">
        <div className="summary-item">
          <span className="summary-label">Provider</span>
          <span className="summary-value">{physician.name}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Specialty</span>
          <span className="summary-value">{physician.specialty}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Date & Time</span>
          <span className="summary-value">
            {format(parseISO(slot.datetime), "EEE, MMM d · h:mm a")}
          </span>
        </div>
      </div>

      <form className="patient-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className={`form-group ${errors.firstName ? "has-error" : ""}`}>
            <label>First name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={set("firstName")}
              placeholder="Jane"
            />
            {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
          </div>
          <div className={`form-group ${errors.lastName ? "has-error" : ""}`}>
            <label>Last name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Smith"
            />
            {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className={`form-group ${errors.dob ? "has-error" : ""}`}>
            <label>Date of birth</label>
            <input type="date" value={form.dob} onChange={set("dob")} />
            {errors.dob && <span className="error-msg">{errors.dob}</span>}
          </div>
          <div className="form-group">
            <label>New patient?</label>
            <select value={form.isNewPatient} onChange={set("isNewPatient")}>
              <option value="yes">Yes, new patient</option>
              <option value="no">No, returning patient</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
            <label>Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="jane@example.com"
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>
          <div className={`form-group ${errors.phone ? "has-error" : ""}`}>
            <label>Phone number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="(416) 555-0100"
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>
        </div>

        <div className={`form-group ${errors.reason ? "has-error" : ""}`}>
          <label>Reason for visit</label>
          <select value={form.reason} onChange={set("reason")}>
            <option value="">Select a reason…</option>
            {visitReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.reason && <span className="error-msg">{errors.reason}</span>}
        </div>

        {isOther && (
          <div className={`form-group other-reason-field ${errors.otherReason ? "has-error" : ""}`}>
            <label>Please describe your reason</label>
            <input
              type="text"
              value={form.otherReason}
              onChange={set("otherReason")}
              placeholder="Describe your reason for visiting…"
              autoFocus
            />
            {errors.otherReason && <span className="error-msg">{errors.otherReason}</span>}
          </div>
        )}

        <div className="form-group">
          <label>
            Additional notes <span className="optional">(optional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={set("notes")}
            rows={3}
            placeholder="Any additional context for your provider…"
          />
        </div>

        <button type="submit" className="submit-btn">
          Request appointment →
        </button>
      </form>
    </div>
  );
}
