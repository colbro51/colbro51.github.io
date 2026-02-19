// gesture.js

console.log("GESTURE.JS LOADED", Date.now());

export function attachSimplePressEngine(element, {
  longPressMs = 2000,
  onClick,
  onLongPress
}) {
  let timer = null;
  let longPressFired = false;

  element.addEventListener("pointerdown", () => {
    console.log("[GESTURE] pointerdown on", element.id);
    longPressFired = false;

    timer = setTimeout(() => {
      longPressFired = true;
      console.log("[GESTURE] longPress FIRE on", element.id);
      if (onLongPress) onLongPress();
    }, longPressMs);
  });

  element.addEventListener("click", () => {
    console.log("[GESTURE] click on", element.id, "longPressFired =", longPressFired);

    if (longPressFired) return;

    clearTimeout(timer);
    timer = null;

    if (onClick) onClick();
  });

  element.addEventListener("contextmenu", evt => evt.preventDefault());
}