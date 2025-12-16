import { useMemo, useState } from "react";
import { useAppState } from "../context/AppStateContext";
import AppShell from "../components/AppShell";

export default function PostMoodScreen({ goTo, currentScreen }) {
  const [mood, setMood] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [helpful, setHelpful] = useState(null);

  const {
    addSession,
    currentFocusMinutes,
    preMoodData,
    distractions,
    clearCurrentFlow,
  } = useAppState();

  // ✅ One helper for the emoji label text
  const levelText = (v) =>
    v === 1
      ? "😩 very low"
      : v === 2
      ? "😟 low"
      : v === 3
      ? "😐 neutral"
      : v === 4
      ? "🙂 high"
      : v === 5
      ? "🔥 very high"
      : "";

  // ✅ Nice: different labels for fatigue (optional but makes sense)
  const fatigueText = (v) =>
    v === 1
      ? "😌 very low"
      : v === 2
      ? "🙂 low"
      : v === 3
      ? "😐 medium"
      : v === 4
      ? "😮 high"
      : v === 5
      ? "🥱 very high"
      : "";

  const moodHint = useMemo(() => levelText(mood), [mood]);
  const motivationHint = useMemo(() => levelText(motivation), [motivation]);
  const fatigueHint = useMemo(() => fatigueText(fatigue), [fatigue]);

  const finish = () => {
    const sessionObj = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      focusMinutes: currentFocusMinutes,
      preMood: preMoodData,
      postMood: { mood, motivation, fatigue },
      helpful,
      distractions,
    };

    addSession(sessionObj);
    clearCurrentFlow();
    goTo("dashboard");
  };

  return (
    <AppShell currentScreen={currentScreen} title="Wrap-up">
      <div className="screen">
        <h2 className="post-title">How do you feel now?</h2>

        {/* ✅ Mood */}
        <label className="range-label">
          <span className="range-left">Mood</span>
          <span className="range-mid">{mood}</span>
          <span className="range-hint">{moodHint}</span>
        </label>
        <input
          type="range"
          autoFocus
          min="1"
          max="5"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
        />

        {/* ✅ Motivation (FIX: was using mood before) */}
        <label className="range-label">
          <span className="range-left">Motivation</span>
          <span className="range-mid">{motivation}</span>
          <span className="range-hint">{motivationHint}</span>
        </label>
        <input
          type="range"
          autoFocus
          min="1"
          max="5"
          value={motivation}
          onChange={(e) => setMotivation(Number(e.target.value))}
        />

        {/* ✅ Fatigue (FIX: was using mood before) */}
        <label className="range-label">
          <span className="range-left">Fatigue</span>
          <span className="range-mid">{fatigue}</span>
          <span className="range-hint">{fatigueHint}</span>
        </label>
        <input
          type="range"
          autoFocus
          min="1"
          max="5"
          value={fatigue}
          onChange={(e) => setFatigue(Number(e.target.value))}
        />

        {/* ✅ Helpful / Not helpful + Finish */}
        <div className="post-actions">
          <div className="helpful-row">
            <button
              type="button"
              className={`choice-btn ${helpful === true ? "active" : ""}`}
              onClick={() => setHelpful(true)}
            >
              Helpful
            </button>

            <button
              type="button"
              className={`choice-btn ${helpful === false ? "active" : ""}`}
              onClick={() => setHelpful(false)}
            >
              Not helpful
            </button>
          </div>

          <button
            type="button"
            className="finish-btn"
            onClick={finish}
            disabled={helpful === null}
          >
            Finish Session
          </button>

          {helpful === null && (
            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                opacity: 0.75,
                marginTop: 8,
              }}
            >
              Please select <b>Helpful</b> or <b>Not helpful</b> to finish.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
