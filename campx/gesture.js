// gesture.js

console.log("GESTURE.JS LOADED", Date.now());

export function attachSimplePressEngine(element, {
  longPressMs = 2000,
  holdoffMs = 3000,     // NEW: ignore all events after long-press
  onClick,
  onLongPress
}) {
  let timer = null;
  let longPressFired = false;
  let holdoffUntil = 0; // timestamp until which all events are ignored

  function inHoldoff() {
    return Date.now() < holdoffUntil;
  }

  element.addEventListener("pointerdown", () => {
    if (inHoldoff()) {
      console.log("[GESTURE] pointerdown ignored (holdoff active)", element.id);
      return;
    }

    console.log("[GESTURE] pointerdown on", element.id);
    longPressFired = false;

    timer = setTimeout(() => {
      longPressFired = true;
      console.log("[GESTURE] longPress FIRE on", element.id);

      // Start holdoff window
      holdoffUntil = Date.now() + holdoffMs;

      if (onLongPress) onLongPress();
    }, longPressMs);
  });

  element.addEventListener("click", () => {
    if (inHoldoff()) {
      console.log("[GESTURE] click ignored (holdoff active)", element.id);
      return;
    }

    console.log("[GESTURE] click on", element.id, "longPressFired =", longPressFired);

    if (longPressFired) {
      console.log("[GESTURE] click suppressed because long-press already fired");
      return;
    }

    clearTimeout(timer);
    timer = null;

    if (onClick) onClick();
  });

  element.addEventListener("contextmenu", evt => evt.preventDefault());
}