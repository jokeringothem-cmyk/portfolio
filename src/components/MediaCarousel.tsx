"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { VideoPlayer } from "./VideoPlayer";

export interface MediaItem {
  type: "video" | "image";
  path: string;
  label?: string;
}

export function MediaCarousel({ items }: { items: MediaItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    return () => el.removeEventListener("scroll", updateButtons);
  }, [updateButtons]);

  // Update active index on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActiveIndex(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir === "next" ? w : -w, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative px-0 sm:px-2">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth rounded-xl sm:rounded-2xl"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-full flex flex-col items-center px-1 sm:px-0"
          >
            <div className="w-full max-h-[50vh] sm:max-h-[60vh] rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center">
              {item.type === "video" ? (
                <VideoPlayer src={item.path} className="w-full max-h-[50vh] sm:max-h-[60vh]" />
              ) : (
                <img
                  src={item.path}
                  alt={item.label || ""}
                  className="w-full max-h-[50vh] sm:max-h-[60vh] object-contain"
                />
              )}
            </div>
            {item.label && (
              <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-[#86868b] font-medium tracking-wide text-center px-2">
                {item.label}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Arrow buttons — smaller and closer on mobile */}
      {items.length > 1 && (
        <>
          {!atStart && (
            <button
              onClick={() => scroll("prev")}
              className="absolute left-0 sm:left-3 top-[40%] -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/70 sm:bg-white/80 backdrop-blur shadow-lg border border-black/5 flex items-center justify-center hover:bg-white transition-colors z-10"
              aria-label="Previous"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1d1d1f]"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
          )}
          {!atEnd && (
            <button
              onClick={() => scroll("next")}
              className="absolute right-0 sm:right-3 top-[40%] -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/70 sm:bg-white/80 backdrop-blur shadow-lg border border-black/5 flex items-center justify-center hover:bg-white transition-colors z-10"
              aria-label="Next"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1d1d1f]"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          )}
        </>
      )}

      {/* Dots — larger touch targets on mobile */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 sm:gap-1.5 mt-3 sm:mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current;
                if (el) el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
              }}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-[#f5f5f7] w-5 sm:w-4 h-1.5"
                  : "bg-[#86868b]/30 w-1.5 h-1.5"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
