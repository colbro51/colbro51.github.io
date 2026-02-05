import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { showScreen } from "./screens.js";

window.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const platform = params.get("platform");
  const standalone = params.get("standalone") === "true";

  if (!standalone) {
    if (platform === "android") showScreen("install_android");
    else if (platform === "ios") showScreen("install_ios");
    else if (platform === "windows") showScreen("install_windows");
    else showScreen("install_other");
    return;
  }

  // Standalone → real app
  showScreen("app_main");

  await initMaps();

  const routesModule = await import("./routes.js");
  if (routesModule?.wireRoutes) routesModule.wireRoutes();

  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.innerText = "F&B WRTG Camp " + year_name;
});