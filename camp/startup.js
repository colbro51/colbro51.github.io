// startup.js

import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { detectOS } from "./logic.js";
import { showScreen } from "./screens.js";

// ------------------------------------------------------------
// EARLY PLATFORM REDIRECTS (runs immediately on module load)
// ------------------------------------------------------------
(function () {

  function isIosSafari() {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isSafari =
      !ua.includes("crios") &&
      !ua.includes("fxios") &&
      !ua.includes("chrome");
    return isIOS && isSafari;
  }

  function isStandalone() {
    return (
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches
    );
  }

  function isRealAndroid() {
    return (
      navigator.userAgent.includes("Android") &&
      navigator.userAgent.includes("Mobile") &&
      !navigator.userAgent.includes("Windows") &&
      !navigator.userAgent.includes("CrOS")
    );
  }

  const standalone = isStandalone();

  // iOS → Safari-only instructions page
  if (!standalone && isIosSafari()) {
    window.location.href = "/camp/ios-safari-home.html";
    return;
  }

  // Android → dedicated install page
if (!standalone && isRealAndroid()) {

    // If user previously chose "Continue Without Installing", skip redirect
    if (localStorage.getItem("androidSkipInstall") === "1") {
        return;
    }

    window.location.href = "/camp/android-install.html";
    return;
}

  // Desktop or installed → continue normally
})();
  
// ------------------------------------------------------------
// Helper: detect real Android devices (kept for help note) -> function isRealAndroid() above
// ------------------------------------------------------------

// ------------------------------------------------------------
// MAIN STARTUP SEQUENCE
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", async () => {

  const os = detectOS();
  const isIOS = os === "ios" || os === "ipad";

  // Android-only help note
  if (isRealAndroid()) {
    const androidNote = document.getElementById("androidHelpNote");
    if (androidNote) androidNote.style.display = "block";
  }

  // Always start on main screen (install gates handled above)
  showScreen("main");

  // Initialize maps system BEFORE wiring routes
  await initMaps();

  // Dynamically load routes.js AFTER maps is ready
  const routesModule = await import("./routes.js");
  if (routesModule && typeof routesModule.wireRoutes === "function") {
    routesModule.wireRoutes();
  }

  // Reveal Google Maps toggle on iOS/iPadOS
  if (isIOS) {
    const label = document.getElementById("useGoogleMapsLabel");
    if (label) label.style.display = "flex";
  }

  // Set title
  document.getElementById("title").innerText =
    "F&B WRTG Camp " + year_name;
});