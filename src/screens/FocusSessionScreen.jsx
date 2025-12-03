import { useAppState } from "../context/AppStateContext";
import Timer from "../components/Timer";

export default function FocusSessionScreen({ goTo }) {
  const { currentFocusMinutes } = useAppState();

  return (
    <div className="screen">
      <h2>Focus Session</h2>

      <Timer 
        durationMinutes={currentFocusMinutes}
        onComplete={() => goTo("postMood")}
      />

      <button onClick={() => goTo("postMood")}>
        End Session Early
      </button>
    </div>
  );
}
