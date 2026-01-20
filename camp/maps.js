import { appLaunch } from "./logic.js";

let appState = null;

export async function initMaps() {
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

export function go(url) {
  if (!appState) return;

  const useCamp = document.getElementById("startFromCamp").checked;

  const params = new URLSearchParams(url.split("?")[1]);
  let origin = params.get("origin");
  let destination = params.get("destination");

  if (!useCamp) origin = "Current Location";

  const finalUrl = appState.buildURL(origin, destination);

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