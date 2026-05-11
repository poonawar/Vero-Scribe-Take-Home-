/*

APPOINTMENT TIME SELECTION

Date is selected first - then time to avoid overloading the user.
 */

import { useState, useMemo } from "react";
import { format, parseISO, startOfDay, isSameDay } from "date-fns";
import { useApp } from "../../store/AppContext";

export default function SelectSlot({ physician, onSelect, onBack }) {
  const { state } = useApp();
  const [selectedDate, setSelectedDate] = useState(null);

  
  //filter to only this physician's unbooked slots.
  const availableSlots = useMemo(
    () => state.slots.filter((s) => s.physicianId === physician.id && !s.booked),
    [state.slots, physician.id]
  );

  //Capped at 10 to keep the sidebar scrollable

  const availableDates = useMemo(() => {
    const seen = new Set();
    const dates = [];
    availableSlots.forEach((s) => {
      const d = startOfDay(parseISO(s.datetime)).toISOString();
      if (!seen.has(d)) {
        seen.add(d);
        dates.push(parseISO(s.datetime));
      }
    });
    return dates.sort((a, b) => a - b).slice(0, 10);
  }, [availableSlots]);

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    return availableSlots
      .filter((s) => isSameDay(parseISO(s.datetime), selectedDate))
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  }, [availableSlots, selectedDate]);

  return (
    <div className="step-container">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <div className="step-header">
        <span className="step-badge">Step 2 of 3</span>
        <h2>Pick a time</h2>
        <p>Available appointments with <strong>{physician.name}</strong></p>
      </div>

      <div className="slot-layout">
        {/*left panel: date list */}
        <div className="date-list">
          <h4>Available dates</h4>
          {availableDates.map((date) => (
            <button
              key={date.toISOString()}
              className={`date-btn ${selectedDate && isSameDay(date, selectedDate) ? "active" : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="date-dow">{format(date, "EEE")}</span>
              <span className="date-mday">{format(date, "MMM d")}</span>
            </button>
          ))}
        </div>

        {/*right panel: time slots*/}
        <div className="time-panel">
          {!selectedDate ? (
            <div className="time-placeholder">
              <div className="placeholder-icon">📅</div>
              <p>Select a date to see available times</p>
            </div>
          ) : (
            <>
              <h4>{format(selectedDate, "EEEE, MMMM d")}</h4>
              <div className="time-grid">
                {slotsForDate.length === 0 ? (
                  <p className="no-slots">No times available on this date.</p>
                ) : (
                  slotsForDate.map((slot) => (
                    <button
                      key={slot.id}
                      className="time-btn"
                      onClick={() => onSelect(slot)}
                    >
                      {format(parseISO(slot.datetime), "h:mm a")}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
