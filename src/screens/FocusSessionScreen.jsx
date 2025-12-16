import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../context/AppStateContext";
import Timer from "../components/Timer";
import AppShell from "../components/AppShell";

function startOfDay(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function FocusSessionScreen({ goTo, currentScreen }) {
  const { currentFocusMinutes, goal, distractions, setDistractions, sessions } = useAppState();

  const [confirmEnd, setConfirmEnd] = useState(false);

  // start paused so timer shows full time first
  const [paused, setPaused] = useState(true);

  // increments each time you click +5
  const [addSignal, setAddSignal] = useState(0);

  // tiny feedback when +5 is clicked
  const [justAdded, setJustAdded] = useState(false);

  const logDistraction = (type) => {
    const item = { id: crypto.randomUUID(), type, at: Date.now() };
    setDistractions((prev) => [item, ...prev]);
  };

  const undoLast = () => {
    setDistractions((prev) => prev.slice(1)); // because you prepend newest first
  };

  const distractionSummary = useMemo(() => {
    const counts = {};
    for (const d of distractions) {
      const key = d?.type || "Other";
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => (v > 1 ? `${k} ×${v}` : k))
      .join(" • ");
  }, [distractions]);

  const today = startOfDay(Date.now());

  const todaySessions = useMemo(() => {
    return (sessions || []).filter((s) => startOfDay(s.timestamp) === today);
  }, [sessions, today]);

  const todayMinutes = useMemo(() => {
    return todaySessions.reduce((sum, s) => sum + (s.focusMinutes || 0), 0);
  }, [todaySessions]);

  useEffect(() => {
  const onKeyDown = (e) => {
    // don't trigger shortcuts while typing in inputs (safe)
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    if (e.key === " " ) {
      e.preventDefault();
      setPaused((p) => !p);
    }

    if (e.key === "Enter") {
      setAddSignal((x) => x + 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 900);
    }

    if (e.key === "1") logDistraction("Phone");
    if (e.key === "2") logDistraction("Noise");
    if (e.key === "3") logDistraction("Thoughts");
    if (e.key === "4") logDistraction("Other");

    if (e.key === "Escape") setConfirmEnd(false);
  };

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, []);


  return (
    <AppShell currentScreen={currentScreen} title="Focus Session">
      <div className="screen">
        <div className="info-card">
          <div className="info-title">Your Goal</div>
          <div className="info-value">{goal || "—"}</div>
        </div>

        <div className="info-card">
        <div className="info-title">Today</div>
        <div className="info-value">
          {todaySessions.length} sessions • {todayMinutes} minutes
        </div>
      </div>

        <div className={`timer-shell ${paused ? "paused" : ""}`}>
        <Timer
          durationMinutes={currentFocusMinutes}
          isPaused={paused}
          addSignal={addSignal}
          onComplete={() => goTo("postMood")}
        />
        </div>

        <div style={{ marginTop: 8, fontSize: 14, opacity: 0.7, textAlign: "center" }}>
          {paused ? "Session paused" : "Focus in progress"}
        </div>

        <div className="btn-row">
          <button className="secondary" onClick={() => setPaused((p) => !p)}>
            {paused ? "Start" : "Pause"}
          </button>

        {justAdded && (
          <div style={{ fontSize: 13, color: "#4f7cff", marginTop: 6, textAlign: "center" }}>
            +5 minutes added
          </div>
        )}  

        <button
          className="secondary"
          onClick={() => {
            setAddSignal((x) => x + 1);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 900);
          }}
        >
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

          <div
            style={{
              marginTop: 10,
              fontSize: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            {distractions.length === 0 ? (
              <span style={{ opacity: 0.75 }}>No distractions logged yet.</span>
            ) : (
              <span style={{ opacity: 0.85 }}>
                <b>{distractions.length}</b> logged • {distractionSummary}
              </span>
            )}

            <button
              type="button"
              className="secondary"
              style={{ width: "auto", padding: "8px 12px" }}
              disabled={distractions.length === 0}
              onClick={undoLast}
            >
              Undo
            </button>
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
