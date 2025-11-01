import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthContext } from "./context/authContext";
import "./index.css";

// Import test functions for WebSocket debugging (available in console)
import "./lib/functions/websocket-test";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <App />
      </AuthContext>
    </BrowserRouter>
  </StrictMode>
);
