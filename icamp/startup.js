// icamp/startup.js

document.getElementById("continue").onclick = () => {
  window.location.href = "../camp/";
};

// If already installed, go straight to the app
if (window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches) {
  window.location.href = "../camp/";
}