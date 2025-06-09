import React from "react";
import { useTheme } from "./theme";
import "./ThemeSwitcher.css";

// PUBLIC_INTERFACE
export default function ThemeSwitcher({ className = "" }) {
  const { theme, setThemeByKey, allThemes } = useTheme();

  return (
    <section
      className={`tm-theme-switcher-panel ${className}`}
      aria-label="Theme selection"
      tabIndex={0}
    >
      <header className="tm-theme-switcher-header">
        <span className="tm-theme-switcher-title">Themes</span>
        <span className="tm-theme-switcher-desc">
          Personalize the vibe&nbsp;
          <span role="img" aria-label="palette">🎨</span>
        </span>
      </header>
      <div className="tm-theme-options">
        {allThemes.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`tm-theme-option-btn${theme.key === t.key ? " active" : ""}`}
            style={{
              "--gradient-bg": t.colors["--gradient-bg"] || "",
              "--panel-glass": t.colors["--panel-glass"] || ""
            }}
            aria-label={`Switch to theme: ${t.name}`}
            aria-pressed={theme.key === t.key}
            onClick={() => setThemeByKey(t.key)}
          >
            <span className="tm-theme-preview-bg" />
            <span className="tm-theme-preview-dot" style={{background:t.colors["--accent"]}} />
            <span className="tm-theme-labels">
              <span className="tm-theme-name">{t.name}</span>
              <span className="tm-theme-desc">{t.desc}</span>
            </span>
            {theme.key === t.key && (
              <span className="tm-active-check" aria-hidden="true">✔️</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
