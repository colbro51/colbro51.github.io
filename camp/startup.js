// startup.js

// --- EARLY DEBUG PANEL (runs before install gate) ---
(function earlyDebug() {
  const panel = document.createElement("div");
  panel.id = "earlyDebugPanel";
  panel.style.cssText = `
    position:fixed;
    top:0;
    left:0;
    right:0;
    background:#111;
    color:#0f0;
    font-size:12px;
    padding:8px;
    z-index:999999;
    white-space:pre-wrap;
    font-family:monospace;
    max-height:40%;
    overflow:auto;
  `;

  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const touch = navigator.maxTouchPoints;

  const isAndroidUA = /Android/i.test(ua);
  const isIOSUA = /iphone|ipad|ipod/i.test(ua);

  const isRealAndroid =
    ua.includes("Android") &&
    ua.includes("Mobile") &&
    !ua.includes("Windows") &&
    !ua.includes("CrOS");

  const installedState =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  panel.textContent =
    "=== EARLY DEBUG ===\n" +
    "navigator.userAgent: " + ua + "\n" +
    "navigator.platform: " + platform + "\n" +
    "navigator.maxTouchPoints: " + touch + "\n\n" +
    "isAndroidUA: " + isAndroidUA + "\n" +
    "isIOSUA: " + isIOSUA + "\n" +
    "isRealAndroid(): " + isRealAndroid + "\n" +
    "installedState: " + installedState + "\n";

  document.body.appendChild(panel);
})();

import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { detectOS } from "./logic.js";
import { showScreen } from "./screens.js";

function isRealAndroid() {
  return navigator.userAgent.includes("Android") &&
         navigator.userAgent.includes("Mobile") &&
         !navigator.userAgent.includes("Windows") &&
         !navigator.userAgent.includes("CrOS");
}

window.addEventListener("DOMContentLoaded", () => {

  // --- PLATFORM DETECTION ---
  const ua = navigator.userAgent.toLowerCase();
  const isAndroid = ua.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(ua);

  // --- INSTALL STATE DETECTION ---
  const installedState =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  // --- INSTALL GATE (ONLY FOR ANDROID + IOS) ---
  if (!installedState && (isRealAndroid || isIOS)) {
    showScreen("install");
    return;
  }

  // --- ANDROID-ONLY HELP NOTE ---
  if (isRealAndroid) {
    const androidNote = document.getElementById("androidHelpNote");
    if (androidNote) androidNote.style.display = "block";
  }

  // --- INSTALLED OR DESKTOP → CONTINUE NORMALLY ---
  showScreen("main");
  initMaps();

  // --- iOS/iPadOS: reveal Google Maps toggle ---
  const os = detectOS();
  if (os === "ios" || os === "ipad") {
    const label = document.getElementById("useGoogleMapsLabel");
    if (label) label.style.display = "flex";
  }

  // --- SET TITLE ---
  document.getElementById("title").innerText =
    "F&B WRTG Camp " + year_name;
});

function debugOS() {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const touch = navigator.maxTouchPoints;

  const isAndroidUA = /Android/i.test(ua);
  const isIOSUA = /iphone|ipad|ipod/i.test(ua);

  const isRealAndroid =
    ua.includes("Android") &&
    ua.includes("Mobile") &&
    !ua.includes("Windows") &&
    !ua.includes("CrOS");

  const installedState =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const debugText =
    "=== DEBUG INFO ===\n" +
    "navigator.userAgent: " + ua + "\n" +
    "navigator.platform: " + platform + "\n" +
    "navigator.maxTouchPoints: " + touch + "\n\n" +
    "isAndroidUA: " + isAndroidUA + "\n" +
    "isIOSUA: " + isIOSUA + "\n" +
    "isRealAndroid(): " + isRealAndroid + "\n" +
    "installedState: " + installedState + "\n";

  const panel = document.getElementById("debugPanel");
  if (panel) panel.textContent = debugText;
}

debugOS();