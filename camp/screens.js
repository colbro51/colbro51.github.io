// screens.js

// ------------------------------------------------------------
// Navigation stack (Option A: clears when returning to main)
// ------------------------------------------------------------
const navStack = [];

function currentScreen() {
  return document.querySelector(".screen.active")?.id || "app_main";
}


// ------------------------------------------------------------
// Core screen switcher
// ------------------------------------------------------------
export function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}


// ------------------------------------------------------------
// Push navigation: go to a new screen
// ------------------------------------------------------------
function navigateTo(id) {
  const from = currentScreen();

  // Only push if not navigating to the same screen
  if (from !== id) {
    navStack.push(from);
  }

  showScreen(id);
}


// ------------------------------------------------------------
// LEVEL 2: Day screens + Help
// ------------------------------------------------------------
export function enterDay(id) {
  navigateTo(id);
}

export function enterHelp() {
  navigateTo("helpPanel");
}


// ------------------------------------------------------------
// LEVEL 3: Viewer (trip text)
// ------------------------------------------------------------
export function enterViewer(imageName) {
  const img = document.getElementById("viewerImage");
  const testSrc = `docs/${imageName}.png`;

  fetch(testSrc, { method: "HEAD" }).then(res => {
    if (!res.ok) return; // Missing image → do nothing

    img.src = testSrc;

    // Prevent long‑press context menu on Android
    img.addEventListener("contextmenu", e => e.preventDefault(), { once: true });

    navigateTo("viewer");
  });
}


// ------------------------------------------------------------
// Unified Go Back logic (Option A)
// ------------------------------------------------------------
export function goBack() {
  if (navStack.length === 0) {
    // Already at main
    showScreen("app_main");
    return;
  }

  const previous = navStack.pop();

  // If we popped back to main, clear stack completely
  if (previous === "app_main") {
    navStack.length = 0;
  }

  showScreen(previous);
}


// ------------------------------------------------------------
// Prevent back buttons from triggering gesture engine
// ------------------------------------------------------------
document.querySelectorAll(".backonly").forEach(btn => {
  btn.addEventListener("pointerdown", e => e.stopPropagation());
});


// ------------------------------------------------------------
// DOM wiring
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {

  const viewerBack = document.getElementById("viewerBack");
  if (viewerBack) viewerBack.onclick = goBack;

  const backHelp = document.getElementById("back_help");
  if (backHelp) backHelp.onclick = goBack;

  const helpToggle = document.getElementById("helpToggle");
  if (helpToggle) {
    helpToggle.addEventListener("change", () => {
      if (helpToggle.checked) {
        enterHelp();
        helpToggle.checked = false;
      }
    });
  }
});