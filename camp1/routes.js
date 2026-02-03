// routes.js
import { camp_location, days, more } from "./camp-data.js";
import { go } from "./maps.js";
import { enterDay, enterViewer, goBack } from "./screens.js";
import { attachSimplePressEngine } from "./gesture.js";


// ------------------------------------------------------------
// Helper: wire a single route button (tap → viewer, long press → Maps)
// ------------------------------------------------------------
function wireRouteButton(id, mode, origin, dest) {
  const btn = document.getElementById(id);
  if (!btn) return;

  attachSimplePressEngine(btn, {
    longPressMs: 500,

    onClick: () => {
      // Short tap → viewer
      enterViewer(id);
    },

    onLongPress: () => {
      // Long press → Maps
      go(mode, origin, dest);
    }
  });
}


// ------------------------------------------------------------
// Wire everything AFTER initMaps() has completed
// ------------------------------------------------------------
export function wireRoutes() {

  // ------------------------------------------------------------
  // 1. Day labels + route buttons
  // ------------------------------------------------------------
  Object.entries(days).forEach(([day, routes]) => {
    Object.entries(routes).forEach(([difficulty, route]) => {
      const id = `${day}_${difficulty}`;
      const el = document.getElementById(id);

      if (el) {
        el.innerText = route.name;
        wireRouteButton(id, route.mode, camp_location, route.dest);
      }
    });
  });


  // ------------------------------------------------------------
  // 2. Camp button (tap → viewer, long press → Maps)
  // ------------------------------------------------------------
  attachSimplePressEngine(document.getElementById("btn_camp"), {
    longPressMs: 500,

    onClick: () => {
      enterViewer("camp");
    },

    onLongPress: () => {
      go("driving", "Current Location", camp_location);
    }
  });


  // ------------------------------------------------------------
  // 3. Day navigation buttons
  // ------------------------------------------------------------
  ["mon", "tue", "wed", "thu", "fri", "more"].forEach(day => {
    const btn = document.getElementById(`btn_${day}`);
    if (btn) btn.onclick = () => enterDay(day);
  });


  // ------------------------------------------------------------
  // 4. Back buttons
  // ------------------------------------------------------------
  ["mon", "tue", "wed", "thu", "fri", "more"].forEach(day => {
    const back = document.getElementById(`back_${day}`);
    if (back) back.onclick = goBack;
  });


  // ------------------------------------------------------------
  // 5. More items
  // ------------------------------------------------------------
  more.forEach((item, index) => {
    const id = `more_${index + 1}`;
    const el = document.getElementById(id);

    if (!el) return;

    if (!item.name || item.name.trim() === "") {
      el.classList.add("hidden");
      return;
    }

    el.innerText = item.name;
    wireRouteButton(id, item.mode, camp_location, item.dest);
  });
}