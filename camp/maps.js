
import { appLaunch } from "./logic.js";

let appState = null;

export async function initMaps() {
  console.log("MAPS: initMaps() starting");

  appState = await appLaunch();

  if (appState.error === "location") {
    alert("Location services unavailable. Please enable them.");
    return;
  }

  console.log("OS:", appState.os);
  console.log("Routing state:", appState.state);
}

export function openInMapsWithDetection(url) {
  window.open(url, "_blank");

  setTimeout(() => {
    if (document.visibilityState === "visible") {
      showMapsFailurePopup();
    }
  }, 1200);
}

export function go(mode, origin, destination) {
  console.log("GO CALLED:", { mode, origin, destination, appState });

  if (!appState) return;

  const useCamp = document.getElementById("startFromCamp").checked;

  if (!useCamp) {
    origin = "Current Location";
  }

  const finalUrl = appState.buildURL(origin, destination, mode);

  if (appState.os === "windows") {
    window.open(finalUrl, "_blank");
    return;
  }

  openInMapsWithDetection(finalUrl);
}

export function showMapsFailurePopup() {
  document.getElementById("mapsFailModal").style.display = "flex";
}

export function closeMapsFailModal() {
  document.getElementById("mapsFailModal").style.display = "none";
}