import { year_name } from "./camp-data.js";
import { initMaps } from "./maps.js";
import { showScreen, enterHelp } from "./screens.js";

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
// Main startup
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const platform = params.get("platform");
    const browser = params.get("browser");
    const standalone = params.get("standalone") === "true";
    const useGoogleMaps = params.get("usegmaps") === "true";
    const helpNudgeShown = params.get("helpnudge") === "true";

    // --------------------------------------------------------
    // Apply initial UI state from params
    // --------------------------------------------------------
    const mapsChk = document.getElementById("useGoogleMaps");
    if (mapsChk) mapsChk.checked = useGoogleMaps;

    // Reveal Google Maps toggle only where appropriate (iOS)
    const mapsLabel = document.getElementById("useGoogleMapsLabel");
    if (mapsLabel && platform === "ios") {
        mapsLabel.style.display = "flex";
        Array.from(mapsLabel.children).forEach(c => c.style.display = "");
    }

    // --------------------------------------------------------
    // First‑time help nudge (now correctly scoped)
    // --------------------------------------------------------
    function applyFirstTimeGreyoutAndHelp() {
        if (helpNudgeShown) return;

        document.body.classList.add("disable-buttons");

        setTimeout(() => {
            document.body.classList.remove("disable-buttons");
            localStorage.setItem("helpNudgeShown", "true");
            enterHelp();
        }, 1000);
    }

    // --------------------------------------------------------
    // Block Firefox anywhere
    // --------------------------------------------------------
    if (browser === "firefox") {
        showExitScreen(
            "Installer Not Supported",
            "The Camp installer cannot run in Firefox. Please reopen the link in your device's default browser to continue installation."
        );
        throw new Error("Blocked: Firefox not supported");
    }

    // --------------------------------------------------------
    // iOS but not Safari
    // --------------------------------------------------------
    if (platform === "ios" && browser !== "safari") {
        showExitScreen(
            "Open Installer in Safari",
            "To continue installing Camp, you must open this installer in Safari. Copy the link and paste it into Safari to proceed."
        );
        throw new Error("Blocked: iOS non-Safari browser");
    }

    // --------------------------------------------------------
    // NOT standalone → Install funnel
    // --------------------------------------------------------
    if (!standalone) {

        if (platform === "ios" && browser === "safari") {
            showScreen("install_ios");
            return;
        }

        if (platform === "android") {
            showScreen("install_android");
            return;
        }

        if (platform === "windows") {
            showScreen("install_windows");
            return;
        }

        showScreen("install_other");
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