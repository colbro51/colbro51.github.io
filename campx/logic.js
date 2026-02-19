// /camp/logic.js
// Clean routing helpers — no OS detection, no state machine.

export function buildMapURL(origin, destination, mode, useGoogle) {
  const isAndroid = /android/i.test(navigator.userAgent);

  // Force Google Maps on Android
  if (isAndroid) useGoogle = true;

  if (useGoogle) {
    return `https://www.google.com/maps/dir/?api=1&travelmode=${mode}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  }

  // Apple Maps for iOS only
  return `maps://?dirflg=${mode[0]}&saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}`;
}