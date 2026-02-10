// maps.js (instrumented)
import { buildMapURL } from "./logic.js";
import { showScreen } from "./screens.js";

let useGoogleMaps;

export async function initMaps() {
  debug("initMaps() starting");

  const chk = document.getElementById("useGoogleMaps");
  useGoogleMaps = chk ? chk.checked : false;

  if (chk) {
    chk.addEventListener("change", () => {
      useGoogleMaps = chk.checked;
      localStorage.setItem("useGoogleMaps", useGoogleMaps ? "true" : "false");
      debug("useGoogleMaps changed:", useGoogleMaps);
    });
  }

  debug("initMaps() complete, useGoogleMaps =", useGoogleMaps);
}

// ------------------------------------------------------------
// Android opener (instrumented)
// ------------------------------------------------------------
function openOnAndroid(url) {
  debug("openOnAndroid() called with URL:", url);

  try {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);

    debug("About to click <a>…");
    a.click();
    debug("<a>.click() returned");

    a.remove();
    debug("Anchor removed");
  } catch (err) {
    debug("ERROR in openOnAndroid:", err.message);
  }
}

// ------------------------------------------------------------
// iOS opener (instrumented)
// ------------------------------------------------------------
function openWithIOSDetection(url) {
  debug("openWithIOSDetection() URL:", url);

  let becameHidden = false;

  const onVisibility = () => {
    debug("visibilitychange:", document.visibilityState);
    if (document.visibilityState === "hidden") {
      becameHidden = true;
    }
  };

  document.addEventListener("visibilitychange", onVisibility, { once: true });

  debug("Navigating via location.href…");
  window.location.href = url;

  setTimeout(() => {
    debug("iOS detection timeout fired. becameHidden =", becameHidden);
    if (!becameHidden) {
      debug("Showing failure popup");
      showMapsFailurePopup();
    }
  }, 2500);
}

async function hasLocationPermission() {
  // Android WebView and some Samsung/Huawei devices crash on permissions.query
  if (/android/i.test(navigator.userAgent)) {
    debug("Skipping permissions.query on Android");
    return true; // Let getCurrentPosition() decide
  }

  try {
    const perm = await navigator.permissions.query({ name: "geolocation" });
    debug("permissions.query returned:", perm.state);
    return perm.state === "granted";
  } catch (err) {
    debug("permissions.query ERROR:", err.message);
    return false;
  }
}

// ------------------------------------------------------------
// Main routing function (instrumented)
// ------------------------------------------------------------
export async function go(mode, origin, destination) {
  debug("go() called:", JSON.stringify({ mode, origin, destination }));

  const platform = window.platform ?? "other";
  debug("Platform =", platform);

  // Windows path
  if (platform === "windows") {
    debug("Windows path");
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
    openOnAndroid(url); // same opener works fine
    return;
  }

  const useCamp = document.getElementById("startFromCamp").checked;
  debug("useCamp =", useCamp);

  if (!useCamp) origin = "Current Location";

  const mustUseGPS = origin === "Current Location";
  debug("mustUseGPS =", mustUseGPS);

  if (mustUseGPS) {
    const allowed = await hasLocationPermission();
    debug("GPS permission =", allowed);

    if (allowed) {
      try {
        debug("Getting stable location…");
        const pos = await getStableLocation();
        debug("Got GPS:", pos.coords.latitude, pos.coords.longitude);

        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        const realOrigin = `${lat},${lon}`;

        const finalUrl = buildMapURL(realOrigin, destination, mode, useGoogleMaps);
        debug("Final URL =", finalUrl);

        if (platform === "ios") openWithIOSDetection(finalUrl);
        else openOnAndroid(finalUrl);

        return;
      } catch (err) {
        debug("GPS ERROR:", err.message);
        alert("Unable to get your location.");
      }
    }

    debug("GPS not allowed, using fallback");
    const fallbackUrl = buildMapURL("Current Location", destination, mode, useGoogleMaps);
    debug("Fallback URL =", fallbackUrl);

    if (platform === "ios") openWithIOSDetection(fallbackUrl);
    else openOnAndroid(fallbackUrl);

    return;
  }

  const finalUrl = buildMapURL(origin, destination, mode, useGoogleMaps);
  debug("Final URL =", finalUrl);

  if (platform === "ios") openWithIOSDetection(finalUrl);
  else openOnAndroid(finalUrl);
}

// ------------------------------------------------------------
export function showMapsFailurePopup() {
  debug("showMapsFailurePopup()");
  const el = document.getElementById("mapsFailModal");
  if (!el) {
    debug("ERROR: mapsFailModal not found");
    return;
  }
  el.style.display = "flex";
}

export function closeMapsFailModal() {
  debug("closeMapsFailModal()");
  document.getElementById("mapsFailModal").style.display = "none";
  showScreen("app_main");
}