import React, { createContext, useContext, useState } from "react";

// List of premium themes (can expand with more)
export const THEMES = [
  {
    key: "nature",
    name: "Nature",
    desc: "Fresh greens & blues inspired by forests and water.",
    isDark: false,
    colors: {
      "--base-dark": "#104C3D",
      "--base-light": "#62E1A4",
      "--text-color": "#EFFFF8",
      "--text-secondary": "#aadabb",
      "--panel-glass": "rgba(38, 138, 108, 0.43)",
      "--gradient-bg": "linear-gradient(118deg, #b2f9d4 0%, #0ca678 45%, #125a45 100%)",
      "--accent": "#62E1A4",
    },
    abstract: [
      "rgba(98, 225, 164, 0.32)",
      "rgba(52, 149, 112, 0.23)",
      "rgba(180,252,187, 0.29)"
    ]
  },
  {
    key: "tech",
    name: "Tech",
    desc: "Futuristic cyan & indigo. Neon, high contrast vibe.",
    isDark: true,
    colors: {
      "--base-dark": "#10141B",
      "--base-light": "#00ffff",
      "--text-color": "#eaf6ff",
      "--text-secondary": "#80eaff",
      "--panel-glass": "rgba(12,30,46,0.66)",
      "--gradient-bg": "linear-gradient(115deg, #00f0ff 2%, #002fff 80%, #22202e 100%)",
      "--accent": "#00ffff"
    },
    abstract: [
      "rgba(0,255,255,0.13)",
      "rgba(77,110,255,0.18)",
      "rgba(0,34,64,0.11)"
    ]
  },
  {
    key: "minimal",
    name: "Minimal",
    desc: "Whites, silver, and gentle grayscale hues.",
    isDark: false,
    colors: {
      "--base-dark": "#f9f9fb",
      "--base-light": "#ececec",
      "--text-color": "#232333",
      "--text-secondary": "#9090A2",
      "--panel-glass": "rgba(255,255,255,0.7)",
      "--gradient-bg": "linear-gradient(120deg, #f9f9fb 0%, #ececec 100%)",
      "--accent": "#9090A2"
    },
    abstract: [
      "rgba(232,233,255,0.34)",
      "rgba(152,147,200,0.13)",
      "rgba(205,210,242,0.21)"
    ]
  },
  {
    key: "pastel",
    name: "Pastel",
    desc: "Soothing multi-color pastel gradients.",
    isDark: false,
    colors: {
      "--base-dark": "#faf6ff",
      "--base-light": "#FFD6E0",
      "--text-color": "#263054",
      "--text-secondary": "#8960A4",
      "--panel-glass": "rgba(255,221,255,0.59)",
      "--gradient-bg": "linear-gradient(131deg,#ffeabf 0%,#aee0ff 38%,#ffc9e0 100%)",
      "--accent": "#DEA7FF"
    },
    abstract: [
      "rgba(255,221,255,0.17)",
      "rgba(187,221,255,0.25)",
      "rgba(255,201,224,0.19)"
    ]
  },
  {
    key: "dark",
    name: "Dark",
    desc: "Elegant deep night with gentle turquoise glow.",
    isDark: true,
    colors: {
      "--base-dark": "#181926",
      "--base-light": "#25f6d2",
      "--text-color": "#d7fff8",
      "--text-secondary": "#bfeaf6",
      "--panel-glass": "rgba(27,40,59,0.68)",
      "--gradient-bg": "linear-gradient(119deg,#24283b 12%,#181926 80%,#25f6d2 100%)",
      "--accent": "#52f7e4"
    },
    abstract: [
      "rgba(37,246,210,0.06)",
      "rgba(18,25,38, 0.19)",
      "rgba(36,40,59,0.11)"
    ]
  }
];

// Persist theme in localStorage for retention
const STORAGE_KEY = "taskmaster_theme";

const ThemeContext = createContext({
  theme: THEMES[0],
  setThemeByKey: () => {},
  allThemes: THEMES
});

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  // Determine system preferred theme at first load
  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if(stored) {
      const found = THEMES.find(t => t.key === stored);
      if(found) return found;
    }
    // Default: prefer dark if browser prefers
    if(window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return THEMES.find(t => t.key === "dark") || THEMES[0];
    }
    return THEMES[0];
  }
  const [theme, setTheme] = useState(getInitialTheme());

  // Apply theme CSS vars to :root
  React.useEffect(() => {
    for (const key in theme.colors) {
      document.documentElement.style.setProperty(key, theme.colors[key]);
    }
    document.body.classList.toggle("tm-dark", !!theme.isDark);
    localStorage.setItem(STORAGE_KEY, theme.key);
  }, [theme]);

  function setThemeByKey(key) {
    const found = THEMES.find(t => t.key === key);
    if(found) setTheme(found);
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemeByKey, allThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useTheme() {
  return useContext(ThemeContext);
}
