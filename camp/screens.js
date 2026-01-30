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
  const testSrc = `docs/${imageName}.png`;

  fetch(testSrc, { method: "HEAD" }).then(res => {
    if (!res.ok) {
      console.warn(`Viewer image missing: ${testSrc}`);
      return;
    }

    img.src = testSrc;
    screenlevel = 3;
    backscreen = current.id;
    showScreen("viewer");
  });
}

// ------------------------------------------------------------
// Unified Go Back logic
// ------------------------------------------------------------
export function goBack() {
  showScreen(backscreen);
  screenlevel -= 1;

  if (screenlevel === 2) backscreen = "main";
  if (screenlevel === 1) backscreen = "";
}


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