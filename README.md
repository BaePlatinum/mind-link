# mind-link
Soen 357, Smart Study Focus App: Enhancing Student Productivity through Adaptive, Emotion-Aware Feedback

Language: JavaScript (not TypeScript)
Framework: React (web)
Scaffolding tool: Vite
Charts: Chart.js
Storage: localStorage only

1. Everyone: install basic tools
Each team member should do this on their own laptop.
Install Node.js (LTS version)
Go to nodejs.org → download the LTS installer for your OS → next-next-finish.
After install, open a terminal and run:

node -v
npm -v

If both show versions, you’re good.

Install a code editor
VS Code is easiest for everyone to standardize on.

Basic project structure

In src/:

src/
  main.jsx          # entry point
  App.jsx           # main layout + routes
  styles.css        # global basic styles (or keep default)
  components/
    Timer.jsx
    MoodForm.jsx
    SessionSummary.jsx
  screens/
    WelcomeScreen.jsx
    PreMoodScreen.jsx
    FocusSessionScreen.jsx
    PostMoodScreen.jsx
    DashboardScreen.jsx
  context/
    AppStateContext.jsx   # global state (optional but helpful)

Task A – App skeleton + basic navigation

Person 1

In App.jsx, set up a very basic “screen switcher” without React Router yet:
Keep a currentScreen state (e.g., "welcome", "preMood", "focus", "postMood", "dashboard").
Conditionally render each screen component.
Pass goTo(screenName) function to children.
This gives you a fake “multi-page” app with no URL routing, which is fine for a prototype.

Task B – Welcome screen

Create WelcomeScreen.jsx with:
Input: Name
Input: Study Goal
Button: “Start Focus Session”
On submit:
Save name/goal to a global state (or pass back up to App).
Call goTo("preMood").

Task C – Pre-mood form

Create MoodForm.jsx (reusable) and PreMoodScreen.jsx.
For now: 3 sliders or dropdowns (1–5) for mood / motivation / fatigue + a text area.
When user clicks “Continue”, save the values to state and go to FocusSessionScreen.

Task D – Timer logic (very basic)

Create Timer.jsx with:
Props: durationMinutes, onComplete.
Uses useState + useEffect to count down every second.
FocusSessionScreen.jsx uses this timer and when finished calls onComplete() → go to PostMoodScreen.
