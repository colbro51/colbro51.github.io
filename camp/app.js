// app.js
// Core bootstrap for the Camp application.
// Runs identically on iOS, Android, Windows, and browser mode.

// ---------------------------------------------------------------------------
// 1. Mount point
// ---------------------------------------------------------------------------
const appRoot = document.getElementById("app");

// Safety check
if (!appRoot) {
    console.error("Camp: #app mount point not found");
}


// ---------------------------------------------------------------------------
// 2. Initialize the home screen
// ---------------------------------------------------------------------------
// Assumes screens.js exposes: renderHomeScreen(container)
if (typeof renderHomeScreen === "function") {
    renderHomeScreen(appRoot);
} else {
    console.error("Camp: renderHomeScreen() missing (check screens.js)");
}


// ---------------------------------------------------------------------------
// 3. Wire up global navigation handlers
// ---------------------------------------------------------------------------
// These functions are assumed to exist in routes.js or screens.js:
//   goToDay(dayName)
//   showTripDetails(tripId)
//   launchMaps(lat, lng, mode)

window.Camp = {
    goToDay: function(dayName) {
        if (typeof goToDay === "function") {
            goToDay(dayName);
        } else {
            console.error("Camp: goToDay() missing");
        }
    },

    showTripDetails: function(tripId) {
        if (typeof showTripDetails === "function") {
            showTripDetails(tripId);
        } else {
            console.error("Camp: showTripDetails() missing");
        }
    },

    launchMaps: function(lat, lng, mode) {
        if (typeof launchMaps === "function") {
            launchMaps(lat, lng, mode);
        } else {
            console.error("Camp: launchMaps() missing");
        }
    }
};


// ---------------------------------------------------------------------------
// 4. Optional: expose a simple reload/reset
// ---------------------------------------------------------------------------
window.Camp.reset = function() {
    if (typeof renderHomeScreen === "function") {
        renderHomeScreen(appRoot);
    }
};