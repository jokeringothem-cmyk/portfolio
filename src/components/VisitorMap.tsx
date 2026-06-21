"use client";

import { useEffect, useRef, useState } from "react";

interface VisitorStats {
  country: string;
  value: number;
}

const BASE_PATH_STYLE = `<style>path{fill:rgba(255,255,255,0.08);stroke:rgba(255,255,255,0.18);stroke-width:0.5;vector-effect:non-scaling-stroke;transition:fill 0.4s,fill-opacity 0.4s}</style>`;

function colorForCount(count: number, max: number): { fill: string; opacity: number } {
  if (max === 0 || count === 0) return { fill: "rgba(255,255,255,0.08)", opacity: 1 };
  const t = count / max; // 0..1
  // interpolate from pale blue to deep blue
  const r = Math.round(59 - t * 29);   // 59 → 30
  const g = Math.round(130 - t * 60);  // 130 → 70
  const b = Math.round(246 - t * 70);  // 246 → 176
  return { fill: `rgb(${r},${g},${b})`, opacity: 0.2 + t * 0.5 };
}

function applyStats(svg: SVGSVGElement, stats: VisitorStats[]) {
  if (!stats.length) return;

  const max = stats[0].value;

  // reset all paths first
  svg.querySelectorAll("path").forEach((p) => {
    (p as SVGPathElement).style.fill = "";
    (p as SVGPathElement).style.fillOpacity = "";
    (p as SVGPathElement).style.stroke = "";
    (p as SVGPathElement).style.strokeWidth = "";
  });

  for (const { country, value } of stats) {
    const c = colorForCount(value, max);

    const path = svg.querySelector(`path[id="${country}"]`) as SVGPathElement | null;
    if (path) {
      path.style.fill = c.fill;
      path.style.fillOpacity = String(c.opacity);
      path.style.stroke = "rgba(255,255,255,0.3)";
      path.style.strokeWidth = "0.6";
    }

    const group = svg.querySelector(`g[id="${country}"]`);
    if (group) {
      group.querySelectorAll("path").forEach((p) => {
        (p as SVGPathElement).style.fill = c.fill;
        (p as SVGPathElement).style.fillOpacity = String(c.opacity);
        (p as SVGPathElement).style.stroke = "rgba(255,255,255,0.3)";
        (p as SVGPathElement).style.strokeWidth = "0.6";
      });
    }
  }
}

export function VisitorMap() {
  const [stats, setStats] = useState<VisitorStats[] | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgText, setSvgText] = useState<string | null>(null);

  /* track & fetch stats */
  useEffect(() => {
    async function init() {
      try {
        // 1. record this visit
        await fetch("/api/track", { method: "POST" });
        // 2. fetch accumulated stats
        const r = await fetch("/api/visitors");
        const data = await r.json();
        if (Array.isArray(data)) setStats(data);
      } catch {
        // KV might not be set up yet — ok
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  /* fetch SVG map */
  useEffect(() => {
    fetch("/world-map.svg")
      .then((r) => r.text())
      .then((text) => {
        const styled = text.replace(
          "<svg",
          '<svg style="width:100%;height:auto"'
        );
        setSvgText(BASE_PATH_STYLE + styled);
      })
      .catch(() => {});
  }, []);

  /* apply stats to SVG */
  useEffect(() => {
    if (!svgText || !stats || !containerRef.current) return;
    const svg = containerRef.current.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;
    applyStats(svg, stats);
  }, [svgText, stats]);

  const total = stats?.reduce((s, c) => s + c.value, 0) ?? 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[680px] mx-auto">
        {svgText ? (
          <div
            ref={containerRef}
            dangerouslySetInnerHTML={{ __html: svgText }}
          />
        ) : (
          <div className="w-full aspect-[784/458] flex items-center justify-center">
            <span className="text-[10px] text-[#98989d]/30">· · ·</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        {loading ? (
          <span className="text-[10px] text-[#98989d]/50 tracking-wide">· · ·</span>
        ) : (
          <>
            <span className="text-[11px] text-[#98989d]/50 tracking-wide">
              {total > 0
                ? `${total} visit${total > 1 ? "ors" : ""} from ${stats!.length} countr${stats!.length > 1 ? "ies" : "y"}`
                : "visitor map"}
            </span>
            {stats && stats.length > 0 && (
              <span className="text-[10px] text-[#98989d]/30 tracking-wide">
                {stats.slice(0, 5).map((s) => s.country.toUpperCase()).join(" · ")}
                {stats.length > 5 ? " · ..." : ""}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
