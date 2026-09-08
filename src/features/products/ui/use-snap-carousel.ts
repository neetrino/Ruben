"use client";

import {
  useCallback,
  useRef,
  useState,
  type RefObject,
  type UIEvent,
} from "react";

type SnapCarousel = {
  trackRef: RefObject<HTMLDivElement | null>;
  activeIndex: number;
  handleScroll: (event: UIEvent<HTMLDivElement>) => void;
  scrollToIndex: (index: number) => void;
};

/**
 * Drives a horizontal snap-scroll slide track: keeps the active slide in sync
 * while the finger drags, and scrolls programmatically for arrows, pagination
 * dots and thumbnails.
 */
export function useSnapCarousel(slideCount: number): SnapCarousel {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>): void => {
      const track = event.currentTarget;
      if (track.clientWidth === 0) return;

      const next = Math.round(track.scrollLeft / track.clientWidth);
      if (next < 0 || next >= slideCount) return;

      setActiveIndex(next);
    },
    [slideCount],
  );

  const scrollToIndex = useCallback(
    (index: number): void => {
      const track = trackRef.current;
      if (!track || index < 0 || index >= slideCount) return;

      track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
      setActiveIndex(index);
    },
    [slideCount],
  );

  return { trackRef, activeIndex, handleScroll, scrollToIndex };
}
