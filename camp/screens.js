// screens.js

let lastScreen = "main";   // only used by viewerBack

export function showScreen(id) {
  console.log("showScreen called with:", id);

  const current = document.querySelector(".screen.active");

  // Only update lastScreen when ENTERING the viewer
  if (id === "viewer" && current && current.id !== "viewer") {
    lastScreen = current.id;
  }

  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

export function goBack() {
  showScreen("main");
}

// Help panel
window.addEventListener("DOMContentLoaded", () => {
  const helpToggle = document.getElementById("helpToggle");
  const backHelp = document.getElementById("back_help");

  if (helpToggle) {
    helpToggle.addEventListener("change", () => {
      if (helpToggle.checked) {
        showScreen("helpPanel");
        helpToggle.checked = false; // auto-reset
      }
    });
  }

  if (backHelp) {
    backHelp.onclick = () => showScreen("main");
  }

  // Viewer back button — now returns to the correct previous screen
  const viewerBack = document.getElementById("viewerBack");
  if (viewerBack) {
    viewerBack.onclick = () => showScreen(lastScreen);
  }
});

// Docs viewer
export function showDocs(imageName) {
  const current = document.querySelector(".screen.active");
  if (current) {
    lastScreen = current.id;   // remember where viewer was opened from
  }

  const img = document.getElementById("viewerImage");
  img.src = `docs/${imageName}.png`;
  showScreen("viewer");
}