// acamp/startup.js

document.getElementById("continue").onclick = () => {
  // No skip flags, no redirects — just load the app
  window.location.href = "../camp/";
};

// If Chrome already installed the PWA, open the app directly
if (window.matchMedia("(display-mode: standalone)").matches) {
  window.location.href = "../camp/";
}