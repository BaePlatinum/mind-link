import { useAppState } from "../context/AppStateContext";
import { useState } from "react";

export default function WelcomeScreen({ goTo }) {
  const { setUserName, setGoal } = useAppState();
  const [name, setNameLocal] = useState("");
  const [goalText, setGoalTextLocal] = useState("");

  const start = () => {
    setUserName(name);
    setGoal(goalText);
    goTo("preMood");
  };

  return (
    <div className="screen">
      <h1>Mind Link</h1>
      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setNameLocal(e.target.value)}
      />
      <input
        placeholder="Study goal"
        value={goalText}
        onChange={(e) => setGoalTextLocal(e.target.value)}
      />
      <button onClick={start}>Start Focus Session</button>
    </div>
  );
}
