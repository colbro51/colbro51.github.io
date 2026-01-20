import { initMaps, go } from "./maps.js";

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goBack() {
  showScreen('main');
}

window.onload = () => {
  initMaps();

  document.getElementById("title").innerText =
      "F&B WRTG Camp " + year_name;

  // Fill labels
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

  // Wire up buttons
  document.querySelector("[onclick='go(camp_url)']")
    ?.addEventListener("click", () => go(camp_url));

  document.querySelector("[onclick=\"showScreen('mon')\"]")
    ?.addEventListener("click", () => showScreen('mon'));

  // Repeat for tue, wed, thu, fri
  document.querySelector("[onclick=\"showScreen('tue')\"]")
    ?.addEventListener("click", () => showScreen('tue'));

  document.querySelector("[onclick=\"showScreen('wed')\"]")
    ?.addEventListener("click", () => showScreen('wed'));

  document.querySelector("[onclick=\"showScreen('thu')\"]")
    ?.addEventListener("click", () => showScreen('thu'));

  document.querySelector("[onclick=\"showScreen('fri')\"]")
    ?.addEventListener("click", () => showScreen('fri'));

  // Wire up back buttons
  document.querySelectorAll(".backonly")
    .forEach(btn => btn.addEventListener("click", goBack));

  // Wire up all route buttons
  document.getElementById("mon_easy").addEventListener("click", () => go(mon_easy_url));
  document.getElementById("mon_med").addEventListener("click", () => go(mon_med_url));
  document.getElementById("mon_fit").addEventListener("click", () => go(mon_fit_url));

  document.getElementById("tue_easy").addEventListener("click", () => go(tue_easy_url));
  document.getElementById("tue_med").addEventListener("click", () => go(tue_med_url));
  document.getElementById("tue_fit").addEventListener("click", () => go(tue_fit_url));

  document.getElementById("wed_easy").addEventListener("click", () => go(wed_easy_url));
  document.getElementById("wed_med").addEventListener("click", () => go(wed_med_url));
  document.getElementById("wed_fit").addEventListener("click", () => go(wed_fit_url));

  document.getElementById("thu_easy").addEventListener("click", () => go(thu_easy_url));
  document.getElementById("thu_med").addEventListener("click", () => go(thu_med_url));
  document.getElementById("thu_fit").addEventListener("click", () => go(thu_fit_url));

  document.getElementById("fri_easy").addEventListener("click", () => go(fri_easy_url));
  document.getElementById("fri_med").addEventListener("click", () => go(fri_med_url));
  document.getElementById("fri_fit").addEventListener("click", () => go(fri_fit_url));
};