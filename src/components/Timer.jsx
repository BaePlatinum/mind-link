import { useEffect, useRef, useState } from "react";

export default function Timer({ durationMinutes, onComplete, isPaused, addSignal }) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const doneRef = useRef(false);

  // Reset when duration changes / entering screen
  useEffect(() => {
    setSecondsLeft(durationMinutes * 60);
    doneRef.current = false;
  }, [durationMinutes]);

  // Add +5 minutes whenever addSignal changes
  useEffect(() => {
    if (!addSignal) return; // ignore initial 0
    setSecondsLeft((prev) => prev + 300);
  }, [addSignal]);

  // Countdown
  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete?.();
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isPaused, onComplete]);

  const format = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return <div className="timer">{format(secondsLeft)}</div>;
}
