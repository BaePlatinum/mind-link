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

  const [selectedMinutes, setSelectedMinutes] = useState(null);

  const [query, setQuery] = useState("");
  const [helpfulOnly, setHelpfulOnly] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  // MOVE filteredSessions OUTSIDE of stats useMemo
  const filteredSessions = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...sessions];

    if (helpfulOnly) list = list.filter((s) => s.helpful === true);

    if (todayOnly) {
      const today = startOfDay(Date.now());
      list = list.filter((s) => startOfDay(s.timestamp) === today);
    }

    if (q) {
      list = list.filter((s) => {
        const dateText = new Date(s.timestamp).toLocaleString().toLowerCase();

        // NOTE: this only works if you store goal per session later
        const goalText = (s.goal || "").toLowerCase();

        const distractText = Array.isArray(s.distractions)
          ? s.distractions
              .map((d) => (typeof d === "string" ? d : d.type || d.label || ""))
              .join(" ")
              .toLowerCase()
          : "";

        return (
          dateText.includes(q) ||
          goalText.includes(q) ||
          distractText.includes(q)
        );
      });
    }

    list.sort((a, b) =>
      sortNewest ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

    return list;
  }, [sessions, query, helpfulOnly, todayOnly, sortNewest]);

  // ----- compute stats -----
  const stats = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const last7 = sessions.filter((s) => s.timestamp >= sevenDaysAgo);

    const focusThisWeek = last7.reduce(
      (sum, s) => sum + (s.focusMinutes || 0),
      0
    );

    const deltas = last7
      .map((s) => {
        const pre = s.preMood?.mood;
        const post = s.postMood?.mood;
        if (typeof pre === "number" && typeof post === "number")
          return post - pre;
        return null;
      })
      .filter((x) => x !== null);

    const avgDelta =
      deltas.length > 0
        ? deltas.reduce((a, b) => a + b, 0) / deltas.length
        : null;

    const daySet = new Set(sessions.map((s) => startOfDay(s.timestamp)));
    let streak = 0;
    let cursor = startOfDay(now);
    while (daySet.has(cursor)) {
      streak += 1;
      cursor -= 24 * 60 * 60 * 1000;
    }

    return { focusThisWeek, avgDelta, streak };
  }, [sessions]);

    const weeklyFocus = useMemo(() => {
    const days = [];
    const now = startOfDay(Date.now());

    for (let i = 6; i >= 0; i--) {
      const day = now - i * 24 * 60 * 60 * 1000;

      const total = sessions
        .filter((s) => startOfDay(s.timestamp) === day)
        .reduce((sum, s) => sum + (s.focusMinutes || 0), 0);

      days.push({
        day,
        label: new Date(day).toLocaleDateString(undefined, { weekday: "short" }),
        minutes: total,
      });
    }

    return days;
  }, [sessions]);

  const maxMinutes = Math.max(...weeklyFocus.map((d) => d.minutes), 1);

  const quickStart = (minutes) => {
    setSelectedMinutes(minutes);
    setCurrentFocusMinutes(minutes);
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
            style={{ width: "auto", opacity: selectedMinutes ? 1 : 0.6 }}
            disabled={!selectedMinutes}
            onClick={() => {
              clearCurrentFlow?.();
              goTo("preMood");
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

        {/* Focus chart */}
        <div className="info-card">
          <div className="info-title">Focus over last 7 days</div>

          <div className="bar-chart">
            {weeklyFocus.map((d) => (
              <div key={d.day} className="bar-col">
                <div className="bar-minutes">{d.minutes}m</div>
                <div
                  className="bar"
                  style={{
                    height: `${Math.max((d.minutes / maxMinutes) * 120, 6)}px`,
                    opacity: d.minutes ? 1 : 0.25,
                  }}
                  title={`${d.minutes} minutes`}
                />
                <div className="bar-label">{d.label}</div>
              </div>
            ))}
          </div>
        </div>


        {/* Quick Start */}
        <div className="info-card">
          <div className="info-title">Quick start</div>
          <div className="chip-row">
            {[25, 30, 50].map((m) => (
              <button
                key={m}
                className={`chip ${selectedMinutes === m ? "selected" : ""}`}
                type="button"
                onClick={() => quickStart(m)}
              >
                {m} min
              </button>
            ))}
          </div>

          {!selectedMinutes && (
            <div className="preset-note">
              Tip: select a duration, then press <b>New Session</b>.
            </div>
          )}
        </div>

        {/* History Tools */}
        <div className="info-card">
          <div className="info-title">History tools</div>

          <input
            placeholder="Search sessions (date, distractions...)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(6);
            }}
          />

          <div className="chip-row" style={{ marginTop: 8 }}>
            <button
              type="button"
              className={`chip ${helpfulOnly ? "selected" : ""}`}
              onClick={() => {
                setHelpfulOnly(!helpfulOnly);
                setVisibleCount(6);
              }}
            >
              Helpful only
            </button>

            <button
              type="button"
              className={`chip ${todayOnly ? "selected" : ""}`}
              onClick={() => {
                setTodayOnly(!todayOnly);
                setVisibleCount(6);
              }}
            >
              Today
            </button>

            <button
              type="button"
              className={`chip ${sortNewest ? "selected" : ""}`}
              onClick={() => setSortNewest(true)}
            >
              Newest
            </button>

            <button
              type="button"
              className={`chip ${!sortNewest ? "selected" : ""}`}
              onClick={() => setSortNewest(false)}
            >
              Oldest
            </button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="dash-section">
          <div className="dash-section-title">Recent sessions</div>

          {sessions.length === 0 && (
            <div className="session-card">
              <p style={{ marginTop: 0 }}>
                You haven't completed any focus sessions yet.
              </p>
              <button
                onClick={() => {
                  setSelectedMinutes(30);
                  setCurrentFocusMinutes(30);
                  clearCurrentFlow?.();
                  goTo("preMood");
                }}
              >
                Start your first session
              </button>
            </div>
          )}

          {/* Use filteredSessions here */}
          {filteredSessions.slice(0, visibleCount).map((s) => {
            const pre = s.preMood?.mood;
            const post = s.postMood?.mood;
            const delta =
              typeof pre === "number" && typeof post === "number"
                ? post - pre
                : null;

            const isToday = startOfDay(s.timestamp) === startOfDay(Date.now());

            let summary = "";
            if (Array.isArray(s.distractions) && s.distractions.length > 0) {
              const labels = s.distractions
                .map((d) =>
                  typeof d === "string" ? d : d.label || d.type || d.name
                )
                .filter(Boolean);

              const counts = labels.reduce((acc, x) => {
                acc[x] = (acc[x] || 0) + 1;
                return acc;
              }, {});

              summary = Object.entries(counts)
                .map(([k, v]) => (v > 1 ? `${k} ×${v}` : k))
                .join(" • ");
            }

            return (
              <div key={s.id} className={`session-card ${isToday ? "today" : ""}`}>
                <div className="session-row">
                  <div className="session-main">
                    <p className="session-meta">
                      {new Date(s.timestamp).toLocaleString()}
                    </p>
                    <p className="session-focus">{s.focusMinutes} minutes focused</p>
                    <p>
                      <b>Post mood:</b> {post ?? "—"}
                    </p>

                    {summary && (
                      <p className="session-meta">Distractions: {summary}</p>
                    )}
                  </div>

                  <div className="session-tags">
                    {delta !== null && (
                      <span
                        className={`pill ${
                          delta > 0 ? "pill-green" : delta < 0 ? "pill-red" : "pill-blue"
                        }`}
                      >
                        Mood {delta > 0 ? `+${delta}` : delta}
                      </span>
                    )}

                    {typeof s.helpful === "boolean" && (
                      <span className={`pill ${s.helpful ? "pill-green" : "pill-red"}`}>
                        {s.helpful ? "Helpful" : "Not helpful"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Show more */}
          {filteredSessions.length > visibleCount && (
            <button
              className="secondary"
              style={{ width: "100%" }}
              onClick={() => setVisibleCount((v) => v + 6)}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
