// startup.js
import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { detectOS } from "./logic.js";
import { showScreen } from "./screens.js";

window.addEventListener("DOMContentLoaded", () => {

  // --- INSTALL STATE GATE ---
  const installedState =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (!installedState) {
    showScreen("install");
    return;   // STOP: do not load main UI
  }

  // Installed → continue normally
  showScreen("main");
  initMaps();

  // Reveal Google Maps toggle only on iOS/iPad
  const os = detectOS();
  if (os === "ios" || os === "ipad") {
    const label = document.getElementById("useGoogleMapsLabel");
    if (label) label.style.display = "flex";
  }

  // Set title
  document.getElementById("title").innerText =
    "F&B WRTG Camp " + year_name;
});