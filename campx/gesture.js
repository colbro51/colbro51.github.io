// gesture.js

export function attachPressEngine(element, {
  longPressMs = 600,
  moveThreshold = 10, // px
  onClick,
  onLongPress
}) {
  let downTime = null;
  let startX = null;
  let startY = null;
  let movedTooFar = false;

  element.addEventListener("pointerdown", ev => {
    downTime = ev.timeStamp;
    startX = ev.clientX;
    startY = ev.clientY;
    movedTooFar = false;
  });

  element.addEventListener("pointermove", ev => {
    if (downTime == null) return;

    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    const dist = Math.hypot(dx, dy);

    if (dist > moveThreshold) {
      movedTooFar = true;
    }
  });

  function finishGesture(ev) {
    if (downTime == null) return;

    const duration = ev.timeStamp - downTime;

    if (!movedTooFar && duration >= longPressMs) {
      onLongPress?.();
    } else if (!movedTooFar && duration < longPressMs) {
      onClick?.();
    }

    downTime = null;
  }

  element.addEventListener("pointerup", finishGesture);
  element.addEventListener("pointercancel", finishGesture);

  element.addEventListener("contextmenu", evt => evt.preventDefault());
}