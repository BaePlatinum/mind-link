import { useAppState } from "../context/AppStateContext";
import { useEffect, useMemo, useState } from "react";
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

  // ✅ IMPORTANT: start EMPTY so it doesn't show "30"
  const [customMinutes, setCustomMinutes] = useState("");

  // ✅ Sync local inputs when context loads
  useEffect(() => {
    if (userName) setNameLocal(userName);
  }, [userName]);

  useEffect(() => {
    if (goal) setGoalTextLocal(goal);
  }, [goal]);

  const presets = [
    { label: "25 min", value: 25 },
    { label: "30 min", value: 30 },
    { label: "50 min", value: 50 },
  ];

  // ✅ If custom is empty => it's valid (we will use preset/default)
  const minutesNumber = useMemo(() => Number(customMinutes), [customMinutes]);
  const customProvided = customMinutes.trim().length > 0;
  const customValid =
    !customProvided ||
    (Number.isFinite(minutesNumber) && minutesNumber >= 5 && minutesNumber <= 180);

  const canStart =
    name.trim().length > 0 &&
    goalText.trim().length > 0 &&
    customValid;

  const start = () => {
    setTouched(true);
    if (!canStart) return;

    clearCurrentFlow?.();
    setUserName(name.trim());
    setGoal(goalText.trim());

    // ✅ Only override focus minutes if user actually typed a custom value
    if (customProvided) {
      setCurrentFocusMinutes(Math.round(minutesNumber));
    }

    goTo("preMood");
  };

  // ✅ Enter key starts (only if valid)
  const onKeyDownStart = (e) => {
    if (e.key === "Enter") start();
  };

  return (
    <AppShell currentScreen={currentScreen} title="Mind Link">
      <div className="screen">
        {/* ✅ Friendly welcome back */}
        {userName?.trim() ? (
          <div style={{ textAlign: "center", marginBottom: 10, opacity: 0.75 }}>
            Welcome back, <b>{userName}</b> 👋
          </div>
        ) : null}

        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setNameLocal(e.target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={onKeyDownStart}
        />
        {touched && name.trim().length === 0 && (
          <small style={{ color: "#b42318" }}>Name is required.</small>
        )}

        <input
          placeholder="Study goal (e.g., Finish chapter 4)"
          value={goalText}
          onChange={(e) => setGoalTextLocal(e.target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={onKeyDownStart}
        />
        {touched && goalText.trim().length === 0 && (
          <small style={{ color: "#b42318" }}>Goal is required.</small>
        )}

        <div className="info-card">
          <div className="info-title">Choose session length</div>

          {/* Presets */}
          <div className="chip-row">
            {presets.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`chip ${currentFocusMinutes === p.value ? "selected" : ""}`}
                onClick={() => {
                  setCurrentFocusMinutes(p.value);
                  setCustomMinutes(""); // ✅ clicking preset clears custom field
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom minutes */}
          <div className="custom-minutes">
            <label className="custom-minutes-label">Custom (5–180 min)</label>
            <input
              className="custom-minutes-input"
              inputMode="numeric"
              placeholder="e.g., 42"
              value={customMinutes}
              onChange={(e) => {
                const v = e.target.value.replace(/[^\d]/g, "");
                setCustomMinutes(v);

                // ✅ live update selection only when valid
                if (v.length) {
                  const n = Number(v);
                  if (Number.isFinite(n) && n >= 5 && n <= 180) {
                    setCurrentFocusMinutes(n);
                  }
                }
              }}
              onBlur={() => setTouched(true)}
              onKeyDown={onKeyDownStart}
            />

            {touched && customProvided && !customValid && (
              <small style={{ color: "#b42318" }}>
                Please enter a number between 5 and 180.
              </small>
            )}
          </div>

          <div className="preset-note">
            Selected: <b>{currentFocusMinutes} min</b>
          </div>
        </div>

        <button onClick={start} disabled={!canStart}>
          Start Focus Session
        </button>

        {!canStart && touched && (
          <div style={{ textAlign: "center", fontSize: 13, opacity: 0.7, marginTop: 8 }}>
            Fill name + goal (and custom minutes only if you use it).
          </div>
        )}
      </div>
    </AppShell>
  );
}
