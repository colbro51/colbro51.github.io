// startup.js

import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { detectOS } from "./logic.js";
import { showScreen } from "./screens.js";


// ------------------------------------------------------------
// Helper: detect real Android devices (kept exactly as-is)
// ------------------------------------------------------------
function isRealAndroid() {
  return navigator.userAgent.includes("Android") &&
         navigator.userAgent.includes("Mobile") &&
         !navigator.userAgent.includes("Windows") &&
         !navigator.userAgent.includes("CrOS");
}


// ------------------------------------------------------------
// Startup sequence
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", async () => {

  // --- PLATFORM DETECTION ---
  const os = detectOS();
  const isIOS = (os === "ios" || os === "ipad");

  // --- INSTALL STATE DETECTION ---
  const installedState =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  // --- INSTALL GATE (ONLY FOR ANDROID + IOS) ---
  if (!installedState && (isRealAndroid() || isIOS)) {
    showScreen("install");
    return;
  }

  // --- ANDROID-ONLY HELP NOTE ---
  if (isRealAndroid()) {
    const androidNote = document.getElementById("androidHelpNote");
    if (androidNote) androidNote.style.display = "block";
  }

  // --- INSTALLED OR DESKTOP → CONTINUE NORMALLY ---
  showScreen("main");

  // Ensure maps system is fully initialised BEFORE wiring routes/gestures
  await initMaps();

  // Now wire all route buttons + gesture engine
  const routesModule = await import("./routes.js");
  if (routesModule && typeof routesModule.wireRoutes === "function") {
    routesModule.wireRoutes();
  }

  // --- iOS/iPadOS: reveal Google Maps toggle ---
  if (isIOS) {
    const label = document.getElementById("useGoogleMapsLabel");
    if (label) label.style.display = "flex";
  }

  // --- SET TITLE ---
  document.getElementById("title").innerText =
    "F&B WRTG Camp " + year_name;
});