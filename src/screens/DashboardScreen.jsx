import { useMemo, useState } from "react";
import { useAppState } from "../context/AppStateContext";
import AppShell from "../components/AppShell";

function startOfDay(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function DashboardScreen({ goTo, currentScreen }) {
  const {
    userName,
    goal,
    sessions,
    clearCurrentFlow,
    setCurrentFocusMinutes,
  } = useAppState();

  // ----- compute stats -----
  const stats = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const last7 = sessions.filter((s) => s.timestamp >= sevenDaysAgo);

    const focusThisWeek = last7.reduce((sum, s) => sum + (s.focusMinutes || 0), 0);

    // mood delta avg (post - pre) where available
    const deltas = last7
      .map((s) => {
        const pre = s.preMood?.mood;
        const post = s.postMood?.mood;
        if (typeof pre === "number" && typeof post === "number") return post - pre;
        return null;
      })
      .filter((x) => x !== null);

    const avgDelta =
      deltas.length > 0
        ? deltas.reduce((a, b) => a + b, 0) / deltas.length
        : null;

    // streak: unique days with at least one session, consecutive back from today
    const daySet = new Set(sessions.map((s) => startOfDay(s.timestamp)));
    let streak = 0;
    let cursor = startOfDay(now);
    while (daySet.has(cursor)) {
      streak += 1;
      cursor -= 24 * 60 * 60 * 1000;
    }

    return { focusThisWeek, avgDelta, streak };
  }, [sessions]);

  const quickStart = (minutes) => {
    clearCurrentFlow?.();
    setCurrentFocusMinutes(minutes);
    goTo("welcome");
  };

  return (
    <AppShell currentScreen={currentScreen} title="Dashboard">
      <div className="dash">
        {/* Header */}
        <div className="dash-header">
          <div>
            <div className="dash-kicker">Welcome back</div>
            <div className="dash-name">{userName ? userName : "Student"}</div>
          </div>

          <button
            className="secondary"
            style={{ width: "auto" }}
            onClick={() => {
              clearCurrentFlow?.();
              goTo("welcome");
            }}
          >
            New Session
          </button>
        </div>

        {/* Goal Card */}
        <div className="info-card">
          <div className="info-title">Current goal</div>
          <div className="info-value">{goal || "— Set a goal to stay focused."}</div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Focus this week</div>
            <div className="stat-value">{stats.focusThisWeek} min</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Streak</div>
            <div className="stat-value">{stats.streak} days</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Avg mood change</div>
            <div className="stat-value">
              {stats.avgDelta === null
                ? "—"
                : stats.avgDelta > 0
                ? `+${stats.avgDelta.toFixed(1)}`
                : stats.avgDelta.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="info-card">
          <div className="info-title">Quick start</div>
          <div className="chip-row">
            {[25, 30, 50].map((m) => (
              <button
                key={m}
                className="chip"
                type="button"
                onClick={() => quickStart(m)}
              >
                {m} min
              </button>
            ))}
          </div>
          <div className="preset-note">
            Tip: choose a duration, then press <b>New Session</b> to begin.
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="dash-section">
          <div className="dash-section-title">Recent sessions</div>

          {sessions.length === 0 && (
            <div className="session-card">
              <p style={{ marginTop: 0 }}>
                No sessions yet. Start your first focus session to see history here.
              </p>
            </div>
          )}

          {sessions.slice(0, 6).map((s) => {
            const pre = s.preMood?.mood;
            const post = s.postMood?.mood;
            const delta =
              typeof pre === "number" && typeof post === "number" ? post - pre : null;

            return (
              <div key={s.id} className="session-card">
                <p>
                  <b>Date:</b> {new Date(s.timestamp).toLocaleString()}
                </p>
                <p>
                  <b>Focus:</b> {s.focusMinutes} minutes
                </p>
                <p>
                  <b>Post mood:</b> {post ?? "—"}
                </p>

                {delta !== null && (
                  <p>
                    <b>Mood change:</b> {delta > 0 ? `+${delta}` : `${delta}`}
                  </p>
                )}

                {typeof s.helpful === "boolean" && (
                  <p>
                    <b>Helpful:</b> {s.helpful ? "Yes" : "No"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
