// screens.js

let screenlevel = 1;     // 1 = main, 2 = day, 3 = viewer
let backscreen = "";     // where "Go Back" should return

export function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* -----------------------------
   ENTER LEVEL 2 (day screens)
------------------------------ */
export function enterDay(id) {
  screenlevel = 2;
  backscreen = "main";
  showScreen(id);
}

/* -----------------------------
   ENTER LEVEL 3 (viewer)
------------------------------ */
export function enterViewer(imageName) {
  const current = document.querySelector(".screen.active");
  const img = document.getElementById("viewerImage");

  img.src = `docs/${imageName}.png`;

  screenlevel = 3;
  backscreen = current.id;   // the day screen
  showScreen("viewer");
}

/* -----------------------------
   GO BACK (unified logic)
------------------------------ */
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

/* -----------------------------
   Wire viewer back + help back
------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
  const viewerBack = document.getElementById("viewerBack");
  if (viewerBack) viewerBack.onclick = goBack;

  const backHelp = document.getElementById("back_help");
  if (backHelp) backHelp.onclick = () => showScreen("main");
});