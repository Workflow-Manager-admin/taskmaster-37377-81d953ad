import React, { useState, useRef } from "react";
import "./MainContainer.css";
import Header from "./Header";
import "./Header.css";

// Timer Popup Component
// PUBLIC_INTERFACE
function TimerPopup({ visible, onClose, task, onStart, onPause, onReset, timerState, timeLeft }) {
  if (!visible) return null;
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = ("0" + s % 60).slice(-2);
    return `${m}:${sec}`;
  };
  return (
    <div className="tm-modal-bg" data-testid="timer-popup">
      <div className="tm-modal">
        <h3>
          ⏲️ Timer for: <span className="tm-modal-task">{task.title}</span>
        </h3>
        <div className="tm-timer-display">{formatTime(timeLeft)}</div>
        <div className="tm-modal-btns">
          {timerState === "idle" && (
            <button className="tm-btn-accent" onClick={onStart}>Start</button>
          )}
          {timerState === "running" && (
            <>
              <button className="tm-btn-accent" onClick={onPause}>Pause</button>
              <button className="tm-btn-text" onClick={onReset}>Reset</button>
            </>
          )}
          {timerState === "paused" && (
            <>
              <button className="tm-btn-accent" onClick={onStart}>Resume</button>
              <button className="tm-btn-text" onClick={onReset}>Reset</button>
            </>
          )}
        </div>
        <button className="tm-btn-close" onClick={onClose} aria-label="Close timer popup">&times;</button>
      </div>
    </div>
  );
}

// Individual Task Card Component
// PUBLIC_INTERFACE
function TaskCard({
  task,
  onToggle,
  onDelete,
  onShowTimer,
  animation,
}) {
  return (
    <div
      className={`tm-task-card${animation ? " " + animation : ""}${task.completed ? " completed" : ""}`}
      tabIndex={0}
    >
      <label className="tm-checkbox-label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          tabIndex={-1}
        />
        <span className="tm-custom-checkbox"/>
        <span className="tm-task-title">{task.title}</span>
      </label>
      <div className="tm-task-icons">
        <span className="tm-icon tm-timer-icon"
          title="Set timer"
          onClick={onShowTimer}
          tabIndex={0}
          role="button"
        >
          {task.duration > 0 ? "⏰" : "⏲️"}
        </span>
        <span
          className="tm-icon tm-delete-icon"
          title="Delete"
          onClick={onDelete}
          tabIndex={0}
          role="button"
        >
          🗑️
        </span>
      </div>
    </div>
  );
}

// Motivational quotes pool
const MOTIVATIONAL_QUOTES = [
  "You’re one task closer to success!",
  "Small steps, big results. You got this!",
  "Every completed task is a win!",
  "Productivity is progress.",
  "Keep up the great work!",
  "One thing at a time. Great job!",
  "Stay focused and keep crushing it!",
];

// Helper for pastel random shapes
function AbstractShapes() {
  return (
    <div className="tm-bg-abstract">
      <div className="tm-shape tm-shape-1"/>
      <div className="tm-shape tm-shape-2"/>
      <div className="tm-shape tm-shape-3"/>
      <div className="tm-shape tm-shape-4"/>
    </div>
  );
}

// PUBLIC_INTERFACE
function MainContainer() {
  // Task state
  const [tasks, setTasks] = useState([
    { id: 1, title: "Walk the dog", completed: false, duration: 0, },
    { id: 2, title: "Write code", completed: false, duration: 25 * 60 },
    { id: 3, title: "Read a book", completed: false, duration: 0 }
  ]);
  // Add task state
  const [input, setInput] = useState("");
  const [duration, setDuration] = useState(0);

  // Animations for card transitions
  const [enteringId, setEnteringId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // Timer popup
  const [showTimerId, setShowTimerId] = useState(null);
  const [timerState, setTimerState] = useState("idle"); // 'idle', 'running', 'paused'
  const [timer, setTimer] = useState({ id: null, timeLeft: 0, origTime: 0 });
  const timerInterval = useRef(null);

  // Motivational quote
  const quote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  // Add task handler
  // PUBLIC_INTERFACE
  const handleAddTask = () => {
    const title = input.trim();
    if (!title) return;
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      duration: duration,
    };
    setTasks((prev) => [...prev, newTask]);
    setEnteringId(newTask.id);
    setTimeout(() => setEnteringId(null), 600);
    setInput("");
    setDuration(0);
  };

  // PUBLIC_INTERFACE
  const handleToggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // PUBLIC_INTERFACE
  const handleDelete = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setTasks(tasks.filter(t => t.id !== id));
      setRemovingId(null);
    }, 400);
  };

  // Task timer popup logic
  // PUBLIC_INTERFACE
  const handleShowTimer = (task) => {
    setShowTimerId(task.id);
    setTimerState("idle");
    setTimer({
      id: task.id,
      timeLeft: task.duration,
      origTime: task.duration,
    });
  };
  // PUBLIC_INTERFACE
  const handleCloseTimer = () => {
    setShowTimerId(null);
    setTimerState("idle");
    clearInterval(timerInterval.current);
  };
  // PUBLIC_INTERFACE
  const handleTimerStart = () => {
    if (timer.timeLeft <= 0) return;
    setTimerState("running");
    timerInterval.current = setInterval(() => {
      setTimer(t => {
        if (t.timeLeft > 1) {
          return { ...t, timeLeft: t.timeLeft - 1 };
        } else {
          clearInterval(timerInterval.current);
          setTimerState("idle");
          // Optional: Use vibration or Notification
          if ("vibrate" in navigator) navigator.vibrate(200);
          alert("Timer finished!");
          return { ...t, timeLeft: 0 };
        }
      });
    }, 1000);
  };
  // PUBLIC_INTERFACE
  const handleTimerPause = () => {
    setTimerState("paused");
    clearInterval(timerInterval.current);
  };
  // PUBLIC_INTERFACE
  const handleTimerReset = () => {
    setTimerState("idle");
    clearInterval(timerInterval.current);
    setTimer((t) => ({ ...t, timeLeft: t.origTime }));
  };

  // Keyboard "Enter" for input
  const handleInputKey = (e) => { if (e.key === "Enter") handleAddTask(); };

  // Counting & progress bar
  const tasksLeft = tasks.filter(t => !t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : ((totalTasks - tasksLeft) / totalTasks) * 100;

  // Duration options for selection (pomodoro, custom)
  const durationOptions = [
    { label: "No timer", value: 0 },
    { label: "5 min", value: 5 * 60 },
    { label: "15 min", value: 15 * 60 },
    { label: "25 min", value: 25 * 60 },
    { label: "50 min", value: 50 * 60 },
  ];
  // PUBLIC_INTERFACE
  function formatTime(s) {
    if (!s) return "";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (sec === 0) return `${m}m`;
    return `${m}m ${sec}s`;
  }

  // Theme state + handler
  const [theme, setTheme] = useState("light");
  // Demo user and notification count (for now)
  const user = { name: "Alex Doe", avatarUrl: "" };
  const notifications = 2;
  // Sync body/theme variable for dark mode
  React.useEffect(() => {
    document.body.classList.toggle("tm-dark", theme === "dark");
    // Also swap CSS vars for App.css (root) if needed
    if (theme === "dark") {
      document.documentElement.style.setProperty('--base-dark', '#181926');
      document.documentElement.style.setProperty('--base-light', '#25f6d2');
      document.documentElement.style.setProperty('--text-color', '#d7fff8');
    } else {
      document.documentElement.style.setProperty('--base-dark', '#00008b');
      document.documentElement.style.setProperty('--base-light', '#00ffff');
      document.documentElement.style.setProperty('--text-color', '#fff');
    }
  }, [theme]);
  const handleThemeToggle = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  // MAIN UI RENDER
  return (
    <div className="tm-main-bg">
      <AbstractShapes />
      <Header
        user={user}
        notifications={notifications}
        onThemeToggle={handleThemeToggle}
        theme={theme}
      />
      {/* FAB add task button for mobile/desktop */}
      <button
        className="tm-fab"
        title="Add task"
        onClick={handleAddTask}
        aria-label="Add task"
        style={{ zIndex: 2 }}
      >
        +
      </button>

      {/* Main: Task List */}
      <main className="tm-main" style={{ marginTop: "32px" }}>
        <div className="tm-task-list-wrapper">
          {tasks.length === 0 && (
            <div className="tm-empty-tasks">
              <span role="img" aria-label="party">🎉</span>
              You have nothing left! Add a task.
            </div>
          )}

          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => handleToggle(task.id)}
              onDelete={() => handleDelete(task.id)}
              onShowTimer={() => handleShowTimer(task)}
              animation={
                enteringId === task.id
                  ? "tm-animate-in"
                  : removingId === task.id
                  ? "tm-animate-out"
                  : ""
              }
            />
          ))}
        </div>
      </main>

      {/* Add Task Input at Bottom */}
      <div className="tm-add-task-row">
        <input
          className="tm-add-input"
          value={input}
          placeholder="Type a new task…"
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKey}
        />
        <select
          className="tm-add-select"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        >
          {durationOptions.map(opt =>
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}
        </select>
        <button
          className="tm-add-btn"
          onClick={handleAddTask}
          aria-label="Add task"
          disabled={!input.trim()}
        >+</button>
      </div>

      {/* Footer with stats */}
      <footer className="tm-footer">
        <div className="tm-footer-stats">
          <span>
            <strong>{tasksLeft}</strong> left{totalTasks ? ` of ${totalTasks}` : ""}
          </span>
          <div className="tm-progress-bar-bg">
            <div className="tm-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="tm-footer-tip">
          {quote}
        </div>
      </footer>

      {/* Timer Popup */}
      <TimerPopup
        visible={showTimerId != null}
        task={tasks.find(t => t.id === showTimerId) || { title: "" }}
        timerState={timerState}
        timeLeft={timer.timeLeft}
        onStart={handleTimerStart}
        onPause={handleTimerPause}
        onReset={handleTimerReset}
        onClose={handleCloseTimer}
      />
    </div>
  );
}

export default MainContainer;
