// startup-app.js

window.debug = function (...args) {
  const box = document.getElementById("debugLog");
  if (!box) return;
  box.style.display = "block";
  box.textContent += args.join(" ") + "\n";
  box.scrollTop = box.scrollHeight;
};

import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { showScreen, enterHelp } from "./screens.js";

window.addEventListener("DOMContentLoaded", async () => {

  // ------------------------------------------------------------
  // 1. Read platform from query string (for iOS UI toggle)
  // ------------------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const platform = params.get("platform") || "other";
  window.platform = platform;

  // ------------------------------------------------------------
  // 2. Restore preferences from localStorage
  // ------------------------------------------------------------
  const useGoogleMaps = localStorage.getItem("useGoogleMaps") === "true";
  const helpNudgeShown = localStorage.getItem("helpNudgeShown") === "true";

  // Apply Google Maps checkbox state
  const mapsChk = document.getElementById("useGoogleMaps");
  if (mapsChk) mapsChk.checked = useGoogleMaps;

  // ------------------------------------------------------------
  // 3. Reveal Google Maps toggle only on iOS
  // ------------------------------------------------------------
  const mapsLabel = document.getElementById("useGoogleMapsLabel");
  if (mapsLabel && platform === "ios") {
    mapsLabel.style.display = "flex";
    Array.from(mapsLabel.children).forEach(c => c.style.display = "");
  }

  // ------------------------------------------------------------
  // 4. First‑time help nudge
  // ------------------------------------------------------------
  function applyFirstTimeHelpNudge() {
    if (helpNudgeShown) return;

    document.body.classList.add("disable-buttons");

    setTimeout(() => {
      document.body.classList.remove("disable-buttons");
      localStorage.setItem("helpNudgeShown", "true");
      enterHelp();
    }, 1000);
  }

  // ------------------------------------------------------------
  // 5. Show main screen
  // ------------------------------------------------------------
  showScreen("app_main");
  localStorage.removeItem("justInstalled");

  // ------------------------------------------------------------
  // 6. Initialize Maps system
  // ------------------------------------------------------------
  await initMaps();

  // ------------------------------------------------------------
  // 7. Apply help nudge
  // ------------------------------------------------------------
  applyFirstTimeHelpNudge();

  // ------------------------------------------------------------
  // 8. Wire routes
  // ------------------------------------------------------------
  const routesModule = await import("./routes.js");
  if (routesModule?.wireRoutes) routesModule.wireRoutes();

  // ------------------------------------------------------------
  // 9. Set title
  // ------------------------------------------------------------
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.innerText = "F&B WRTG Camp " + year_name;

  // ------------------------------------------------------------
  // 10. Modal OK button
  // ------------------------------------------------------------
  const modalOk = document.getElementById("modal_ok");
  if (modalOk) {
    modalOk.addEventListener("click", () => {
      document.getElementById("mapsFailModal").style.display = "none";
      showScreen("app_main");
    });
  }
});