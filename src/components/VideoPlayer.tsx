"use client";

import { useEffect, useRef, useState } from "react";

export function VideoPlayer({ src, className = "" }: { src: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!loaded) setLoaded(true);
            const video = videoRef.current;
            if (video) video.play().catch(() => {});
          } else {
            const video = videoRef.current;
            if (video) video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [loaded]);

  return (
    <div ref={containerRef} className={className}>
      {loaded ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          className="w-full max-h-[50vh] sm:max-h-[60vh] object-contain"
        />
      ) : (
        <div className="w-full max-h-[50vh] sm:max-h-[60vh] flex items-center justify-center bg-zinc-900/60">
          <div className="flex flex-col items-center gap-2">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-600">
              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" opacity="0.3" />
            </svg>
            <span className="text-[10px] text-zinc-600 font-medium tracking-wide">Video</span>
          </div>
        </div>
      )}
    </div>
  );
}
