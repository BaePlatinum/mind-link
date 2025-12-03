import { useState } from "react";
import { AppStateProvider } from "./context/AppStateContext";

import WelcomeScreen from "./screens/WelcomeScreen";
import PreMoodScreen from "./screens/PreMoodScreen";
import FocusSessionScreen from "./screens/FocusSessionScreen";
import PostMoodScreen from "./screens/PostMoodScreen";
import DashboardScreen from "./screens/DashboardScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome");

  const goTo = (screenName) => {
    setCurrentScreen(screenName);
  };

  return (
    <AppStateProvider>
      {currentScreen === "welcome" && <WelcomeScreen goTo={goTo} />}
      {currentScreen === "preMood" && <PreMoodScreen goTo={goTo} />}
      {currentScreen === "focus" && <FocusSessionScreen goTo={goTo} />}
      {currentScreen === "postMood" && <PostMoodScreen goTo={goTo} />}
      {currentScreen === "dashboard" && <DashboardScreen goTo={goTo} />}
    </AppStateProvider>
  );
}

export default App;
