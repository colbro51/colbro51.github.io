// gesture.js

export function attachPressEngine(element, {
  longPressMs = 600,
  moveThreshold = 10,
  onClick,
  onLongPress
}) {
  let downTime = null;
  let startX = 0;
  let startY = 0;
  let moved = false;
  let longPressEligible = true;

  // Prevent OS long-press immediately
  element.addEventListener("pointerdown", ev => {
    ev.preventDefault(); // critical for Samsung A-series
    downTime = ev.timeStamp;
    startX = ev.clientX;
    startY = ev.clientY;
    moved = false;
    longPressEligible = true;
  }, { passive: false });

  element.addEventListener("pointermove", ev => {
    if (!downTime) return;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    if (Math.hypot(dx, dy) > moveThreshold) {
      moved = true;
      longPressEligible = false;
    }
  });

  element.addEventListener("pointerup", ev => {
    if (!downTime) return;

    const duration = ev.timeStamp - downTime;

    if (longPressEligible && duration >= longPressMs) {
      onLongPress?.();
    }

    downTime = null;
  });

  // CLICK = primary tap detection (A06-friendly)
  element.addEventListener("click", ev => {
    if (!moved) {
      onClick?.();
    }
  });

  // Block OS context menu
  element.addEventListener("contextmenu", ev => ev.preventDefault());
}