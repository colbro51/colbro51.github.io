// /camp/maps.js
import { buildMapURL } from "./logic.js";
import { showScreen } from "./screens.js";

let useGoogleMaps;   // no default — startup.js sets the checkbox

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

  const chk = document.getElementById("useGoogleMaps");

  // Checkbox state was set by startup.js from query params
  useGoogleMaps = chk ? chk.checked : false;

  if (chk) {
    chk.addEventListener("change", () => {
      useGoogleMaps = chk.checked;
      localStorage.setItem("useGoogleMaps", useGoogleMaps ? "true" : "false");
    });
  }
}

// ------------------------------------------------------------
// 4. Detect if Maps failed to open
// ------------------------------------------------------------
function isAndroidChrome() {
  const ua = navigator.userAgent || "";
  return ua.includes("Android") && ua.includes("Chrome");
}

export function openInMapsWithDetection(url) {
  if (isAndroidChrome()) {
    // A05/A06 and friends: auto‑detection is unreliable → just open Maps
    location.href = url;
    return;
  }

  // keep the detection logic for iOS / desktop if you like
  let timer = null;
  let hiddenSeen = false;
  let finished = false;

  const cleanup = () => {
    if (finished) return;
    finished = true;
    if (timer) clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisibility);
  };

  const onVisibility = () => {
    const state = document.visibilityState;

    if (state === "hidden") {
      hiddenSeen = true;
      cleanup();
    }

    if (state === "visible" && !hiddenSeen) {
      cleanup();
    }
  };

  document.addEventListener("visibilitychange", onVisibility);

  location.href = url;

  timer = setTimeout(() => {
    if (!finished) {
      cleanup();
      showMapsFailurePopup();
    }
  }, 2500);
}

// ------------------------------------------------------------
// 5. Main routing function
// ------------------------------------------------------------
export async function go(mode, origin, destination) {
  console.log("GO:", { mode, origin, destination, useGoogleMaps });

  const useCamp = document.getElementById("startFromCamp").checked;
  if (!useCamp) {
    origin = "Current Location";
  }

  const mustUseGPS = origin === "Current Location";

  if (mustUseGPS) {
    const allowed = await hasLocationPermission();

    if (allowed) {
      try {
        const pos = await getStableLocation();
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        const realOrigin = `${lat},${lon}`;

        const finalUrl = buildMapURL(realOrigin, destination, mode, useGoogleMaps);
        openInMapsWithDetection(finalUrl);
        return;

      } catch (err) {
        alert("Unable to get your location.");
      }
    }

    const fallbackUrl = buildMapURL("Current Location", destination, mode, useGoogleMaps);
    openInMapsWithDetection(fallbackUrl);
    return;
  }

  const finalUrl = buildMapURL(origin, destination, mode, useGoogleMaps);
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
  showScreen("app_main");
}