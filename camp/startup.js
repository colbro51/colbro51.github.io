// startup.js
import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { detectOS } from "./logic.js";
import { showScreen } from "./screens.js";

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
  if (!installedState && (isAndroid || isIOS)) {
    showScreen("install");
    return;   // STOP: do not load main UI
  }

  const os = detectOS();
  if (os === "android") {
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