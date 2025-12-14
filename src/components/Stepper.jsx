export default function Stepper({ current }) {
  const steps = [
    { key: "welcome", label: "Setup" },
    { key: "preMood", label: "Check-in" },
    { key: "focus", label: "Focus" },
    { key: "postMood", label: "Wrap-up" },
    { key: "dashboard", label: "History" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="stepper">
      {steps.map((s, idx) => {
        const state =
          idx === currentIndex ? "active" : idx < currentIndex ? "done" : "todo";
        return (
          <div key={s.key} className={`step ${state}`}>
            <span className="step-num">{idx + 1}</span>
            <span className="step-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
