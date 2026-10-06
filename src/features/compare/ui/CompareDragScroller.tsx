"use client";

import {
  useCallback,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

/** Ignore click jitter. Capture and suppress navigation only after a real drag. */
const DRAG_CLICK_THRESHOLD_PX = 10;

type CompareDragScrollerProps = {
  children: ReactNode;
};

/**
 * Horizontal compare table scroller. Mouse drag moves the row; a short press
 * still activates links and buttons. Touch keeps native scrolling.
 */
export function CompareDragScroller({ children }: CompareDragScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || !el || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(deltaX) < DRAG_CLICK_THRESHOLD_PX) return;
      drag.moved = true;
      setIsDragging(true);
      if (!el.hasPointerCapture(event.pointerId)) {
        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          // Capture is optional. The move still scrolls while the pointer stays over the table.
        }
      }
    }

    el.scrollLeft = drag.startScrollLeft - deltaX;
    event.preventDefault();
  }, []);

  const endDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.moved && el && el.scrollLeft !== drag.startScrollLeft) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const onClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onDragStart = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div
      ref={scrollerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onDragStart={onDragStart}
      className={`-mx-4 overflow-x-auto [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden ${
        isDragging ? "cursor-grabbing select-none" : "cursor-grab"
      }`}
    >
      {children}
    </div>
  );
}
