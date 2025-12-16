The Smart Study Focus App is an interactive, web-based study support tool that explores whether adaptive, emotion-aware feedback can improve student focus and motivation compared to traditional static study timers. Rather than relying on fixed intervals (e.g., Pomodoro-style timers), the app adapts study session length and feedback based on users’ self-reported emotional states and observed focus patterns.

Built as a research-driven prototype, the application integrates ideas from personal informatics, affective computing, and interruption management to create a more human-centered study experience. The system emphasizes supportive feedback, reflection, and personalization over rigid time enforcement.

This application was built using **React** with **Vite** as the development and build tool, allowing for fast startup times and an efficient development workflow.

---

## Team Members

* **[Matthew To | 40005135]** 
* **[Samuditha Wijenarayana | 40224895]** 
* **[Prathiksha Kandiah | 40190782]**
* **[Melissa MacNab | 40192264]**
* **[Eesha Patel | 40189246]**

---

Teaser Video
---
[![Teaser Video](https://img.youtube.com/vi/FMbjcdYXyGw/maxresdefault.jpg)](https://www.youtube.com/watch?v=FMbjcdYXyGw)

---

## Context

Staying focused during study sessions has become increasingly difficult for university students due to constant digital distractions such as notifications, social media, and multitasking on laptops. While productivity tools like Pomodoro timers help structure study time, they typically use **static intervals** and do not adapt to differences in user energy, motivation, or emotional state. As a result, these tools can feel rigid or discouraging and are often abandoned over time.

The Smart Study Focus App was created to address this limitation through a **human‑centered and adaptive approach**. Instead of focusing solely on time, the app incorporates brief mood check‑ins and focus history to adjust study intervals and provide thoughtful, non‑punitive feedback. The guiding research question behind this project is:

**Does adaptive, emotion‑aware feedback improve focus duration and self‑reported motivation compared to static timer‑based study tools?**

This prototype was developed to explore how emotional awareness and personalization—key principles in modern Human‑Computer Interaction (HCI)—can support students’ focus, motivation, and long‑term productivity habits in technology‑mediated learning environments.

---

## Key Features / Functions

### Adaptive Study Timer

* Adjusts focus and break intervals based on prior session behavior and mood check‑ins
* Recommends shorter sessions or longer breaks when users report low energy or frequently disengage

### Mood Check‑Ins

* Short self‑assessments at the start and end of each session using a 5‑point Likert scale
* Captures mood, motivation, and mental fatigue
* Enables users to recognize emotional trends in their study habits

### Supportive Feedback System

* Provides gentle visual or textual encouragement during sessions
* Reinforces sustained focus with positive feedback
* Responds to disengagement with supportive, recovery‑oriented messages rather than punitive alerts

### Reflective Analytics Dashboard

* Displays study history, focus duration trends, and mood data
* Helps users reflect on how emotional states correlate with productivity
* Encourages self‑regulation and long‑term habit formation

---

## Tech Stack

* **React**
* **Vite**
* **JavaScript**
* **HTML / CSS**

---

## Requirements

Before running the app, ensure the following are installed:

* **Node.js (LTS recommended)**
* **npm** (included with Node.js)

Verify installation:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Obtain the Project

* Download and unzip the submitted project folder

OR

* Clone the repository (if applicable):

```bash
git clone [REPOSITORY_URL]
cd [PROJECT_FOLDER]
```

### 2. Install Dependencies

From the project root directory (where `package.json` is located):

```bash
npm install
```

### 3. Run the App Locally

```bash
npm run dev
```

Vite will display a local development URL in the terminal, typically:

```
http://localhost:5173/
```

Open this URL in a web browser to test the application.

---

## Stopping the App

To stop the development server, press:

```
Ctrl + C
```

in the terminal.

---

## Submission Notes

The submission intentionally excludes `node_modules`. All required dependencies will be installed using `npm install` as described above.
