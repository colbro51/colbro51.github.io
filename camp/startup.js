// startup.js

import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { detectOS } from "./logic.js";
import { showScreen } from "./screens.js";

// ------------------------------------------------------------
// Shared helpers (top-level so both IIFE + DOMContentLoaded can use them)
// ------------------------------------------------------------
function isRealAndroid() {
  return (
    navigator.userAgent.includes("Android") &&
    navigator.userAgent.includes("Mobile") &&
    !navigator.userAgent.includes("Windows") &&
    !navigator.userAgent.includes("CrOS")
  );
}

function isStandalone() {
  return (
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

function isIosSafari() {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isSafari =
    !ua.includes("crios") &&
    !ua.includes("fxios") &&
    !ua.includes("chrome");
  return isIOS && isSafari;
}

function getAndroidSkipFlag() {
  try {
    return sessionStorage.getItem("androidSkipInstall") === "1";
  } catch {
    return false;
  }
}

// ------------------------------------------------------------
// EARLY PLATFORM REDIRECTS (runs immediately on module load)
// ------------------------------------------------------------
(function () {
  const standalone = isStandalone();

  // iOS → Safari-only instructions page
  if (!standalone && isIosSafari()) {
    window.location.href = "/camp/ios-safari-home.html";
    return;
  }

  // Android → dedicated install page (unless user chose to skip)
  if (!standalone && isRealAndroid()) {
    if (getAndroidSkipFlag()) {
      // User previously tapped "Continue Without Installing"
      return;
    }
    window.location.href = "/camp/android-install.html";
    return;
  }

  // Desktop or installed → continue normally
})();

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
  const titleEl = document.getElementById("title");
  if (titleEl) {
    titleEl.innerText = "F&B WRTG Camp " + year_name;
  }
});