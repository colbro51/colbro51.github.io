// screens.js

// ------------------------------------------------------------
// Navigation state machine
// ------------------------------------------------------------
let screenlevel = 1;     // 1 = main, 2 = day/help, 3 = viewer
let backscreen = "";     // where "Go Back" should return


// ------------------------------------------------------------
// Core screen switcher
// ------------------------------------------------------------
export function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}


// ------------------------------------------------------------
// LEVEL 2: Day screens + Help
// ------------------------------------------------------------
export function enterDay(id) {
  screenlevel = 2;
  backscreen = "main";
  showScreen(id);
}

export function enterHelp() {
  screenlevel = 2;
  backscreen = "main";
  showScreen("helpPanel");
}


// ------------------------------------------------------------
// LEVEL 3: Viewer (trip text)
// ------------------------------------------------------------
export function enterViewer(imageName) {
  const current = document.querySelector(".screen.active");
  const img = document.getElementById("viewerImage");

  img.src = `docs/${imageName}.png`;

  screenlevel = 3;
  backscreen = current.id;   // the day/help screen we came from
  showScreen("viewer");
}


// ------------------------------------------------------------
// Unified Go Back logic
// ------------------------------------------------------------
export function goBack() {
  showScreen(backscreen);
  screenlevel -= 1;

  if (screenlevel === 2) {
    backscreen = "main";
  }

  if (screenlevel === 1) {
    backscreen = "";
  }
}


// ------------------------------------------------------------
// DOM wiring + stale-viewer cleanup
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {

  // Viewer back → always goBack()
  const viewerBack = document.getElementById("viewerBack");
  if (viewerBack) viewerBack.onclick = goBack;

  // Help back → also goBack()
  const backHelp = document.getElementById("back_help");
  if (backHelp) backHelp.onclick = goBack;

  // Help toggle checkbox → treat as level‑2 screen
  const helpToggle = document.getElementById("helpToggle");
  if (helpToggle) {
    helpToggle.addEventListener("change", () => {
      if (helpToggle.checked) {
        enterHelp();
        helpToggle.checked = false; // auto-reset
      }
    });
  }

  // --------------------------------------------------------
  // CRITICAL FIX:
  // Prevent stale viewer state after Maps or app backgrounding
  // --------------------------------------------------------
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {

      const viewer = document.getElementById("viewer");

      // If viewer was active when Maps opened, close it immediately
      if (viewer.classList.contains("active")) {
        viewer.classList.remove("active");
        document.getElementById(backscreen).classList.add("active");
      }
    }
  });
});