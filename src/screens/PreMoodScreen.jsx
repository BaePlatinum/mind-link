import { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import AppShell from "../components/AppShell";

export default function PreMoodScreen({ goTo, currentScreen }) {
  const [mood, setMood] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [note, setNote] = useState("");

  const { setPreMoodData } = useAppState();

  const next = () => {
    setPreMoodData({ mood, motivation, fatigue, note });
    goTo("focus");
  };

  return (
    <AppShell currentScreen={currentScreen} title="Check-in">
      <div className="screen">
        <h2 style={{ textAlign: "center", margin: 0 }}>
          How are you feeling before studying?
        </h2>

        <label>Mood: {mood} (1 low → 5 high)</label>
        <input
          type="range"
          min="1"
          max="5"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
        />

        <label>Motivation: {motivation} (1 low → 5 high)</label>
        <input
          type="range"
          min="1"
          max="5"
          value={motivation}
          onChange={(e) => setMotivation(Number(e.target.value))}
        />

        <label>Fatigue: {fatigue} (1 low → 5 high)</label>
        <input
          type="range"
          min="1"
          max="5"
          value={fatigue}
          onChange={(e) => setFatigue(Number(e.target.value))}
        />

        <textarea
          placeholder="Notes (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />

        <button onClick={next}>Start Session</button>
      </div>
    </AppShell>
  );
}
