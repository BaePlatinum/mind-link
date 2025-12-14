import { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import Timer from "../components/Timer";
import AppShell from "../components/AppShell";

export default function FocusSessionScreen({ goTo, currentScreen }) {
  const { currentFocusMinutes, goal, distractions, setDistractions } = useAppState();

  const [confirmEnd, setConfirmEnd] = useState(false);

  // ✅ start paused so timer shows full time first
  const [paused, setPaused] = useState(true);

  // ✅ increments each time you click +5
  const [addSignal, setAddSignal] = useState(0);

  const logDistraction = (type) => {
    const item = { id: crypto.randomUUID(), type, at: Date.now() };
    setDistractions((prev) => [item, ...prev]);
  };

  return (
    <AppShell currentScreen={currentScreen} title="Focus Session">
      <div className="screen">
        <div className="info-card">
          <div className="info-title">Your Goal</div>
          <div className="info-value">{goal || "—"}</div>
        </div>

        <Timer
          durationMinutes={currentFocusMinutes}
          isPaused={paused}
          addSignal={addSignal}
          onComplete={() => goTo("postMood")}
        />

        <div className="btn-row">
          <button className="secondary" onClick={() => setPaused((p) => !p)}>
            {paused ? "Start" : "Pause"}
          </button>

          <button className="secondary" onClick={() => setAddSignal((x) => x + 1)}>
            +5 min
          </button>
        </div>

        <div className="info-card">
          <div className="info-title">Distraction Log</div>
          <div className="chip-row">
            {["Phone", "Noise", "Thoughts", "Other"].map((x) => (
              <button key={x} className="chip" onClick={() => logDistraction(x)}>
                {x}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 10, fontSize: 14 }}>
            {distractions.length === 0 ? (
              <span style={{ opacity: 0.75 }}>No distractions logged yet.</span>
            ) : (
              <span><b>{distractions.length}</b> logged</span>
            )}
          </div>
        </div>

        <button className="danger" onClick={() => setConfirmEnd(true)}>
          End Session Early
        </button>

        {confirmEnd && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 18,
            }}
          >
            <div
              style={{
                width: "min(420px, 92vw)",
                background: "#fff",
                borderRadius: 16,
                padding: 18,
                border: "1px solid #d7dbe3",
              }}
            >
              <h3 style={{ marginTop: 0 }}>End session now?</h3>
              <p style={{ marginTop: 0 }}>
                You can still record how you feel after the session.
              </p>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="secondary" onClick={() => setConfirmEnd(false)}>
                  Continue
                </button>
                <button onClick={() => goTo("postMood")}>End Session</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
