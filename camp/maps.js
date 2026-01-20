import { appLaunch } from "./logic.js";

let appState = null;


// ------------------------------------------------------------
// INITIALIZE MAP LOGIC
// ------------------------------------------------------------
export async function initMaps() {
  appState = await appLaunch();

  if (appState.error === "location") {
    showLocationErrorModal(appState.os, appState.reason);
    return;
  }

  console.log("OS:", appState.os);
  console.log("Routing state:", appState.state);
}


// ------------------------------------------------------------
// OPEN MAPS WITH FAILURE DETECTION
// ------------------------------------------------------------
export function openInMapsWithDetection(url) {
  window.open(url, "_blank");

  setTimeout(() => {
    if (document.visibilityState === "visible") {
      showMapsFailurePopup();
    }
  }, 1200);
}


// ------------------------------------------------------------
// GO() — MAIN ENTRY FOR ALL CAMP BUTTONS
// ------------------------------------------------------------
export function go(url) {
  if (!appState) {
    console.warn("App not initialized yet");
    return;
  }

  const useCamp = document.getElementById("startFromCamp").checked;

  const params = new URLSearchParams(url.split("?")[1]);
  let origin = params.get("origin");
  let destination = params.get("destination");

  if (!useCamp) {
    origin = "Current Location";
  }

  const finalUrl = appState.buildURL(origin, destination);
  openInMapsWithDetection(finalUrl);
}


// ------------------------------------------------------------
// MODALS
// ------------------------------------------------------------
export function showMapsFailurePopup() {
  document.getElementById("mapsFailModal").style.display = "flex";
}

export function closeMapsFailModal() {
  document.getElementById("mapsFailModal").style.display = "none";
}

export function showLocationErrorModal(os, reason) {
  alert("Location services are unavailable. Please enable them.");
}