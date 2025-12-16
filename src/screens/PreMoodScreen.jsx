import { useMemo, useState } from "react";
import { useAppState } from "../context/AppStateContext";
import AppShell from "../components/AppShell";

export default function PreMoodScreen({ goTo, currentScreen }) {
  const [mood, setMood] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [note, setNote] = useState("");

  // ✅ validation: user must touch something before starting
  const [touched, setTouched] = useState({
    mood: false,
    motivation: false,
    fatigue: false,
    note: false,
  });

  const { setPreMoodData } = useAppState();

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

  const canStart = touched.mood || touched.motivation || touched.fatigue || touched.note;

  const next = () => {
    setPreMoodData({ mood, motivation, fatigue, note });
    goTo("focus");
  };

  // ✅ quick presets (simple + consistent)
  const setPreset = (setter, key, value) => {
    setter(value);
    setTouched((t) => ({ ...t, [key]: true }));
  };

  return (
    <AppShell currentScreen={currentScreen} title="Check-in">
      <div className="screen">
        <h2 className="post-title" style={{ textAlign: "center", margin: 0 }}>
          How are you feeling before studying?
        </h2>

        {/* Mood */}
        <label className="range-label">
          <span className="range-left">Mood</span>
          <span className="range-mid">{mood}</span>
          <span className="range-hint">{moodHint}</span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={mood}
          onChange={(e) => {
            setMood(Number(e.target.value));
            setTouched((t) => ({ ...t, mood: true }));
          }}
        />
        <div className="chip-row" style={{ marginTop: -10, marginBottom: 8, justifyContent: "center" }}>
          <button type="button" className="chip" onClick={() => setPreset(setMood, "mood", 1)}>
            Low
          </button>
          <button type="button" className="chip" onClick={() => setPreset(setMood, "mood", 3)}>
            Neutral
          </button>
          <button type="button" className="chip" onClick={() => setPreset(setMood, "mood", 5)}>
            High
          </button>
        </div>

        {/* Motivation */}
        <label className="range-label">
          <span className="range-left">Motivation</span>
          <span className="range-mid">{motivation}</span>
          <span className="range-hint">{motivationHint}</span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={motivation}
          onChange={(e) => {
            setMotivation(Number(e.target.value));
            setTouched((t) => ({ ...t, motivation: true }));
          }}
        />
        <div className="chip-row" style={{ marginTop: -10, marginBottom: 8, justifyContent: "center" }}>
          <button type="button" className="chip" onClick={() => setPreset(setMotivation, "motivation", 1)}>
            Low
          </button>
          <button type="button" className="chip" onClick={() => setPreset(setMotivation, "motivation", 3)}>
            Neutral
          </button>
          <button type="button" className="chip" onClick={() => setPreset(setMotivation, "motivation", 5)}>
            High
          </button>
        </div>

        {/* Fatigue */}
        <label className="range-label">
          <span className="range-left">Fatigue</span>
          <span className="range-mid">{fatigue}</span>
          <span className="range-hint">{fatigueHint}</span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={fatigue}
          onChange={(e) => {
            setFatigue(Number(e.target.value));
            setTouched((t) => ({ ...t, fatigue: true }));
          }}
        />
        <div className="chip-row" style={{ marginTop: -10, marginBottom: 8, justifyContent: "center" }}>
          <button type="button" className="chip" onClick={() => setPreset(setFatigue, "fatigue", 1)}>
            Fresh
          </button>
          <button type="button" className="chip" onClick={() => setPreset(setFatigue, "fatigue", 3)}>
            Medium
          </button>
          <button type="button" className="chip" onClick={() => setPreset(setFatigue, "fatigue", 5)}>
            Tired
          </button>
        </div>

        <textarea
          placeholder="Notes (optional)"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setTouched((t) => ({ ...t, note: true }));
          }}
          rows={3}
        />

        <div className="start-session-wrap">
          <button className="start-session-btn" onClick={next} disabled={!canStart}>
            Start Session
          </button>

          {!canStart && (
            <div style={{ textAlign: "center", fontSize: 13, opacity: 0.75, marginTop: 8 }}>
              Move a slider or add a note to begin.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
