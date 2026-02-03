// /camp/logic.js
// Clean routing helpers — no OS detection, no state machine.

export function buildMapURL(origin, destination, mode, useGoogle) {
  if (useGoogle) {
    // Google Maps URL (works on all platforms)
    return `https://www.google.com/maps/dir/?api=1&travelmode=${mode}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  }

  // Apple Maps URL (iOS will open the app; Android will open browser)
  return `maps://?dirflg=${mode[0]}&saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}`;
}