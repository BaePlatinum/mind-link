import { useAppState } from "../context/AppStateContext";

export default function DashboardScreen({ goTo }) {
  const { sessions } = useAppState();

  return (
    <div className="screen">
      <h2>Your Study Sessions</h2>

      {sessions.length === 0 && <p>No sessions yet.</p>}

      {sessions.map((s) => (
        <div key={s.id} className="session-card">
          <p><b>Date:</b> {new Date(s.timestamp).toLocaleString()}</p>
          <p><b>Focus:</b> {s.focusMinutes} minutes</p>
          <p><b>Mood:</b> {s.postMood.mood}</p>
        </div>
      ))}

      <button onClick={() => goTo("welcome")}>
        New Session
      </button>
    </div>
  );
}
