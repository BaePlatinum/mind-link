import { useState } from "react";
import { AppStateProvider } from "./context/AppStateContext";

import WelcomeScreen from "./screens/WelcomeScreen";
import PreMoodScreen from "./screens/PreMoodScreen";
import FocusSessionScreen from "./screens/FocusSessionScreen";
import PostMoodScreen from "./screens/PostMoodScreen";
import DashboardScreen from "./screens/DashboardScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const goTo = (screenName) => setCurrentScreen(screenName);

  const screenProps = { goTo, currentScreen };

  return (
    <AppStateProvider>
      {currentScreen === "welcome" && <WelcomeScreen {...screenProps} />}
      {currentScreen === "preMood" && <PreMoodScreen {...screenProps} />}
      {currentScreen === "focus" && <FocusSessionScreen {...screenProps} />}
      {currentScreen === "postMood" && <PostMoodScreen {...screenProps} />}
      {currentScreen === "dashboard" && <DashboardScreen {...screenProps} />}
    </AppStateProvider>
  );
}

export default App;
