import React, { useState, useRef, useEffect } from "react";
import "./Header.css";

// Inline SVG logo for sleek, modern look
function TMLogo() {
  return (
    <span className="tm-logo-icon" aria-label="App logo">
      {/* Minimalist checkmark-clipboard icon */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="7" width="20" height="16" rx="5" fill="#00ffff" />
        <rect x="7.5" y="2" width="13" height="6.2" rx="2.1" fill="#1976d2" />
        <path d="M11 16 l3 3 6-6" stroke="#1976d2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  );
}

// PUBLIC_INTERFACE
function Header({
  user = { name: "Alex Doe", avatarUrl: "" },
  notifications = 2,
  onThemeToggle,
  theme = "light"
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if click outside
  useEffect(() => {
    function handle(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
        setNotifOpen(false);
      }
    }
    if (dropdownOpen || notifOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [dropdownOpen, notifOpen]);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="tm-navbar" role="navigation">
      <div className="tm-navbar-logo">
        <TMLogo />
        <span className="tm-navbar-brand">TaskMaster <b>Pro</b></span>
      </div>
      <div className="tm-navbar-actions">
        {/* Theme toggle */}
        <div className="tm-theme-toggle" tabIndex={0} aria-label="Toggle dark/light mode"
             title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
          <input
            id="theme-toggle"
            type="checkbox"
            checked={theme === "dark"}
            onChange={onThemeToggle}
            aria-checked={theme === "dark"}
          />
          <label htmlFor="theme-toggle">
            <span className="tm-toggle-track">
              <span className="tm-toggle-icon tm-toggle-sun" aria-hidden={!theme || theme==="dark"}>☀️</span>
              <span className="tm-toggle-icon tm-toggle-moon" aria-hidden={theme !== "dark"}>🌙</span>
            </span>
          </label>
        </div>
        {/* Notifications */}
        <div className="tm-navbar-bell-wrapper" ref={dropdownRef}>
          <button
            className="tm-navbar-bell"
            aria-label={`Notifications: ${notifications} unread`}
            aria-haspopup="true"
            aria-expanded={notifOpen}
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
          >
            <span className="tm-bell-icon" aria-hidden="true">
              <svg width="19" height="19" fill="none" viewBox="0 0 19 19">
                <path d="M9.5 3.8A4.2 4.2 0 0 0 5.3 8v2.4c0 .63-.36 1.22-.92 1.48l-.8.4a.4.4 0 0 0 .18.76h12a.4.4 0 0 0 .18-.76l-.8-.4A1.74 1.74 0 0 1 14.2 10.4V8a4.2 4.2 0 0 0-4.7-4.2z"
                  stroke="#00ffff" strokeWidth="1.3" fill="none"/>
                <circle cx="9.5" cy="15.2" r="1.2" fill="#1976d2"/>
              </svg>
            </span>
            {notifications > 0 && (
              <span className="tm-bell-badge" aria-label={`${notifications} unread`}>
                {notifications}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="tm-navbar-dropdown tm-bell-dropdown" tabIndex={0}>
              <div className="tm-dropdown-title">Notifications</div>
              <ul className="tm-dropdown-list">
                {/* Demo static notifications */}
                <li>You have {notifications} new reminder{notifications > 1 && "s"}!</li>
                <li>Settings and notification center coming soon</li>
              </ul>
            </div>
          )}
        </div>
        {/* Profile + dropdown */}
        <div className="tm-navbar-profile" ref={dropdownRef}>
          <button
            className="tm-profile-btn"
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
            aria-label="Profile account"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Profile avatar" className="tm-navbar-avatar" />
            ) : (
              <span className="tm-navbar-avatar" aria-label={`avatar for ${user.name}`}>
                {initials}
              </span>
            )}
          </button>
          {dropdownOpen && (
            <div className="tm-navbar-dropdown tm-profile-dropdown" tabIndex={0}>
              <div className="tm-dropdown-title">{user.name}</div>
              <ul className="tm-dropdown-list">
                <li tabIndex={0}><span role="img" aria-label="profile">👤</span> Profile</li>
                <li tabIndex={0}><span role="img" aria-label="settings">⚙️</span> Settings</li>
                <li tabIndex={0} className="tm-dropdown-logout"><span role="img" aria-label="logout">🚪</span> Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
