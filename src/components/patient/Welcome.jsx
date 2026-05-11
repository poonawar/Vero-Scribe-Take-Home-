/*
 Brief welcome screen to set a warm tone which matters for healthcare UX where patients may
 feel anxious.
 */

export default function Welcome({ onStart }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-flower" aria-hidden="true">
        <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="60" cy="32" rx="14" ry="24"
              fill="#F5849A"
              opacity="0.88"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={`s${deg}`}
              cx="60" cy="36" rx="7" ry="12"
              fill="#FADADD"
              opacity="0.55"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
          <circle cx="60" cy="60" r="16" fill="#FFEAA7"/>
          <circle cx="60" cy="60" r="10" fill="#F5C842"/>
          <circle cx="60" cy="60" r="5"  fill="#E8A800"/>
        </svg>
      </div>

      <div className="welcome-text">
        <div className="welcome-brand">Bloom Health</div>
        <h1 className="welcome-headline">
          Healthcare that<br />
          <em>feels human.</em>
        </h1>
        <p className="welcome-sub">
          Book an appointment with a trusted physician in seconds.
          No holds. No paperwork. No stress.
        </p>
      </div>

      <button className="welcome-cta" onClick={onStart}>
        Book an appointment now
        <span className="cta-arrow">→</span>
      </button>

      <div className="welcome-trust">
        <span>🩺 Specialist physicians</span>
        <span>📅 Available this week</span>
        <span>✅ Instant confirmation</span>
      </div>
    </div>
  );
}
