import { useAppState } from "../context/AppStateContext";
import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";

export default function WelcomeScreen({ goTo, currentScreen }) {
  const {
    userName,
    goal,
    setUserName,
    setGoal,
    setCurrentFocusMinutes,
    currentFocusMinutes,
    clearCurrentFlow,
  } = useAppState();

  const [name, setNameLocal] = useState(userName || "");
  const [goalText, setGoalTextLocal] = useState(goal || "");
  const [touched, setTouched] = useState(false);

  // ✅ Sync local inputs when context loads from localStorage
  useEffect(() => {
    if (userName) setNameLocal(userName);
  }, [userName]);

  useEffect(() => {
    if (goal) setGoalTextLocal(goal);
  }, [goal]);

  const canStart = name.trim().length > 0 && goalText.trim().length > 0;

  const presets = [
    { label: "25 min", value: 25 },
    { label: "30 min", value: 30 },
    { label: "50 min", value: 50 },
  ];

  const start = () => {
    setTouched(true);
    if (!canStart) return;

    clearCurrentFlow?.();
    setUserName(name.trim());
    setGoal(goalText.trim());

    goTo("preMood");
  };

  return (
    <AppShell currentScreen={currentScreen} title="Mind Link">
      <div className="screen">
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setNameLocal(e.target.value)}
          onBlur={() => setTouched(true)}
        />
        {touched && name.trim().length === 0 && (
          <small style={{ color: "#b42318" }}>Name is required.</small>
        )}

        <input
          placeholder="Study goal (e.g., Finish chapter 4)"
          value={goalText}
          onChange={(e) => setGoalTextLocal(e.target.value)}
          onBlur={() => setTouched(true)}
        />
        {touched && goalText.trim().length === 0 && (
          <small style={{ color: "#b42318" }}>Goal is required.</small>
        )}

        <div className="info-card">
          <div className="info-title">Choose session length</div>

          <div className="chip-row">
            {presets.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`chip ${currentFocusMinutes === p.value ? "selected" : ""}`}
                onClick={() => setCurrentFocusMinutes(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="preset-note">
            Selected: <b>{currentFocusMinutes} min</b>
          </div>
        </div>

        <button onClick={start} disabled={!canStart}>
          Start Focus Session
        </button>
      </div>
    </AppShell>
  );
}
