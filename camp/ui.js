import {
  year_name,
  camp_origin,
  mon_easy_name,
  mon_med_name,
  mon_fit_name,
  tue_easy_name,
  tue_med_name,
  tue_fit_name,
  wed_easy_name,
  wed_med_name,
  wed_fit_name,
  thu_easy_name,
  thu_med_name,
  thu_fit_name,
  fri_easy_name,
  fri_med_name,
  fri_fit_name,
  mon_easy_mode,
  mon_med_mode,
  mon_fit_mode,
  tue_easy_mode,
  tue_med_mode,
  tue_fit_mode,
  wed_easy_mode,
  wed_med_mode,
  wed_fit_mode,
  thu_easy_mode,
  thu_med_mode,
  thu_fit_mode,
  fri_easy_mode,
  fri_med_mode,
  fri_fit_mode,
  mon_easy_dest,
  mon_med_dest,
  mon_fit_dest,
  tue_easy_dest,
  tue_med_dest,
  tue_fit_dest,
  wed_easy_dest,
  wed_med_dest,
  wed_fit_dest,
  thu_easy_dest,
  thu_med_dest,
  thu_fit_dest,
  fri_easy_dest,
  fri_med_dest,
  fri_fit_dest
} from "./camp-data.js";

import { initMaps, go, closeMapsFailModal } from "./maps.js";
import { detectOS } from "./logic.js";

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goBack() {
  showScreen("main");
}

window.addEventListener("DOMContentLoaded", () => {

  initMaps();

  const os = detectOS();

  if (os === "ios" || os === "ipad") {
      const checkbox = document.getElementById("useGoogleMaps");
      const label = checkbox.closest("label");
      if (label) label.style.display = "flex";
  }

  document.getElementById("title").innerText =
    "F&B WRTG Camp " + year_name;

  // Fill labels
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

  // Main screen buttons
  document.getElementById("btn_camp").onclick = () =>
    go("driving", "Current Location", camp_origin);

  document.getElementById("btn_mon").onclick = () => showScreen("mon");
  document.getElementById("btn_tue").onclick = () => showScreen("tue");
  document.getElementById("btn_wed").onclick = () => showScreen("wed");
  document.getElementById("btn_thu").onclick = () => showScreen("thu");
  document.getElementById("btn_fri").onclick = () => showScreen("fri");

  // Back buttons
  document.getElementById("back_mon").onclick = goBack;
  document.getElementById("back_tue").onclick = goBack;
  document.getElementById("back_wed").onclick = goBack;
  document.getElementById("back_thu").onclick = goBack;
  document.getElementById("back_fri").onclick = goBack;

  // Monday
  document.getElementById("mon_easy").onclick = () =>
    go(mon_easy_mode, camp_origin, mon_easy_dest);
  document.getElementById("mon_med").onclick = () =>
    go(mon_med_mode, camp_origin, mon_med_dest);
  document.getElementById("mon_fit").onclick = () =>
    go(mon_fit_mode, camp_origin, mon_fit_dest);

  // Tuesday
  document.getElementById("tue_easy").onclick = () =>
    go(tue_easy_mode, camp_origin, tue_easy_dest);
  document.getElementById("tue_med").onclick = () =>
    go(tue_med_mode, camp_origin, tue_med_dest);
  document.getElementById("tue_fit").onclick = () =>
    go(tue_fit_mode, camp_origin, tue_fit_dest);

  // Wednesday
  document.getElementById("wed_easy").onclick = () =>
    go(wed_easy_mode, camp_origin, wed_easy_dest);
  document.getElementById("wed_med").onclick = () =>
    go(wed_med_mode, camp_origin, wed_med_dest);
  document.getElementById("wed_fit").onclick = () =>
    go(wed_fit_mode, camp_origin, wed_fit_dest);

  // Thursday
  document.getElementById("thu_easy").onclick = () =>
    go(thu_easy_mode, camp_origin, thu_easy_dest);
  document.getElementById("thu_med").onclick = () =>
    go(thu_med_mode, camp_origin, thu_med_dest);
  document.getElementById("thu_fit").onclick = () =>
    go(thu_fit_mode, camp_origin, thu_fit_dest);

  // Friday
  document.getElementById("fri_easy").onclick = () =>
    go(fri_easy_mode, camp_origin, fri_easy_dest);
  document.getElementById("fri_med").onclick = () =>
    go(fri_med_mode, camp_origin, fri_med_dest);
  document.getElementById("fri_fit").onclick = () =>
    go(fri_fit_mode, camp_origin, fri_fit_dest);

   document.getElementById("modal_ok").onclick = closeMapsFailModal;
});
