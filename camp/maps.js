// maps.js
import { appLaunch } from "./logic.js";
import { camp_origin } from "./camp-data.js";

let appState = null;

// ------------------------------------------------------------
// 1. Check if browser already has geolocation permission
// ------------------------------------------------------------
async function hasLocationPermission() {
  try {
    const perm = await navigator.permissions.query({ name: "geolocation" });
    return perm.state === "granted";
  } catch {
    return false;
  }
}

// ------------------------------------------------------------
// 2. Get a stable, high‑accuracy GPS fix
// ------------------------------------------------------------
function getStableLocation() {
  return new Promise((resolve, reject) => {
    let settled = false;

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        if (pos.coords.accuracy < 50 && !settled) {
          settled = true;
          navigator.geolocation.clearWatch(watchId);
          resolve(pos);
        }
      },
      err => {
        navigator.geolocation.clearWatch(watchId);
        reject(err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );

    // Safety fallback after 5 seconds
    setTimeout(() => {
      if (!settled) {
        navigator.geolocation.clearWatch(watchId);
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    }, 5000);
  });
}

// ------------------------------------------------------------
// 3. Initialize maps system
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// 4. Detect if Google Maps failed to open
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
// 5. Main routing function
// ------------------------------------------------------------
export async function go(mode, origin, destination) {
  console.log("GO CALLED:", { mode, origin, destination, appState });

  if (!appState) return;

  const useCamp = document.getElementById("startFromCamp").checked;

  // --------------------------------------------------------
  // RULE: Use GPS if:
  //   - origin === "Current Location"
  //   - OR "Start from camp" is unticked
  // --------------------------------------------------------
  const mustUseGPS =
    origin === "Current Location" ||
    !useCamp;

  if (mustUseGPS) {
    console.log("User wants GPS — checking permission…");

    const allowed = await hasLocationPermission();

    if (allowed) {
      console.log("GPS permission granted — fetching stable location…");

      try {
        const pos = await getStableLocation();
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        const realOrigin = `${lat},${lon}`;

        const finalUrl = appState.buildURL(realOrigin, destination, mode);
        openInMapsWithDetection(finalUrl);
        return;

      } catch (err) {
        console.error("GPS failed:", err);
        alert("Unable to get your location.");
      }
    }

    // ----------------------------------------------------
    // Permission NOT granted → fall back to string
    // ----------------------------------------------------
    console.log("GPS permission not granted — using 'Current Location' string");

    const finalUrl = appState.buildURL("Current Location", destination, mode);
    openInMapsWithDetection(finalUrl);
    return;
  }

  // --------------------------------------------------------
  // Otherwise: start from camp
  // --------------------------------------------------------
  const finalUrl = appState.buildURL(camp_origin, destination, mode);
  openInMapsWithDetection(finalUrl);
}

// ------------------------------------------------------------
// 6. Modal controls
// ------------------------------------------------------------
export function showMapsFailurePopup() {
  document.getElementById("mapsFailModal").style.display = "flex";
}

export function closeMapsFailModal() {
  document.getElementById("mapsFailModal").style.display = "none";
  showScreen("main");
}