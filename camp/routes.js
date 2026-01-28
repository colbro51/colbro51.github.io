// routes.js
import {
  camp_origin,
  mon_easy_name, mon_med_name, mon_fit_name,
  tue_easy_name, tue_med_name, tue_fit_name,
  wed_easy_name, wed_med_name, wed_fit_name,
  thu_easy_name, thu_med_name, thu_fit_name,
  fri_easy_name, fri_med_name, fri_fit_name,
  mon_easy_mode, mon_med_mode, mon_fit_mode,
  tue_easy_mode, tue_med_mode, tue_fit_mode,
  wed_easy_mode, wed_med_mode, wed_fit_mode,
  thu_easy_mode, thu_med_mode, thu_fit_mode,
  fri_easy_mode, fri_med_mode, fri_fit_mode,
  mon_easy_dest, mon_med_dest, mon_fit_dest,
  tue_easy_dest, tue_med_dest, tue_fit_dest,
  wed_easy_dest, wed_med_dest, wed_fit_dest,
  thu_easy_dest, thu_med_dest, thu_fit_dest,
  fri_easy_dest, fri_med_dest, fri_fit_dest,
  more_1_name, more_1_mode, more_1_dest,
  more_2_name, more_2_mode, more_2_dest,
  more_3_name, more_3_mode, more_3_dest,
  more_4_name, more_4_mode, more_4_dest,
  more_5_name, more_5_mode, more_5_dest,
  more_6_name, more_6_mode, more_6_dest,
  more_7_name, more_7_mode, more_7_dest,
  more_8_name, more_8_mode, more_8_dest,
  more_9_name, more_9_mode, more_9_dest,
  more_10_name, more_10_mode, more_10_dest
} from "./camp-data.js";

import { go } from "./maps.js";
import { showScreen, showDocs } from "./screens.js";

// ------------------------------------------------------------
// Gesture model
// ------------------------------------------------------------
function attachGesture(el, onSingle, onLong) {
  let timer = null;
  const LONG = 500;

  el.addEventListener("touchstart", () => {
    timer = setTimeout(() => {
      timer = null;
      onLong();
    }, LONG);
  });

  el.addEventListener("touchend", () => {
    if (timer) {
      clearTimeout(timer);
      onSingle();
    }
  });

  el.addEventListener("touchmove", () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  });
}

// ------------------------------------------------------------
// Helper: image name = button ID
// ------------------------------------------------------------
function imageNameForButton(id) {
  return id; // filenames match IDs
}

// ------------------------------------------------------------
// Wire a route button
// ------------------------------------------------------------
function wireRouteButton(id, mode, dest) {
  const el = document.getElementById(id);
  if (!el) return;

  attachGesture(
    el,
    () => showDocs(imageNameForButton(id)),   // single tap → docs
    () => go(mode, camp_origin, dest)         // long press → maps
  );
}

// ------------------------------------------------------------
// Wire everything on DOMContentLoaded
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {

  document.getElementById("mon_easy").innerText = mon_easy_name;
  document.getElementById("mon_med").innerText  = mon_med_name;
  document.getElementById("mon_fit").innerText  = mon_fit_name;

  document.getElementById("tue_easy").innerText = tue_easy_name;
  document.getElementById("tue_med").innerText  = tue_med_name;
  document.getElementById("tue_fit").innerText  = tue_fit_name;

  document.getElementById("wed_easy").innerText = wed_easy_name;
  document.getElementById("wed_med").innerText  = wed_med_name;
  document.getElementById("wed_fit").innerText  = wed_fit_name;

  document.getElementById("thu_easy").innerText = thu_easy_name;
  document.getElementById("thu_med").innerText  = thu_med_name;
  document.getElementById("thu_fit").innerText  = thu_fit_name;

  document.getElementById("fri_easy").innerText = fri_easy_name;
  document.getElementById("fri_med").innerText  = fri_med_name;
  document.getElementById("fri_fit").innerText  = fri_fit_name;

  // Camp button
  attachGesture(
    document.getElementById("btn_camp"),
    () => showDocs("camp"),
    () => go("driving", "Current Location", camp_origin)
  );

  // Day screens
  document.getElementById("btn_mon").onclick = () => showScreen("mon");
  document.getElementById("btn_tue").onclick = () => showScreen("tue");
  document.getElementById("btn_wed").onclick = () => showScreen("wed");
  document.getElementById("btn_thu").onclick = () => showScreen("thu");
  document.getElementById("btn_fri").onclick = () => showScreen("fri");
  document.getElementById("btn_more").onclick = () => showScreen("more");

  // Monday
  wireRouteButton("mon_easy", mon_easy_mode, mon_easy_dest);
  wireRouteButton("mon_med",  mon_med_mode,  mon_med_dest);
  wireRouteButton("mon_fit",  mon_fit_mode,  mon_fit_dest);

  // Tuesday
  wireRouteButton("tue_easy", tue_easy_mode, tue_easy_dest);
  wireRouteButton("tue_med",  tue_med_mode,  tue_med_dest);
  wireRouteButton("tue_fit",  tue_fit_mode,  tue_fit_dest);

  // Wednesday
  wireRouteButton("wed_easy", wed_easy_mode, wed_easy_dest);
  wireRouteButton("wed_med",  wed_med_mode,  wed_med_dest);
  wireRouteButton("wed_fit",  wed_fit_mode,  wed_fit_dest);

  // Thursday
  wireRouteButton("thu_easy", thu_easy_mode, thu_easy_dest);
  wireRouteButton("thu_med",  thu_med_mode,  thu_med_dest);
  wireRouteButton("thu_fit",  thu_fit_mode,  thu_fit_dest);

  // Friday
  wireRouteButton("fri_easy", fri_easy_mode, fri_easy_dest);
  wireRouteButton("fri_med",  fri_med_mode,  fri_med_dest);
  wireRouteButton("fri_fit",  fri_fit_mode,  fri_fit_dest);

  // More items
  const moreItems = [
    [more_1_name, more_1_mode, more_1_dest],
    [more_2_name, more_2_mode, more_2_dest],
    [more_3_name, more_3_mode, more_3_dest],
    [more_4_name, more_4_mode, more_4_dest],
    [more_5_name, more_5_mode, more_5_dest],
    [more_6_name, more_6_mode, more_6_dest],
    [more_7_name, more_7_mode, more_7_dest],
    [more_8_name, more_8_mode, more_8_dest],
    [more_9_name, more_9_mode, more_9_dest],
    [more_10_name, more_10_mode, more_10_dest]
  ];

  moreItems.forEach((item, index) => {
    const [name, mode, dest] = item;
    const id = `more_${index + 1}`;
    const el = document.getElementById(id);

    if (!name || name.trim() === "") {
      el.style.display = "none";
      return;
    }

    el.innerText = name;
    wireRouteButton(id, mode, dest);
  });
});