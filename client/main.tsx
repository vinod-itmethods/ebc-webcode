import "./global.css";

import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

// Check if root is already created (during hot reload)
if (!(container as any)._reactRootContainer) {
  const root = createRoot(container);
  root.render(<App />);
}
