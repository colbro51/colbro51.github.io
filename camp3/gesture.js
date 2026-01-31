// gesture.js

export function attachSimplePressEngine(element, {
  longPressMs = 500,
  onClick,
  onLongPress
}) {
  let startTime = 0;

  // 1. Record the moment the finger goes down
  element.addEventListener('pointerdown', (evt) => {
    startTime = performance.now();
  });

  // 2. When the browser fires a real click, decide tap vs long-press
  element.addEventListener('click', (evt) => {
    const duration = performance.now() - startTime;

    if (duration < longPressMs) {
      // TAP
      if (onClick) onClick(evt);
    } else {
      // LONG PRESS
      if (onLongPress) onLongPress(evt);
    }
  });

  // Optional: prevent context menu on long-press
  element.addEventListener('contextmenu', (evt) => evt.preventDefault());
}