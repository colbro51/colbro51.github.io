import { initMaps, go, closeMapsFailModal } from "./maps.js";

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goBack() {
  showScreen("main");
}

window.onload = () => {
  initMaps();

  document.getElementById("title").innerText =
    "F&B WRTG Camp " + year_name;

  mon_easy.innerText = mon_easy_name;
  mon_med.innerText  = mon_med_name;
  mon_fit.innerText  = mon_fit_name;

  tue_easy.innerText = tue_easy_name;
  tue_med.innerText  = tue_med_name;
  tue_fit.innerText  = tue_fit_name;

  wed_easy.innerText = wed_easy_name;
  wed_med.innerText  = wed_med_name;
  wed_fit.innerText  = wed_fit_name;

  thu_easy.innerText = thu_easy_name;
  thu_med.innerText  = thu_med_name;
  thu_fit.innerText  = thu_fit_name;

  fri_easy.innerText = fri_easy_name;
  fri_med.innerText  = fri_med_name;
  fri_fit.innerText  = fri_fit_name;

  document.getElementById("btn_camp").onclick = () => go(camp_url);

  document.getElementById("btn_mon").onclick = () => showScreen("mon");
  document.getElementById("btn_tue").onclick = () => showScreen("tue");
  document.getElementById("btn_wed").onclick = () => showScreen("wed");
  document.getElementById("btn_thu").onclick = () => showScreen("thu");
  document.getElementById("btn_fri").onclick = () => showScreen("fri");

  document.getElementById("back_mon").onclick = goBack;
  document.getElementById("back_tue").onclick = goBack;
  document.getElementById("back_wed").onclick = goBack;
  document.getElementById("back_thu").onclick = goBack;
  document.getElementById("back_fri").onclick = goBack;

  mon_easy.onclick = () => go(mon_easy_url);
  mon_med.onclick  = () => go(mon_med_url);
  mon_fit.onclick  = () => go(mon_fit_url);

  tue_easy.onclick = () => go(tue_easy_url);
  tue_med.onclick  = () => go(tue_med_url);
  tue_fit.onclick  = () => go(tue_fit_url);

  wed_easy.onclick = () => go(wed_easy_url);
  wed_med.onclick  = () => go(wed_med_url);
  wed_fit.onclick  = () => go(wed_fit_url);

  thu_easy.onclick = () => go(thu_easy_url);
  thu_med.onclick  = () => go(thu_med_url);
  thu_fit.onclick  = () => go(thu_fit_url);

  fri_easy.onclick = () => go(fri_easy_url);
  fri_med.onclick  = () => go(fri_med_url);
  fri_fit.onclick  = () => go(fri_fit_url);

  document.getElementById("modal_ok").onclick = closeMapsFailModal;
};