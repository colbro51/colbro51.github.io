console.log("MAPS.JS LOADED");

import { appLaunch } from "./logic.js";

let appState = null;

export async function initMaps() {
  appState = await appLaunch();
  console.log("appLaunch() returned:", appState);

  if (appState.error === "location") {
    console.warn("Location error:", appState.reason);
    alert("Location services unavailable. Please enable them.");
    return;
  }

  console.log("Maps initialized. OS:", appState.os, "State:", appState.state);
}

export function openInMapsWithDetection(url) {
  console.log("Opening URL:", url);

  window.open(url, "_blank");

  setTimeout(() => {
    if (document.visibilityState === "visible") {
      showMapsFailurePopup();
    }
  }, 1200);
}

export function go(url) {
  console.log("go() called with:", url);

  if (!appState) {
    console.error("go() called before appState is ready");
    return;
  }

  console.log("appState:", appState);

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