import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// `react-grid-layout` tries to read from `process.env` for debugging, but vite
// doesn't set up process.env, so set it up ourselves.
// https://github.com/react-grid-layout/react-grid-layout/issues/2266
(window as unknown as { process: { env: Record<string, string | undefined> } }).process = {
    env: {},
};



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
