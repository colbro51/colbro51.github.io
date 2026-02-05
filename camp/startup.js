import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { showScreen } from "./screens.js";
import { enterHelp } from "./screens.js";

// ------------------------------------------------------------
// Utility: show exit screen (Firefox, wrong browser, etc.)
// ------------------------------------------------------------
function showExitScreen(title, message) {
    const canonicalURL = "https://colbro51.github.io/camp/";

    document.body.innerHTML = `
        <div style="padding:20px;font-family:sans-serif;max-width:500px;margin:auto;">
            <h2>${title}</h2>
            <p>${message}</p>
            <button id="copyLinkBtn"
                style="padding:12px 18px;font-size:16px;border-radius:8px;margin-top:12px;">
                Copy Link
            </button>
        </div>
    `;

    const btn = document.getElementById("copyLinkBtn");
    btn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(canonicalURL);
            alert("Link copied. Open Safari and paste to continue.");
        } catch (err) {
            const temp = document.createElement("input");
            temp.value = canonicalURL;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            temp.remove();
            alert("Link copied. Open Safari and paste to continue.");
        }
    });
}

// ------------------------------------------------------------
// First‑time help nudge
// ------------------------------------------------------------
const HELP_NUDGE_KEY = "helpNudgeShown";

function applyFirstTimeGreyoutAndHelp() {
    const hasShown = localStorage.getItem(HELP_NUDGE_KEY) === "true";
    if (hasShown) return;

    document.body.classList.add("disable-buttons");

    setTimeout(() => {
        document.body.classList.remove("disable-buttons");
        localStorage.setItem(HELP_NUDGE_KEY, "true");
        enterHelp();
    }, 1000);
}

// ------------------------------------------------------------
// Returning‑user detection (Safari only)
// ------------------------------------------------------------
const VISITED_KEY = "visitedBefore";

function markVisited() {
    localStorage.setItem(VISITED_KEY, "true");
}

function hasVisitedBefore() {
    return localStorage.getItem(VISITED_KEY) === "true";
}

// ------------------------------------------------------------
// Main startup
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const platform = params.get("platform");
    const browser = params.get("browser");
    const standalone = params.get("standalone") === "true";

    // Mark this visit for future Safari logic
    markVisited();

    // --------------------------------------------------------
    // Block Firefox anywhere
    // --------------------------------------------------------
    if (browser === "firefox") {
        showExitScreen(
            "Browser Not Supported",
            "This app cannot run in Firefox. Please reopen the link in your device's default browser."
        );
        throw new Error("Blocked: Firefox not supported");
    }

    // --------------------------------------------------------
    // iOS but not Safari
    // --------------------------------------------------------
    if (platform === "ios" && browser !== "safari") {
        showExitScreen(
            "Open in Safari",
            "To install this app, please reopen the link in Safari."
        );
        throw new Error("Blocked: iOS non-Safari browser");
    }

    // --------------------------------------------------------
    // NOT standalone → Install funnel
    // --------------------------------------------------------
    if (!standalone) {

        // Returning iOS Safari user
        if (platform === "ios" && browser === "safari" && hasVisitedBefore()) {
            showScreen("install_ios_returning");
            return;
        }

        // First‑time iOS Safari user
        if (platform === "ios") {
            showScreen("install_ios");
            return;
        }

        // Other platforms
        if (platform === "android") showScreen("install_android");
        else if (platform === "windows") showScreen("install_windows");
        else showScreen("install_other");

        return;
    }

    // --------------------------------------------------------
    // Standalone → Real app
    // --------------------------------------------------------
    showScreen("app_main");

    await initMaps();
    applyFirstTimeGreyoutAndHelp();

    const routesModule = await import("./routes.js");
    if (routesModule?.wireRoutes) routesModule.wireRoutes();

    const titleEl = document.getElementById("title");
    if (titleEl) titleEl.innerText = "F&B WRTG Camp " + year_name;
});