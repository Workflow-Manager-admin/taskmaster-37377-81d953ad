import React from "react";
import "./App.css";
import MainContainer from "./MainContainer";
import { ThemeProvider } from "./theme";

// PUBLIC_INTERFACE
function App() {
  return (
    <ThemeProvider>
      <MainContainer />
    </ThemeProvider>
  );
}

export default App;