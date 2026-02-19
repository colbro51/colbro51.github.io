// maps.js

import { buildMapURL } from "./logic.js";

function dbg(...args) {
  if (window.debug) window.debug(...args);
}

// ------------------------------------------------------------
// Location wait message (Android slow GPS)
// ------------------------------------------------------------
function showLocationWaitMessage() {
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
// Stable GPS getter (Android/Huawei safe)
// ------------------------------------------------------------
async function getStableLocation() {
  const isAndroid = (window.platform || "").toLowerCase() === "android";

  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      })
    );
    return pos;
  } catch {
    if (isAndroid) showLocationWaitMessage();
  }

  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 60000
      })
    );
    hideLocationWaitMessage();
    return pos;
  } catch {}

  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000
      })
    );
    hideLocationWaitMessage();
    return pos;
  } catch {}

  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: Infinity
      })
    );
    return pos;
  } finally {
    hideLocationWaitMessage();
  }
}

// ------------------------------------------------------------
// Android opener: deep link first → fallback to web
// ------------------------------------------------------------
function openOnAndroid(urlWeb, urlDeep) {
  dbg("Android deep link:", urlDeep);

  try {
    const win = window.open(urlDeep, "_blank", "noopener,noreferrer");
    if (win) return;
  } catch {}

  const a = document.createElement("a");
  a.href = urlWeb;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ------------------------------------------------------------
// Generic opener (iOS + desktop)
// ------------------------------------------------------------
function openGeneric(url) {
  try {
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      const modal = document.getElementById("mapsFailModal");
      if (modal) modal.style.display = "flex";
    }
  } catch {
    const modal = document.getElementById("mapsFailModal");
    if (modal) modal.style.display = "flex";
  }
}

// ------------------------------------------------------------
// initMaps()
// ------------------------------------------------------------
export async function initMaps() {
  const mapsChk = document.getElementById("useGoogleMaps");
  if (mapsChk) {
    mapsChk.addEventListener("change", () => {
      localStorage.setItem("useGoogleMaps", String(mapsChk.checked));
    });
  }
}

// ------------------------------------------------------------
// go(mode, origin, destination)
// ------------------------------------------------------------
export async function go(mode, origin, destination) {
  dbg("go():", mode, origin, destination);

  const platform = (window.platform || "other").toLowerCase();
  const mapsChk = document.getElementById("useGoogleMaps");
  const useGoogleMaps = mapsChk ? !!mapsChk.checked : false;

  origin = origin || "Current Location";
  destination = destination || "";
  mode = mode || "driving";

  let finalOrigin = origin;

  if (origin === "Current Location") {
    try {
      if (navigator.permissions && platform !== "android") {
        const status = await navigator.permissions.query({ name: "geolocation" });
        if (status.state === "denied") {
          alert("Location permission is blocked. Please enable it.");
          return;
        }
      }

      const pos = await getStableLocation();
      if (pos?.coords) {
        finalOrigin = `${pos.coords.latitude},${pos.coords.longitude}`;
      }
    } catch {
      alert("Unable to get your location. We'll open the camp in Maps instead.");
      finalOrigin = "";
    }
  }

  const urlWeb = buildMapURL(finalOrigin || "Current Location", destination, mode, true);

  const urlDeep =
    `comgooglemaps://?api=1` +
    `&origin=${encodeURIComponent(finalOrigin || "Current Location")}` +
    `&destination=${encodeURIComponent(destination)}` +
    `&travelmode=${mode}`;

  if (platform === "android") {
    openOnAndroid(urlWeb, urlDeep);
  } else {
    openGeneric(urlWeb);
  }
}