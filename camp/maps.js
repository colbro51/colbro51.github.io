// /camp/maps.js
import { buildMapURL } from "./logic.js";
import { showScreen } from "./screens.js";

let useGoogleMaps;

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
  const chk = document.getElementById("useGoogleMaps");
  useGoogleMaps = chk ? chk.checked : false;

  if (chk) {
    chk.addEventListener("change", () => {
      useGoogleMaps = chk.checked;
      localStorage.setItem("useGoogleMaps", useGoogleMaps ? "true" : "false");
    });
  }
}

// ------------------------------------------------------------
// 4. iOS‑only detection (Android does NOT use this)
// ------------------------------------------------------------
function openWithIOSDetection(url) {
  let becameHidden = false;

  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      becameHidden = true;
    }
  };

  document.addEventListener("visibilitychange", onVisibility, { once: true });

  window.location.href = url;

  setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibility);
    if (!becameHidden) showMapsFailurePopup();
  }, 2500);
}

// ------------------------------------------------------------
// 5. Android-safe opener (no detection)
// ------------------------------------------------------------
function openOnAndroid(url) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ------------------------------------------------------------
// 6. Main routing function
// ------------------------------------------------------------
export async function go(mode, origin, destination) {
  const platform = window.platform ?? "other";

  // Windows: already handled separately
  if (platform === "windows") {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  // Start-from-camp logic
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

        if (platform === "ios") openWithIOSDetection(finalUrl);
        else openOnAndroid(finalUrl);

        return;
      } catch {
        alert("Unable to get your location.");
      }
    }

    // Fallback if permission not granted
    const fallbackUrl = buildMapURL("Current Location", destination, mode, useGoogleMaps);

    if (platform === "ios") openWithIOSDetection(fallbackUrl);
    else openOnAndroid(fallbackUrl);

    return;
  }

  // Non-GPS origin
  const finalUrl = buildMapURL(origin, destination, mode, useGoogleMaps);

  if (platform === "ios") openWithIOSDetection(finalUrl);
  else openOnAndroid(finalUrl);
}

// ------------------------------------------------------------
// 7. Modal controls
// ------------------------------------------------------------
export function showMapsFailurePopup() {
  document.getElementById("mapsFailModal").style.display = "flex";
}

export function closeMapsFailModal() {
  document.getElementById("mapsFailModal").style.display = "none";
  showScreen("app_main");
}