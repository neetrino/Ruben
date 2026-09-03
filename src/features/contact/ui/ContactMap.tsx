"use client";

import { useState } from "react";

import { LazyWhenVisible } from "@/components/loading/LazyWhenVisible";
import { STORE_MAP_EMBED_SRC } from "@/lib/store/map-embed";

type ContactMapProps = {
  title: string;
};

const MAP_ROOT_MARGIN = "240px 0px";

/** Below-the-fold map — mounts the embed only when near the viewport. */
export function ContactMap({ title }: ContactMapProps) {
  const [isReady, setIsReady] = useState(false);

  return (
    <section
      className="relative z-10 mt-4 border-t border-gray-100 bg-white px-4 pb-12 [content-visibility:auto] [contain-intrinsic-size:auto_560px] sm:px-6 sm:pb-16 lg:px-8 lg:pb-20"
      aria-label={title}
    >
      <div className="mx-auto max-w-7xl pt-10 sm:pt-12">
        <div className="overflow-hidden rounded-[20px] border border-gray-200/80 bg-gray-100 shadow-[0_18px_50px_-28px_rgba(17,24,39,0.22)]">
          <LazyWhenVisible
            rootMargin={MAP_ROOT_MARGIN}
            className="relative h-[min(500px,70vw)] w-full sm:h-[500px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-gray-100" aria-hidden />
            }
          >
            {!isReady ? (
              <div className="absolute inset-0 animate-pulse bg-gray-100" aria-hidden />
            ) : null}
            <iframe
              title={title}
              src={STORE_MAP_EMBED_SRC}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsReady(true)}
              className={`h-full w-full border-0 transition-opacity duration-500 ease-out ${
                isReady ? "opacity-100" : "opacity-0"
              }`}
              allowFullScreen
            />
          </LazyWhenVisible>
        </div>
      </div>
    </section>
  );
}
