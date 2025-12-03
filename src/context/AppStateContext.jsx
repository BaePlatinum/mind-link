import { createContext, useContext, useState, useEffect } from "react";

const AppStateContext = createContext();

export function AppStateProvider({ children }) {
  const [userName, setUserName] = useState("");
  const [goal, setGoal] = useState("");
  const [sessions, setSessions] = useState([]);

  const [currentFocusMinutes, setCurrentFocusMinutes] = useState(25);
  const [currentBreakMinutes, setCurrentBreakMinutes] = useState(5);

  // Load sessions on startup
  useEffect(() => {
    const saved = localStorage.getItem("sessions");
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (sessionObj) => {
    setSessions((prev) => [...prev, sessionObj]);
  };

  return (
    <AppStateContext.Provider
      value={{
        userName,
        setUserName,
        goal,
        setGoal,
        sessions,
        addSession,
        currentFocusMinutes,
        setCurrentFocusMinutes,
        currentBreakMinutes,
        setCurrentBreakMinutes,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
