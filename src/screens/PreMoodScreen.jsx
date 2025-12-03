import { useState } from "react";
import { useAppState } from "../context/AppStateContext";

export default function PreMoodScreen({ goTo }) {
  const [mood, setMood] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [note, setNote] = useState("");

  const { preMoodData, setPreMoodData } = useAppState();

  const next = () => {
    setPreMoodData?.({ mood, motivation, fatigue, note });
    goTo("focus");
  };

  return (
    <div className="screen">
      <h2>How are you feeling before studying?</h2>

      <label>Mood: {mood}</label>
      <input type="range" min="1" max="5" value={mood} onChange={(e) => setMood(e.target.value)} />

      <label>Motivation: {motivation}</label>
      <input type="range" min="1" max="5" value={motivation} onChange={(e) => setMotivation(e.target.value)} />

      <label>Fatigue: {fatigue}</label>
      <input type="range" min="1" max="5" value={fatigue} onChange={(e) => setFatigue(e.target.value)} />

      <textarea
        placeholder="Notes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={next}>Start Session</button>
    </div>
  );
}
