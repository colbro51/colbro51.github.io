export function attachSimplePressEngine(element, {
  longPressMs = 2000,
  onClick,
  onLongPress
}) {
  let timer = null;
  let longPressFired = false;

  element.addEventListener("pointerdown", () => {
    longPressFired = false;

    timer = setTimeout(() => {
      longPressFired = true;
      if (onLongPress) onLongPress();
    }, longPressMs);
  });

  element.addEventListener("click", () => {
    // If long‑press already happened, ignore click
    if (longPressFired) return;

    // Otherwise this is a tap
    clearTimeout(timer);
    timer = null;

    if (onClick) onClick();
  });

  // Optional: block context menu
  element.addEventListener("contextmenu", evt => evt.preventDefault());
}