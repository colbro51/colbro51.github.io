console.log("LOGIC.JS LOADED");

export function detectOS() {
  console.log("detectOS() UA:", navigator.userAgent);

  const ua = navigator.userAgent || "";
  const uaData = navigator.userAgentData;

  if (uaData && uaData.platform) {
    const p = uaData.platform.toLowerCase();
    if (p.includes("android")) return "android";
    if (p.includes("ios")) return "ios";
    if (p.includes("windows")) return "windows";
  }

  if (/Windows NT/.test(ua)) return "windows";
  if (/iPhone|iPod/.test(ua)) return "ios";

  const isIPad = /iPad/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIPad) return "ipad";

  if (/Android/.test(ua)) return "android";

  return "other";
}

export async function locationAvailable() {
  try {
    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      return { ok: false, reason: "blocked" };
    }

    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        () => resolve({ ok: true }),
        err => resolve({ ok: false, reason: err.code }),
        { timeout: 3000 }
      );
    });

  } catch (err) {
    return { ok: false, reason: "error" };
  }
}

export function determineState(os, useGoogle) {
  if (os === "windows") return 4;
  if (os === "android" && useGoogle) return 1;
  if ((os === "ios" || os === "ipad") && useGoogle) return 2;
  if ((os === "ios" || os === "ipad") && !useGoogle) return 3;
  return 0;
}

export function buildMapURL(state, origin, destination) {
  console.log("buildMapURL() state:", state, "origin:", origin, "dest:", destination);
  switch (state) {
    case 1:
      return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

    case 2:
      return `comgooglemaps://?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}`;

    case 3:
      return `maps://?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}`;

    case 4:
      return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

    default:
      return null;
  }
}

export async function appLaunch() {
  const os = detectOS();
  console.log("appLaunch() starting… OS detected:", os);

  if (os === "windows") {
    console.log("Windows detected — skipping location check");
    return {
      os,
      state: 4,
      buildURL: (origin, destination) =>
        buildMapURL(4, origin, destination)
    };
  }

  const loc = await locationAvailable();
  console.log("Location check result:", loc);
  if (!loc.ok) {
    return { error: "location", os, reason: loc.reason };
  }

  const useGoogle = document.getElementById("useGoogleMaps").checked;
  const state = determineState(os, useGoogle);

  return {
    os,
    state,
    buildURL: (origin, destination) =>
      buildMapURL(state, origin, destination)
  };
}