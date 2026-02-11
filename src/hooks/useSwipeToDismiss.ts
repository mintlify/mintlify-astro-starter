import { useRef, useState, useCallback, useEffect } from 'react';

const DRAG_INTENT_THRESHOLD = 10;
const DRAG_DISMISS_THRESHOLD = 100;

interface UseSwipeToDismissOptions {
  enabled: boolean;
  sheetRef: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
}

export function useSwipeToDismiss({
  enabled,
  sheetRef,
  scrollRef,
  onDismiss,
}: UseSwipeToDismissOptions) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragYRef = useRef(0);
  const touchState = useRef<{
    startY: number;
    startScrollTop: number;
    isDismissGesture: boolean | null;
  }>({ startY: 0, startScrollTop: 0, isDismissGesture: null });

  const resetTouchState = useCallback(() => {
    setIsDragging(false);
    setDragY(0);
    dragYRef.current = 0;
    touchState.current = {
      startY: 0,
      startScrollTop: 0,
      isDismissGesture: null,
    };
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      setIsDragging(false);
      setDragY(0);
      dragYRef.current = 0;

      touchState.current = {
        startY: touch.clientY,
        startScrollTop: scrollRef.current?.scrollTop ?? 0,
        isDismissGesture: null,
      };
    },
    [scrollRef],
  );

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    const { startY, startScrollTop, isDismissGesture } = touchState.current;
    const deltaY = touch.clientY - startY;

    if (isDismissGesture === false) {
      return;
    }

    if (isDismissGesture === true) {
      e.preventDefault();
      const clamped = Math.max(0, deltaY);
      dragYRef.current = clamped;
      setDragY(clamped);
      return;
    }

    if (Math.abs(deltaY) < DRAG_INTENT_THRESHOLD) {
      return;
    }

    const wasAtTop = startScrollTop <= 0;
    const isMovingDown = deltaY > 0;

    if (wasAtTop && isMovingDown) {
      touchState.current.isDismissGesture = true;
      setIsDragging(true);
      e.preventDefault();
      dragYRef.current = deltaY;
      setDragY(deltaY);
    } else {
      touchState.current.isDismissGesture = false;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (
      touchState.current.isDismissGesture &&
      dragYRef.current > DRAG_DISMISS_THRESHOLD
    ) {
      onDismiss();
    }
    resetTouchState();
  }, [onDismiss, resetTouchState]);

  const handleTouchCancel = useCallback(() => {
    resetTouchState();
  }, [resetTouchState]);

  useEffect(() => {
    if (!enabled || !sheetRef.current) return;

    const element = sheetRef.current;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [
    enabled,
    sheetRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  ]);

  return { dragY, isDragging };
}
