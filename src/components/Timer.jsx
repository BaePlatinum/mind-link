import { useEffect, useState } from "react";

export default function Timer({ durationMinutes, onComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    setSecondsLeft(durationMinutes * 60);
  }, [durationMinutes]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onComplete]);

  const format = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center", fontSize: "3rem", marginTop: "40px" }}>
      {format(secondsLeft)}
    </div>
  );
}
