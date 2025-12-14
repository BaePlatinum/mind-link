import { createContext, useContext, useEffect, useState } from "react";

const AppStateContext = createContext();

export function AppStateProvider({ children }) {
  const [userName, setUserName] = useState("");
  const [goal, setGoal] = useState("");

  const [sessions, setSessions] = useState([]);

  const [preMoodData, setPreMoodData] = useState(null);

  const [currentFocusMinutes, setCurrentFocusMinutes] = useState(30);
  const [currentBreakMinutes, setCurrentBreakMinutes] = useState(5);

  const [distractions, setDistractions] = useState([]);

  // Load sessions on startup
  useEffect(() => {
    const saved = localStorage.getItem("sessions");
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  // Save sessions on change
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (sessionObj) => {
    setSessions((prev) => [sessionObj, ...prev]); // newest first (nicer UX)
  };

  const clearCurrentFlow = () => {
    setPreMoodData(null);
    setDistractions([]);
  };

  // Load profile on startup
useEffect(() => {
  const savedName = localStorage.getItem("userName");
  const savedGoal = localStorage.getItem("goal");
  if (savedName) setUserName(savedName);
  if (savedGoal) setGoal(savedGoal);
}, []);

// Save profile on change
useEffect(() => {
  localStorage.setItem("userName", userName);
}, [userName]);

useEffect(() => {
  localStorage.setItem("goal", goal);
}, [goal]);


  return (
    <AppStateContext.Provider
      value={{
        userName,
        setUserName,
        goal,
        setGoal,

        sessions,
        addSession,

        preMoodData,
        setPreMoodData,
        clearCurrentFlow,

        currentFocusMinutes,
        setCurrentFocusMinutes,
        currentBreakMinutes,
        setCurrentBreakMinutes,

        distractions,
        setDistractions,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
