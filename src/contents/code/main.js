// === KBreakReminder ===
// Forces periodic micro-breaks by flashing (minimizing/restoring) the active window

const cfg = {
    intervalMinutes:     readConfig("intervalMinutes", 15),
    longEveryNCycles:    readConfig("longEveryNCycles", 4),
    shortTotalSeconds:   readConfig("shortTotalSeconds", 15),
    shortFlashIntervalMs: readConfig("shortFlashIntervalMs", 500),
    longTotalSeconds:    readConfig("longTotalSeconds", 60),
    longFlashIntervalMs: readConfig("longFlashIntervalMs", 1000)
};

let cycleCounter = 0;
let lastActivityTime = Date.now();
let mainTimer = null;
let activeFlashTimer = null;

// ────────────────────────────────────────────────
function restoreWindow(w) {
    if (!w || w.deleted) return;
    w.minimized = false;
    workspace.activeWindow = w;
}

// ────────────────────────────────────────────────
function checkIfWeWereSleeping() {
    const now = Date.now();
    const diffMs = now - lastActivityTime;
    const diffMin = diffMs / 60000;

    // Always update last activity time
    lastActivityTime = now;

    if (diffMin <= 2) {
        return false;  // normal activity
    }

    print(`KBreakReminder: Computer was inactive for ~${Math.round(diffMin)} min`);

    // Short inactivity / screen turned off
    if (diffMin < 10) {
        if (mainTimer) {
            mainTimer.stop();
            mainTimer.start();
            print("→ short inactivity → main timer restarted");
        }
        return true;
    }

    // Longer sleep / real suspend / system sleep
    print(`→ long sleep detected (~${Math.round(diffMin)} min) → full reset`);

    cycleCounter = 0;

    if (mainTimer) {
        mainTimer.stop();
        mainTimer.start();
    }

    // Stop active flashing if it is running
    if (activeFlashTimer) {
        activeFlashTimer.stop();
        activeFlashTimer = null;

        const current = workspace.activeWindow;
        if (current && !current.deleted) {
            restoreWindow(current);
            print("→ flashing stopped after resume");
        }
    }

    return true;
}

// ────────────────────────────────────────────────
function startFlashCycle() {
    if (activeFlashTimer) {
        print("Flash cycle already running → skipping duplicate trigger");
        return;
    }

    let savedWindow = workspace.activeWindow;
    if (!savedWindow || savedWindow.fullScreen) return;

    cycleCounter++;
    const isLongCycle = (cycleCounter % cfg.longEveryNCycles === 0);
    const totalSec = isLongCycle ? cfg.longTotalSeconds : cfg.shortTotalSeconds;
    const flashMs  = isLongCycle ? cfg.longFlashIntervalMs : cfg.shortFlashIntervalMs;

    let flashElapsed = 0;
    let flashTimer = new QTimer();
    flashTimer.interval = flashMs;
    flashTimer.singleShot = false;
    activeFlashTimer = flashTimer;

    flashTimer.timeout.connect(() => {
        if (!savedWindow || savedWindow.deleted) {
            flashTimer.stop();
            activeFlashTimer = null;
            return;
        }

        if (checkIfWeWereSleeping()) {
            flashTimer.stop();
            restoreWindow(savedWindow);
            activeFlashTimer = null;
            print(`KBreakReminder: Flashing interrupted after resume | ${savedWindow.caption}`);
            return;
        }

        if (savedWindow.minimized) {
            restoreWindow(savedWindow);
        } else {
            savedWindow.minimized = true;
        }

        flashElapsed += flashMs;
        if (flashElapsed >= totalSec * 1000) {
            restoreWindow(savedWindow);
            flashTimer.stop();
            activeFlashTimer = null;
            print(`KBreakReminder: Cycle finished | window: ${savedWindow.caption} | type: ${isLongCycle ? "LONG" : "SHORT"} | cycle: ${cycleCounter}`);
        }
    });

    flashTimer.start();

    print(`KBreakReminder: Starting flash | window: ${savedWindow.caption} | type: ${isLongCycle ? "LONG" : "SHORT"} | interval: ${flashMs} ms | duration: ${totalSec} s`);
}

// ────────────────────────────────────────────────
mainTimer = new QTimer();
mainTimer.interval = cfg.intervalMinutes * 60 * 1000;
mainTimer.singleShot = false;
mainTimer.timeout.connect(startFlashCycle);
mainTimer.start();

// ────────────────────────────────────────────────
// Watchdog – faster resume detection after system wake
let activityWatchdog = new QTimer();
activityWatchdog.interval = 15000;   // 15 seconds instead of 60
activityWatchdog.singleShot = false;
activityWatchdog.timeout.connect(checkIfWeWereSleeping);
activityWatchdog.start();

// ────────────────────────────────────────────────
print(
    "KBreakReminder started",
    ` short break every ${cfg.intervalMinutes} min`,
    ` long break every ${cfg.longEveryNCycles} short cycles`,
    ` short: ${cfg.shortTotalSeconds}s / flash every ${cfg.shortFlashIntervalMs}ms`,
    ` long: ${cfg.longTotalSeconds}s / flash every ${cfg.longFlashIntervalMs}ms`
);
