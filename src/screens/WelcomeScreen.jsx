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

    // new: remembered custom minutes
    lastCustomMinutes,
    setLastCustomMinutes,
  } = useAppState();

  const [name, setNameLocal] = useState(userName || "");
  const [goalText, setGoalTextLocal] = useState(goal || "");
  const [touched, setTouched] = useState(false);

  // Start empty unless we have a remembered custom value
  const [customMinutes, setCustomMinutes] = useState(lastCustomMinutes || "");

  // Sync local inputs when context loads
  useEffect(() => {
    if (userName) setNameLocal(userName);
  }, [userName]);

  useEffect(() => {
    if (goal) setGoalTextLocal(goal);
  }, [goal]);

  // If lastCustomMinutes changes (from storage load), reflect it
  useEffect(() => {
    if (lastCustomMinutes) setCustomMinutes(lastCustomMinutes);
  }, [lastCustomMinutes]);

  const presets = [
    { label: "25 min", value: 25 },
    { label: "30 min", value: 30 },
    { label: "50 min", value: 50 },
  ];

  const minutesNumber = useMemo(() => Number(customMinutes), [customMinutes]);
  const customProvided = customMinutes.trim().length > 0;

  // validate custom minutes
  const minutesValid = useMemo(() => {
    // if custom is empty, treat as valid (we use preset/currentFocusMinutes)
    if (!customProvided) return true;
    return Number.isFinite(minutesNumber) && minutesNumber >= 5 && minutesNumber <= 180;
  }, [customProvided, minutesNumber]);

  const canStart =
    name.trim().length > 0 &&
    goalText.trim().length > 0 &&
    minutesValid;

  const canContinue =
    userName?.trim() &&
    goal?.trim() &&
    Number.isFinite(currentFocusMinutes) &&
    currentFocusMinutes >= 5;

  const start = () => {
    setTouched(true);
    if (!canStart) return;

    clearCurrentFlow?.();
    setUserName(name.trim());
    setGoal(goalText.trim());

    // Only override focus minutes if user typed custom minutes
    if (customProvided) {
      setCurrentFocusMinutes(Math.round(minutesNumber));
      // remember this custom value
      setLastCustomMinutes(customMinutes);
    }

    goTo("preMood");
  };

  const onKeyDownStart = (e) => {
    if (e.key === "Enter") start();
  };

  const endTimeLabel = useMemo(() => {
    // if user typed custom minutes, use that; else use currentFocusMinutes
    const usedMinutes = customProvided ? minutesNumber : currentFocusMinutes;

    if (!Number.isFinite(usedMinutes) || usedMinutes < 5) return null;

    const end = new Date(Date.now() + usedMinutes * 60000);
    return end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [customProvided, minutesNumber, currentFocusMinutes]);

  const resetAll = () => {
    setNameLocal("");
    setGoalTextLocal("");
    setCustomMinutes("");
    setTouched(false);

    setUserName("");
    setGoal("");
    setCurrentFocusMinutes(30);

    // clear remembered custom minutes too
    setLastCustomMinutes("");

    clearCurrentFlow?.();
  };

  return (
    <AppShell currentScreen={currentScreen} title="Mind Link">
      <div className="screen">
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

                  // clear ONLY the visible field (optional UX)
                  // (we still keep lastCustomMinutes remembered)
                  setCustomMinutes("");
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

                // remember as they type (even before pressing Start)
                setLastCustomMinutes(v);

                // live update selection only when valid
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

            {touched && customProvided && !minutesValid && (
              <small style={{ color: "#b42318" }}>
                Please enter a number between 5 and 180.
              </small>
            )}
          </div>

          <div className="preset-note">
            Selected: <b>{customProvided ? minutesNumber : currentFocusMinutes} min</b>
          </div>

          {endTimeLabel && (
            <div className="preset-note" style={{ marginTop: 6 }}>
              Ends at <b>{endTimeLabel}</b>
            </div>
          )}
        </div>

        {canContinue && (
          <button
            className="secondary"
            onClick={() => {
              clearCurrentFlow?.();
              goTo("preMood");
            }}
          >
            Continue Last Session
          </button>
        )}

        <button onClick={start} disabled={!canStart}>
          Start Focus Session
        </button>

        {!canStart && touched && (
          <div style={{ textAlign: "center", fontSize: 13, opacity: 0.7, marginTop: 8 }}>
            Fill name + goal (and custom minutes only if you use it).
          </div>
        )}

        <button type="button" className="secondary" onClick={resetAll}>
          Reset Setup
        </button>
      </div>
    </AppShell>
  );
}
