"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Project } from "@/lib/api";
import { useLocale } from "@/lib/locale";

function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="sm:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50"
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <span
        className={`block w-4 h-px bg-[#f5f5f7] transition-all duration-300 origin-center ${
          open ? "translate-y-[3.5px] rotate-45" : ""
        }`}
      />
      <span
        className={`block w-4 h-px bg-[#f5f5f7] transition-all duration-300 ${
          open ? "opacity-0 scale-x-0" : ""
        }`}
      />
      <span
        className={`block w-4 h-px bg-[#f5f5f7] transition-all duration-300 origin-center ${
          open ? "-translate-y-[3.5px] -rotate-45" : ""
        }`}
      />
    </button>
  );
}

function LangToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="relative flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/[0.06]">
      <div
        className="absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-full bg-white/[0.12] transition-all duration-300 ease-out"
        style={{ left: locale === "en" ? "calc(50% + 1px)" : "1px" }}
      />
      <button
        onClick={() => setLocale("en")}
        className={`relative z-10 px-2.5 py-1 text-[10px] font-medium tracking-wider transition-colors duration-200 ${
          locale === "en" ? "text-[#f5f5f7]" : "text-[#f5f5f7]/40 hover:text-[#f5f5f7]/60"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("zh")}
        className={`relative z-10 px-2.5 py-1 text-[10px] font-medium tracking-wider transition-colors duration-200 ${
          locale === "zh" ? "text-[#f5f5f7]" : "text-[#f5f5f7]/40 hover:text-[#f5f5f7]/60"
        }`}
      >
        中文
      </button>
    </div>
  );
}

export function Nav({ projects }: { projects: Project[] }) {
  const { locale, t } = useLocale();
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget;
    const container = containerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const lr = link.getBoundingClientRect();
    setPill({ left: lr.left - cr.left, width: lr.width });
  }, []);

  const handleLeave = useCallback(() => setPill(null), []);

  const navTitle = (p: Project) => {
    return locale === "en" && p.title_en ? p.title_en : p.title;
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 nav-blur border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between">
        <a
          href="#"
          className="text-sm font-medium text-[#f5f5f7]/80 hover:text-[#f5f5f7] transition-colors shrink-0"
        >
          {t("nav.portfolio")}
        </a>

        {/* Desktop nav links */}
        <div className="flex items-center gap-4">
          <div
            ref={containerRef}
            className="hidden sm:flex items-center gap-1 relative"
            onMouseLeave={handleLeave}
          >
            {pill && (
              <div
                className="nav-pill-bg absolute top-1/2 -translate-y-1/2 h-7"
                style={{ left: pill.left, width: pill.width, transition: "left 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            )}
            {projects.map((p) => (
              <a
                key={p.slug}
                href={`#${p.slug}`}
                onMouseEnter={handleEnter}
                className="relative z-10 px-2.5 py-1 text-xs text-[#f5f5f7]/55 hover:text-[#f5f5f7] transition-colors duration-200"
              >
                {navTitle(p)}
              </a>
            ))}
          </div>

          {/* Desktop language toggle */}
          <div className="hidden sm:block">
            <LangToggle />
          </div>

          {/* Hamburger button (mobile) */}
          <Hamburger open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 sm:hidden transition-all duration-400 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0a0a0b]/95 backdrop-blur-2xl"
          onClick={closeMenu}
        />

        {/* Menu content */}
        <div className="relative z-10 flex flex-col h-full pt-20 pb-8 px-6 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {projects.map((p, i) => (
              <a
                key={p.slug}
                href={`#${p.slug}`}
                onClick={closeMenu}
                className="py-3 text-base font-medium text-[#f5f5f7]/60 hover:text-[#f5f5f7] transition-colors border-b border-white/[0.04] flex items-center gap-3"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-[10px] font-medium tracking-[0.15em] text-zinc-500 w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {navTitle(p)}
              </a>
            ))}
          </nav>

          <div className="mt-8 flex items-center gap-4">
            <LangToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
