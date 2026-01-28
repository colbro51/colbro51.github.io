// screens.js
export function showScreen(id) {
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

  // Viewer back button
  const viewerBack = document.getElementById("viewerBack");
  if (viewerBack) {
    viewerBack.onclick = () => showScreen("main");
  }
});

// Docs viewer
export function showDocs(imageName) {
  const img = document.getElementById("viewerImage");
  img.src = `docs/${imageName}.png`;
  showScreen("viewer");
}