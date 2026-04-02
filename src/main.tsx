import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </HashRouter>
);