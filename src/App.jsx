/*ROOT COMPONENT + TOP LAYOUT
 */

import { AppProvider, useApp } from "./store/AppContext";
import PatientFlow from "./components/patient/PatientFlow";
import AdminDashboard from "./components/admin/AdminDashboard";
import "./styles/index.css";

function AppInner() {
  const { state, dispatch } = useApp();
  const setView = (v) => dispatch({ type: "SET_VIEW", payload: v });

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">🌸</div>
            <span>Bloom Health</span>
          </div>

          <nav className="nav-tabs">
            {/* Patient-facing booking flow */}
            <button
              className={`nav-tab ${state.view === "patient" ? "active" : ""}`}
              onClick={() => setView("patient")}
            >
              Book Appointment
            </button>

            {/*
             * Admin view
             */}
            <button
              className={`nav-tab ${state.view === "admin" ? "active" : ""}`}
              onClick={() => setView("admin")}
            >
              Admin View
              {state.bookings.filter((b) => b.status === "pending").length > 0 && (
                <span className="nav-badge">
                  {state.bookings.filter((b) => b.status === "pending").length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {state.view === "patient" ? <PatientFlow /> : <AdminDashboard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
