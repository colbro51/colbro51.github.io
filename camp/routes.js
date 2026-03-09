// routes.js
import { camp_location, days, more } from "./camp-data.js";
import { go } from "./maps.js";
import { enterDay, enterViewer, goBack } from "./screens.js";
import { attachSimplePressEngine } from "./gesture.js";


// ------------------------------------------------------------
// Helper: wire a single route button (tap → Maps, long press → viewer)
// ------------------------------------------------------------
function wireRouteButton(id, mode, origin, dest) {
  const outer = document.getElementById(id);
  if (!outer) return;

  const hit = outer.querySelector(".btn-hit");
  if (!hit) return;

  attachSimplePressEngine(hit, {
    longPressMs: 500,

    onClick: () => {
      go(mode, origin, dest);
    },

    onLongPress: () => {
      enterViewer(id);
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
        const label = el.querySelector(".btn-label");
        if (label) label.innerText = route.name;

        wireRouteButton(id, route.mode, camp_location, route.dest);
      }
    });
  });


  // ------------------------------------------------------------
  // 2. Camp button (tap → Maps, long press → viewer)
  // ------------------------------------------------------------
  const campHit = document.querySelector("#btn_camp .btn-hit");
  if (campHit) {
    attachSimplePressEngine(campHit, {
      longPressMs: 500,

      onClick: () => {
        go("driving", "Current Location", camp_location);
      },

      onLongPress: () => {
        enterViewer("camp");
      }
    });
  }


  // ------------------------------------------------------------
  // 3. Day navigation buttons
  // ------------------------------------------------------------
  ["mon", "tue", "wed", "thu", "fri", "more"].forEach(day => {
    const btn = document.getElementById(`btn_${day}`);
    if (btn) {
      const hit = btn.querySelector(".btn-hit");
      if (hit) hit.onclick = () => enterDay(day);
    }
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

    const label = el.querySelector(".btn-label");
    if (label) label.innerText = item.name;

    wireRouteButton(id, item.mode, camp_location, item.dest);
  });
}