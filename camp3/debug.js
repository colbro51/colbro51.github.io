// debug.js

export function log(...args) {
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