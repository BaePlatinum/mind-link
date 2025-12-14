import Stepper from "./Stepper";

export default function AppShell({ currentScreen, title, children }) {
  return (
    <div className="app-bg">
      <div className="app-card">
        <Stepper current={currentScreen} />
        {title && <h1 className="app-title">{title}</h1>}
        {children}
      </div>
    </div>
  );
}
