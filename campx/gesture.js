// gesture.js

export function attachPressEngine(element, {
  longPressMs = 600,
  moveThreshold = 10,
  onClick,
  onLongPress
}) {
  let downTime = null;
  let startX = null;
  let startY = null;
  let movedTooFar = false;
  let resolved = false; // prevents double-firing

  element.addEventListener("pointerdown", ev => {
    downTime = ev.timeStamp;
    startX = ev.clientX;
    startY = ev.clientY;
    movedTooFar = false;
    resolved = false;
  });

  element.addEventListener("pointermove", ev => {
    if (downTime == null) return;

    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    if (Math.hypot(dx, dy) > moveThreshold) {
      movedTooFar = true;
    }
  });

  function finishGesture(ev) {
    if (resolved || downTime == null) return;

    const duration = ev.timeStamp - downTime;

    if (!movedTooFar && duration >= longPressMs) {
      resolved = true;
      onLongPress?.();
    } else if (!movedTooFar && duration < longPressMs) {
      resolved = true;
      onClick?.();
    }

    downTime = null;
  }

  element.addEventListener("pointerup", finishGesture);
  element.addEventListener("pointercancel", finishGesture);

  // CLICK FALLBACK
  element.addEventListener("click", ev => {
    if (resolved) return; // pointerup already handled it
    if (downTime == null) return; // no active gesture
    if (movedTooFar) return; // was a drag/scroll

    resolved = true;
    onClick?.();
  });

  // Prevent browser long-press menu
  element.addEventListener("contextmenu", evt => evt.preventDefault());
}