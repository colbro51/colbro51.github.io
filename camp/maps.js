// maps.js

import { buildMapURL } from "./logic.js";

// ------------------------------------------------------------
// Small helpers
// ------------------------------------------------------------
function dbg(...args) {
  if (window.debug) window.debug(...args);
}

// ------------------------------------------------------------
// User-facing "please wait" message (Android, slow GPS only)
// ------------------------------------------------------------
function showLocationWaitMessage() {
  // Only ever show one
  if (document.getElementById("locationWaitMsg")) return;

  const msg = document.createElement("div");
  msg.id = "locationWaitMsg";
  msg.textContent = "Getting your location… this can take a little longer on some phones.";
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.background = "#1976d2";
  msg.style.color = "white";
  msg.style.padding = "12px 18px";
  msg.style.borderRadius = "8px";
  msg.style.fontSize = "14px";
  msg.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  msg.style.zIndex = "99999";
  document.body.appendChild(msg);
}

function hideLocationWaitMessage() {
  const msg = document.getElementById("locationWaitMsg");
  if (msg) msg.remove();
}

// ------------------------------------------------------------
// Huawei / Android-safe stable location getter
// ------------------------------------------------------------
async function getStableLocation() {
  const isAndroid = (window.platform || "").toLowerCase() === "android";

  // Attempt 1: High accuracy GPS (fast devices succeed here)
  dbg("Getting stable location… (Attempt 1: high accuracy)");
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      })
    );
    dbg("Got GPS (Attempt 1):", pos.coords.latitude, pos.coords.longitude);
    return pos;
  } catch (e1) {
    dbg("GPS error on Attempt 1:", e1 && e1.message ? e1.message : e1);
    // Only now do we show the wait message, and only on Android
    if (isAndroid) showLocationWaitMessage();
  }

  // Attempt 2: Low accuracy (network)
  dbg("Getting stable location… (Attempt 2: low accuracy, network)");
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 60000
      })
    );
    dbg("Got GPS (Attempt 2):", pos.coords.latitude, pos.coords.longitude);
    hideLocationWaitMessage();
    return pos;
  } catch (e2) {
    dbg("GPS error on Attempt 2:", e2 && e2.message ? e2.message : e2);
  }

  // Attempt 3: Cached (≤5 minutes)
  dbg("Getting stable location… (Attempt 3: cached ≤5 min)");
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      })
    );
    dbg("Got GPS (Attempt 3):", pos.coords.latitude, pos.coords.longitude);
    hideLocationWaitMessage();
    return pos;
  } catch (e3) {
    dbg("GPS error on Attempt 3:", e3 && e3.message ? e3.message : e3);
  }

  // Attempt 4: Any cached fix (Huawei last resort)
  dbg("Getting stable location… (Attempt 4: any cached fix)");
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: Infinity
      })
    );
    dbg("Got GPS (Attempt 4):", pos.coords.latitude, pos.coords.longitude);
    return pos;
  } finally {
    hideLocationWaitMessage();
  }
}

// ------------------------------------------------------------
// Open URL on Android (PWA-safe)
// ------------------------------------------------------------
function openOnAndroid(url) {
  dbg("openOnAndroid() called with URL:", url);

  try {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);

    dbg("About to click <a>...");
    a.click();
    dbg("<a>.click() returned");
    a.remove();
    dbg("Anchor removed");
  } catch (err) {
    dbg("Error in openOnAndroid:", err && err.message ? err.message : err);
    const modal = document.getElementById("mapsFailModal");
    if (modal) modal.style.display = "flex";
  }
}

// ------------------------------------------------------------
// Open URL on iOS / desktop
// ------------------------------------------------------------
function openGeneric(url) {
  dbg("openGeneric() called with URL:", url);

  try {
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      dbg("window.open returned null/blocked");
      const modal = document.getElementById("mapsFailModal");
      if (modal) modal.style.display = "flex";
    }
  } catch (err) {
    dbg("Error in openGeneric:", err && err.message ? err.message : err);
    const modal = document.getElementById("mapsFailModal");
    if (modal) modal.style.display = "flex";
  }
}

// ------------------------------------------------------------
// Public: initialise Maps system
// ------------------------------------------------------------
export async function initMaps() {
  dbg("initMaps() starting");

  try {
    const mapsChk = document.getElementById("useGoogleMaps");
    let useGoogleMaps = false;

    if (mapsChk) {
      useGoogleMaps = mapsChk.checked;
      mapsChk.addEventListener("change", () => {
        const val = !!mapsChk.checked;
        localStorage.setItem("useGoogleMaps", String(val));
        dbg("useGoogleMaps changed:", val);
      });
    }

    dbg("initMaps() complete, useGoogleMaps =", useGoogleMaps);
  } catch (err) {
    dbg("initMaps() error:", err && err.message ? err.message : err);
  }
}

// ------------------------------------------------------------
// Public: main navigation entry point
// route = { mode, origin, destination }
// ------------------------------------------------------------
export async function go(route) {
  dbg("go() called:", JSON.stringify(route || {}));

  try {
    const platform = (window.platform || "other").toLowerCase();
    dbg("Platform =", platform);

    const mapsChk = document.getElementById("useGoogleMaps");
    const useGoogleMaps = mapsChk ? !!mapsChk.checked : false;

    const origin = route.origin || "Current Location";
    const destination = route.destination || "";
    const mode = route.mode || "driving";

    const useCamp = destination.toLowerCase().includes("hanmer");
    dbg("useCamp =", useCamp);

    const mustUseGPS = origin === "Current Location";
    dbg("mustUseGPS =", mustUseGPS);

    let finalOrigin = origin;

    // --------------------------------------------------------
    // GPS path (Current Location)
    // --------------------------------------------------------
    if (mustUseGPS) {
      // Permissions API (non-Android only; Android prompts inline)
      if (navigator.permissions && platform !== "android") {
        try {
          dbg("Checking geolocation permission via permissions.query");
          const status = await navigator.permissions.query({ name: "geolocation" });
          dbg("permissions.query result:", status.state);
          if (status.state === "denied") {
            dbg("GPS permission denied");
            alert("Location permission is blocked. Please enable it in your browser settings.");
            return;
          }
        } catch (errPerm) {
          dbg("permissions.query error:", errPerm && errPerm.message ? errPerm.message : errPerm);
        }
      } else {
        dbg("Skipping permissions.query on Android");
      }

      dbg("GPS permission = true");

      try {
        const pos = await getStableLocation();
        if (!pos || !pos.coords) {
          throw new Error("No coordinates returned");
        }

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        dbg("Got GPS:", lat, lon);

        finalOrigin = `${lat},${lon}`;
      } catch (errLoc) {
        dbg("Unable to get location:", errLoc && errLoc.message ? errLoc.message : errLoc);
        alert("Unable to get your location. We'll open the camp in Maps instead.");
        finalOrigin = ""; // Let Maps infer current location if possible
      }
    }

    // --------------------------------------------------------
    // Build final URL
    // --------------------------------------------------------
    const url = buildMapURL(
      finalOrigin || "Current Location",
      destination,
      mode,
      useGoogleMaps
    );

    dbg("Final URL =", url);

    // --------------------------------------------------------
    // Open based on platform
    // --------------------------------------------------------
    if (platform === "android") {
      openOnAndroid(url);
    } else {
      openGeneric(url);
    }

  } catch (err) {
    dbg("go() error:", err && err.message ? err.message : err);
    const modal = document.getElementById("mapsFailModal");
    if (modal) modal.style.display = "flex";
  }
}