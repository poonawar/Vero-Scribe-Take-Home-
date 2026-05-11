/**
 CHOOSE YOUR PHYSICIAN:
 Providers with "acceptingNew: false" are rendered but disabled but I chose
 to show them (greyed out) rather than hide them. This gives
 patients visibility into who works at the practice and sets expectations.
 */

import {useApp} from "../../store/AppContext";

export default function ChoosePhysician({ onSelect }) {
  const { state } = useApp();

  return (
    <div className="step-container">
      <div className="step-header">
        <span className="step-badge">Step 1 of 3</span>
        <h2>Choose your physician</h2>
        <p>Select a provider you'd like to book with</p>
      </div>

      <div className="physician-grid">
        {state.physicians.map((doc) => (
          <button
            key={doc.id}
            className={`physician-card ${!doc.acceptingNew ? "not-accepting" : ""}`}
            onClick={() => doc.acceptingNew && onSelect(doc)}
            disabled={!doc.acceptingNew}
          >
            {/* Avatar uses the physician's brand colour from mock data */}
            <div className="physician-avatar" style={{ background: doc.color }}>
              {doc.avatar}
            </div>

            <div className="physician-info">
              <h3>{doc.name}</h3>
              <span className="specialty">{doc.specialty}</span>
              <p className="bio">{doc.bio}</p>

              {/*Only shown when not accepting, avoids confusion */}
              {!doc.acceptingNew && (
                <span className="not-accepting-badge">Not accepting new patients</span>
              )}
            </div>

            {/*Arrow only shown for selectable cards*/}
            {doc.acceptingNew && <div className="select-arrow">→</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
