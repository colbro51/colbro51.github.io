// /camp/startup.js
// Pure app startup — no platform detection, no redirects, no onboarding.

import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { showScreen } from "./screens.js";

window.addEventListener("DOMContentLoaded", async () => {

  // Always start on main screen
  showScreen("main");

  // Initialize maps system BEFORE wiring routes
  await initMaps();

  // Dynamically load routes.js AFTER maps is ready
  const routesModule = await import("./routes.js");
  if (routesModule && typeof routesModule.wireRoutes === "function") {
    routesModule.wireRoutes();
  }

  // Set title
  const titleEl = document.getElementById("title");
  if (titleEl) {
    titleEl.innerText = "F&B WRTG Camp " + year_name;
  }
});