import { useState } from "react";
import { useAppState } from "../context/AppStateContext";

export default function PostMoodScreen({ goTo }) {
  const [mood, setMood] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [fatigue, setFatigue] = useState(3);

  const { addSession, currentFocusMinutes } = useAppState();

  const finish = () => {
    const sessionObj = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      focusMinutes: currentFocusMinutes,
      postMood: { mood, motivation, fatigue }
    };

    addSession(sessionObj);
    goTo("dashboard");
  };

  return (
    <div className="screen">
      <h2>How do you feel now?</h2>

      <label>Mood: {mood}</label>
      <input type="range" min="1" max="5" value={mood} onChange={(e) => setMood(e.target.value)} />

      <label>Motivation: {motivation}</label>
      <input type="range" min="1" max="5" value={motivation} onChange={(e) => setMotivation(e.target.value)} />

      <label>Fatigue: {fatigue}</label>
      <input type="range" min="1" max="5" value={fatigue} onChange={(e) => setFatigue(e.target.value)} />

      <button onClick={finish}>Finish Session</button>
    </div>
  );
}
