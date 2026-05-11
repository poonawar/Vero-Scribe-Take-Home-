/**
 PATIENT FLOW PROCESS
 */

import {useState } from "react";
import {useApp} from "../../store/AppContext";
import Welcome from "./Welcome";
import ChoosePhysician from "./ChoosePhysician";
import SelectSlot from "./SelectSlot";
import PatientForm from "./PatientForm";
import Confirmation from "./Confirmation";

// Step names as constants — avoids magic strings scattered through the JSX
// "welcome" is prepended; it's not counted in the progress bar steps
const STEPS = ["welcome", "physician", "slot", "form", "confirm"];

export default function PatientFlow() {
  const { state, dispatch } = useApp();

  const [step, setStep] = useState("welcome");  // Start on welcome screen
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lastBooking, setLastBooking] = useState(null);

  const handleStart = () => setStep("physician");

  const handleSelectPhysician = (doc) => {
    setSelectedPhysician(doc);
    setStep("slot");
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setStep("form");
  };

  const handleSubmitForm = (patientInfo) => {
    const bookingId = `BK-${String(state.nextBookingId).padStart(4, "0")}`;

    dispatch({
      type: "CREATE_BOOKING",
      payload: { slotId: selectedSlot.id, patientInfo },
    });

    setLastBooking({
      id: bookingId,
      slotId: selectedSlot.id,
      patientInfo,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setStep("confirm");
  };

  /* reset everything so the patient can start a new booking */
  const handleNewBooking = () => {
    setStep("welcome");
    setSelectedPhysician(null);
    setSelectedSlot(null);
    setLastBooking(null);
  };

  const PROGRESS_STEPS = ["physician", "slot", "form", "confirm"];
  const stepIndex = PROGRESS_STEPS.indexOf(step);

  return (
    <div className="flow-wrapper">
      {step !== "confirm" && step !== "welcome" && (
        <div className="progress-bar">
          {["Choose provider", "Select time", "Your details"].map((label, i) => (
            <div
              key={label}
              className={`progress-step ${i < stepIndex ? "done" : ""} ${i === stepIndex ? "active" : ""}`}
            >
              <div className="progress-dot">
                {i < stepIndex ? "✓" : i + 1}
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}

      {step === "welcome" && (
        <Welcome onStart={handleStart} />
      )}

      {step === "physician" && (
        <ChoosePhysician onSelect={handleSelectPhysician} />
      )}

      {step === "slot" && selectedPhysician && (
        <SelectSlot
          physician={selectedPhysician}
          onSelect={handleSelectSlot}
          onBack={() => setStep("physician")}
        />
      )}

      {step === "form" && selectedPhysician && selectedSlot && (
        <PatientForm
          physician={selectedPhysician}
          slot={selectedSlot}
          onSubmit={handleSubmitForm}
          onBack={() => setStep("slot")}
        />
      )}

      {step === "confirm" && lastBooking && (
        <Confirmation
          booking={lastBooking}
          physician={selectedPhysician}
          slot={selectedSlot}
          onNewBooking={handleNewBooking}
        />
      )}
    </div>
  );
}
