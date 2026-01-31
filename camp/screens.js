// screens.js

function log(...args) {
  try {
    const ts = performance.now().toFixed(1);
    const line = `[${ts}] ${args.join(" ")}`;
    console.log(line);

    const panel = document.getElementById("debugPanel");
    if (panel) {
      panel.textContent += line + "\n";
      panel.scrollTop = panel.scrollHeight;
    }
  } catch (err) {
    console.warn("LOG ERROR:", err);
  }
}

// ------------------------------------------------------------
// Navigation state machine
// ------------------------------------------------------------
let screenlevel = 1;     // 1 = main, 2 = day/help, 3 = viewer
let backscreen = "";     // where "Go Back" should return


// ------------------------------------------------------------
// Core screen switcher
// ------------------------------------------------------------
export function showScreen(id) {
  log("SHOW SCREEN", id);
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ------------------------------------------------------------
// LEVEL 2: Day screens + Help
// ------------------------------------------------------------
export function showScreen(id) {
  log("SHOW SCREEN", id);
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
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
  log("ENTER VIEWER start", imageName, "current=", current?.id);

  const img = document.getElementById("viewerImage");
  const testSrc = `docs/${imageName}.png`;

  fetch(testSrc, { method: "HEAD" }).then(res => {
    if (!res.ok) {
      log("VIEWER IMAGE MISSING", testSrc);
      return;
    }

    img.src = testSrc;
    screenlevel = 3;
    backscreen = current.id;

    log("ENTER VIEWER commit", imageName, 
        "screenlevel=", screenlevel, 
        "backscreen=", backscreen);

    showScreen("viewer");
  });
}

// ------------------------------------------------------------
// Unified Go Back logic
// ------------------------------------------------------------
export function goBack() {
  const current = document.querySelector(".screen.active")?.id;
  log("GO BACK", 
      "current=", current, 
      "screenlevel=", screenlevel, 
      "backscreen=", backscreen);

  showScreen(backscreen);
  screenlevel -= 1;

  log("GO BACK after", 
      "screenlevel=", screenlevel, 
      "backscreen=", backscreen);
  
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