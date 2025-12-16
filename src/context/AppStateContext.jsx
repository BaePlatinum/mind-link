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

  // Remember last custom minutes separately
  const [lastCustomMinutes, setLastCustomMinutes] = useState("");

  // Load sessions on startup
  useEffect(() => {
    const saved = sessionStorage.getItem("sessions");
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  // Save sessions on change
  useEffect(() => {
    sessionStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (sessionObj) => {
    setSessions((prev) => [sessionObj, ...prev]); // newest first
  };

  const clearCurrentFlow = () => {
    setPreMoodData(null);
    setDistractions([]);
  };

  // Load profile on startup
  useEffect(() => {
    const savedName = sessionStorage.getItem("userName");
    const savedGoal = sessionStorage.getItem("goal");
    const savedCustom = sessionStorage.getItem("lastCustomMinutes");

    if (savedName) setUserName(savedName);
    if (savedGoal) setGoal(savedGoal);

    // load remembered custom minutes
    if (savedCustom !== null) setLastCustomMinutes(savedCustom);
  }, []);

  // Save profile on change
  useEffect(() => {
    sessionStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    sessionStorage.setItem("goal", goal);
  }, [goal]);

  // Save remembered custom minutes on change
  useEffect(() => {
    sessionStorage.setItem("lastCustomMinutes", lastCustomMinutes);
  }, [lastCustomMinutes]);

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

        // expose remembered custom minutes
        lastCustomMinutes,
        setLastCustomMinutes,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
