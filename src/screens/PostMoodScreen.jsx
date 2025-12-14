import { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import AppShell from "../components/AppShell";

export default function PostMoodScreen({ goTo, currentScreen }) {
  const [mood, setMood] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [helpful, setHelpful] = useState(null);

  const { addSession, currentFocusMinutes, preMoodData, distractions, clearCurrentFlow} = useAppState();

  const finish = () => {
    const sessionObj = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      focusMinutes: currentFocusMinutes,
      preMood: preMoodData,            // ✅ store before
      postMood: { mood, motivation, fatigue },
      helpful,                         // ✅ evaluation signal
      distractions,
    };

    addSession(sessionObj);
    clearCurrentFlow();
    goTo("dashboard");
  };

  return (
    <AppShell currentScreen={currentScreen} title="Wrap-up">
      <div className="screen">
        <h2 style={{ textAlign: "center", margin: 0 }}>How do you feel now?</h2>

        <label>Mood: {mood} (1 low → 5 high)</label>
        <input type="range" min="1" max="5" value={mood}
          onChange={(e) => setMood(Number(e.target.value))} />

        <label>Motivation: {motivation} (1 low → 5 high)</label>
        <input type="range" min="1" max="5" value={motivation}
          onChange={(e) => setMotivation(Number(e.target.value))} />

        <label>Fatigue: {fatigue} (1 low → 5 high)</label>
        <input type="range" min="1" max="5" value={fatigue}
          onChange={(e) => setFatigue(Number(e.target.value))} />

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={() => setHelpful(true)}
            style={{
              background: helpful === true ? "#2f6df6" : "#fff",
              color: helpful === true ? "#fff" : "#111",
              border: "1px solid #d7dbe3",
            }}
          >
            Helpful
          </button>
          <button
            onClick={() => setHelpful(false)}
            style={{
              background: helpful === false ? "#2f6df6" : "#fff",
              color: helpful === false ? "#fff" : "#111",
              border: "1px solid #d7dbe3",
            }}
          >
            Not helpful
          </button>
        </div>

        <button onClick={finish} disabled={helpful === null}>
          Finish Session
        </button>
      </div>
    </AppShell>
  );
}
