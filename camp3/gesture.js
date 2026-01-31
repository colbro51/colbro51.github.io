// gesture.js

export function attachUniversalPressEngine(element, {
  longPressMs = 500,
  moveThresholdPx = 30,
  onClick,
  onLongPress
}) {
  let state = 'idle';
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let longPressTimer = null;
  let suppressNextClick = false;

  function getPoint(evt) {
    if (evt.touches && evt.touches.length > 0) {
      return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
    }
    if (evt.changedTouches && evt.changedTouches.length > 0) {
      return { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
    }
    return { x: evt.clientX, y: evt.clientY };
  }

  function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function startPress(evt) {
    const { x, y } = getPoint(evt);
    startX = x;
    startY = y;
    startTime = performance.now();
    state = 'pressing';
    suppressNextClick = false;

    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }

    longPressTimer = setTimeout(() => {
      if (state === 'pressing') {
        state = 'longPressed';
        suppressNextClick = true;
        if (onLongPress) onLongPress(evt);
      }
    }, longPressMs);
  }

  function movePress(evt) {
    if (state !== 'pressing') return;
    const { x, y } = getPoint(evt);
    if (distance(startX, startY, x, y) > moveThresholdPx) {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      state = 'cancelled';
    }
  }

  function endPress(evt) {
    // If we were cancelled or already long‑pressed, ignore this end
    if (state !== 'pressing') {
      state = 'idle';
      return;
    }

    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    const duration = performance.now() - startTime;

    if (duration < longPressMs && !suppressNextClick) {
      if (onClick) onClick(evt);
    }

    state = 'idle';
  }

  function cancelPress() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    state = 'cancelled';
  }

  const hasPointerEvents = window.PointerEvent !== undefined;

  if (hasPointerEvents) {
    element.addEventListener('pointerdown', (evt) => {
      if (evt.button !== 0) return;
      element.setPointerCapture(evt.pointerId);
      evt.preventDefault();
      startPress(evt);
    });

    element.addEventListener('pointermove', movePress);

    element.addEventListener('pointerup', (evt) => {
      try { element.releasePointerCapture(evt.pointerId); } catch {}
      endPress(evt);
    });

    element.addEventListener('pointercancel', (evt) => {
      try { element.releasePointerCapture(evt.pointerId); } catch {}
      cancelPress();
    });
  } else {
    // Touch fallback
    element.addEventListener('touchstart', (evt) => {
      startPress(evt);
    }, { passive: true });

    element.addEventListener('touchmove', movePress, { passive: true });
    element.addEventListener('touchend', endPress);
    element.addEventListener('touchcancel', cancelPress);

    // Mouse fallback (desktop)
    element.addEventListener('mousedown', (evt) => {
      if (evt.button !== 0) return;
      startPress(evt);
    });

    element.addEventListener('mousemove', movePress);
    element.addEventListener('mouseup', endPress);
    element.addEventListener('mouseleave', cancelPress);
  }

  element.addEventListener('click', (evt) => {
    if (suppressNextClick) {
      suppressNextClick = false;
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }
  });

  element.addEventListener('contextmenu', (evt) => {
    evt.preventDefault();
  });
}