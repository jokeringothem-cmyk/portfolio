"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/api";
import { MediaCarousel, type MediaItem } from "./MediaCarousel";
import { useLocale } from "@/lib/locale";

function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    const children = el.querySelectorAll(".reveal");
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

function collectMedia(p: Project, leftLabel?: string, rightLabel?: string): MediaItem[] {
  const items: MediaItem[] = [];
  if (p.media_type === "dual-video") {
    if (p.video_left_path) items.push({ type: "video", path: p.video_left_path, label: leftLabel });
    if (p.video_right_path) items.push({ type: "video", path: p.video_right_path, label: rightLabel });
  } else if (p.media_type === "video" && p.video_path) {
    items.push({ type: "video", path: p.video_path });
  } else if (p.media_type === "image" && p.poster_path) {
    items.push({ type: "image", path: p.poster_path });
  }
  if (p.gallery) {
    try { items.push(...(JSON.parse(p.gallery) as MediaItem[])); } catch {}
  }
  return items;
}

export function ProjectSection({ p, index }: { p: Project; index: number }) {
  const ref = useScrollReveal();
  const [expanded, setExpanded] = useState(false);
  const { locale, t } = useLocale();
  const num = String(index + 1).padStart(2, "0");
  const isEven = index % 2 === 0;
  const highlights = p.highlights || [];
  const INITIAL_SHOW = 3;
  const visibleHighlights = expanded ? highlights : highlights.slice(0, INITIAL_SHOW);
  const showExpand = highlights.length > INITIAL_SHOW;

  // Locale-aware field selectors — fallback to Chinese if English is null
  const title = locale === "en" && p.title_en ? p.title_en : p.title;
  const subtitle = locale === "en" && p.subtitle_en ? p.subtitle_en : p.subtitle;
  const category = locale === "en" && p.category_en ? p.category_en : (p.category || "");
  const brief = locale === "en" && p.brief_en ? p.brief_en : p.brief;
  const codeLabel = locale === "en" && p.code_label_en ? p.code_label_en : (p.code_label || t("project.download"));
  const resultsLabel = locale === "en" && p.results_label_en ? p.results_label_en : (p.results_label || t("project.results"));
  const videoLeftLabel = locale === "en" && p.video_left_label_en ? p.video_left_label_en : (p.video_left_label || undefined);
  const videoRightLabel = locale === "en" && p.video_right_label_en ? p.video_right_label_en : (p.video_right_label || undefined);
  const mediaItems = collectMedia(p, videoLeftLabel, videoRightLabel);

  const hlContent = (h: { content: string; content_en: string | null }) =>
    locale === "en" && h.content_en ? h.content_en : h.content;

  return (
    <section
      id={p.slug}
      className={`relative py-24 sm:py-32 overflow-hidden scroll-mt-14 ${isEven ? "bg-[#0a0a0b]" : "bg-[#0d0d0f]"}`}
      ref={ref}
    >
      {/* Section top border glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6" data-reveal-stagger>
        {/* Number + Category */}
        <div className="reveal flex items-center gap-4 mb-4">
          <span className="section-number text-[11px] font-medium tracking-[0.15em] uppercase text-zinc-300/50">
            {num}
          </span>
          <span className="text-xs font-medium tracking-[0.12em] uppercase text-zinc-300">
            {category}
          </span>
        </div>

        {/* Title */}
        <h2 className="reveal text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f5f5f7] leading-[1.1]">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="reveal mt-3 text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
          {subtitle}
        </p>

        {/* Brief */}
        <p className="reveal mt-5 text-sm sm:text-base text-zinc-300/75 max-w-2xl leading-relaxed">
          {brief}
        </p>

        {/* CTA Buttons — glass style */}
        <div className="reveal mt-5 flex flex-wrap items-center gap-3">
          {p.github_url && (
            <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="glass-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              {t("project.github")}
            </a>
          )}
          {p.code_path && (
            <a href={p.code_path} download className="glass-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {codeLabel}
            </a>
          )}
          {p.results_path && (
            <a href={p.results_path} download className="glass-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              {resultsLabel}
            </a>
          )}
        </div>

        {/* Media carousel */}
        {mediaItems.length > 0 && (
          <div className="reveal mt-14">
            <MediaCarousel items={mediaItems} />
          </div>
        )}

        {/* Bento grid — all visible highlights as cards */}
        {visibleHighlights.length > 0 && (
          <div className="reveal mt-14">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {visibleHighlights.map((h, i) => {
                const isFeatured = i === 0;
                const colSpan = isFeatured ? "sm:col-span-2" : "sm:col-span-1";
                const content = hlContent(h);
                return (
                  <div
                    key={h.id}
                    className={`${colSpan} bento-card ${isFeatured ? "bento-featured" : ""} rounded-xl p-5`}
                  >
                    <p className="text-xs font-semibold tracking-[0.06em] uppercase bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      {extractBentoLabel(content, i, t)}
                    </p>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {extractBentoBody(content)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Expand toggle */}
        {showExpand && (
          <div className="reveal mt-5">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium text-[#2997ff] hover:text-[#4da8ff] transition-colors"
            >
              {expanded ? t("project.collapse") : t("project.showAll", { n: highlights.length })} →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** Extract a short label from highlight content for the bento card title */
function extractBentoLabel(
  content: string,
  index: number,
  t: (key: string, vars?: Record<string, string | number>) => string
): string {
  const sep = content.match(/[：:]|(?:\s—\s)|(?:\s–\s)/);
  if (sep && sep.index && sep.index < 30) {
    return content.slice(0, sep.index).trim();
  }
  const trimmed = content.replace(/[：:].*$/, "").trim();
  if (trimmed.length <= 30) return trimmed;
  return index === 0 ? t("bento.coreInnovation") : t("bento.highlight", { n: index + 1 });
}

/** Get the body portion after the label separator */
function extractBentoBody(content: string): string {
  const m = content.match(/[：:]\s*(.+)/);
  if (m) {
    const body = m[1].trim();
    // Limit body length
    return body.length > 120 ? body.slice(0, 120) + "…" : body;
  }
  // No separator — first sentence as body
  const dot = content.indexOf("。");
  const cn = content.indexOf("；");
  const end = Math.min(dot > 0 ? dot : Infinity, cn > 0 ? cn : Infinity);
  if (end < Infinity) return content.slice(0, end).trim();
  return content.length > 100 ? content.slice(0, 100) + "…" : content;
}
