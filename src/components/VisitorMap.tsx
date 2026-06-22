"use client";

import { useEffect, useRef, useState } from "react";

interface VisitorStats {
  country: string;
  value: number;
}

interface RecentVisitor {
  ip: string;
  country: string;
  city: string;
  region: string;
  isp: string;
  ua: string;
  time: string;
}

const BASE_PATH_STYLE = `<style>path{fill:rgba(255,255,255,0.08);stroke:rgba(255,255,255,0.18);stroke-width:0.5;vector-effect:non-scaling-stroke;transition:fill 0.4s,fill-opacity 0.4s}</style>`;

const COUNTRY_NAMES: Record<string, string> = {
  af: "Afghanistan", al: "Albania", dz: "Algeria", ao: "Angola", ar: "Argentina",
  am: "Armenia", au: "Australia", at: "Austria", az: "Azerbaijan", bd: "Bangladesh",
  by: "Belarus", be: "Belgium", bj: "Benin", bt: "Bhutan", bo: "Bolivia",
  ba: "Bosnia", bw: "Botswana", br: "Brazil", bn: "Brunei", bg: "Bulgaria",
  bf: "Burkina Faso", bi: "Burundi", kh: "Cambodia", cm: "Cameroon", ca: "Canada",
  cf: "CAR", td: "Chad", cl: "Chile", cn: "China", co: "Colombia",
  cg: "Congo", cr: "Costa Rica", hr: "Croatia", cu: "Cuba", cy: "Cyprus",
  cz: "Czechia", cd: "DR Congo", dk: "Denmark", dj: "Djibouti", do: "Dominican Rep.",
  ec: "Ecuador", eg: "Egypt", sv: "El Salvador", gq: "Eq. Guinea", er: "Eritrea",
  ee: "Estonia", et: "Ethiopia", fi: "Finland", fr: "France", ga: "Gabon",
  gm: "Gambia", ge: "Georgia", de: "Germany", gh: "Ghana", gr: "Greece",
  gl: "Greenland", gt: "Guatemala", gn: "Guinea", gw: "Guinea-Bissau", gy: "Guyana",
  ht: "Haiti", hn: "Honduras", hu: "Hungary", is: "Iceland", in: "India",
  id: "Indonesia", ir: "Iran", iq: "Iraq", ie: "Ireland", il: "Israel",
  it: "Italy", ci: "Ivory Coast", jm: "Jamaica", jp: "Japan", jo: "Jordan",
  kz: "Kazakhstan", ke: "Kenya", kw: "Kuwait", kg: "Kyrgyzstan", la: "Laos",
  lv: "Latvia", lb: "Lebanon", ls: "Lesotho", lr: "Liberia", ly: "Libya",
  lt: "Lithuania", lu: "Luxembourg", mg: "Madagascar", mw: "Malawi", my: "Malaysia",
  ml: "Mali", mr: "Mauritania", mx: "Mexico", md: "Moldova", mn: "Mongolia",
  me: "Montenegro", ma: "Morocco", mz: "Mozambique", mm: "Myanmar", na: "Namibia",
  np: "Nepal", nl: "Netherlands", nz: "New Zealand", ni: "Nicaragua", ne: "Niger",
  ng: "Nigeria", kp: "North Korea", mk: "N. Macedonia", no: "Norway", om: "Oman",
  pk: "Pakistan", ps: "Palestine", pa: "Panama", py: "Paraguay", pe: "Peru",
  ph: "Philippines", pl: "Poland", pt: "Portugal", qa: "Qatar", ro: "Romania",
  ru: "Russia", rw: "Rwanda", sa: "Saudi Arabia", sn: "Senegal", rs: "Serbia",
  sl: "Sierra Leone", sg: "Singapore", sk: "Slovakia", si: "Slovenia", so: "Somalia",
  za: "South Africa", kr: "South Korea", ss: "South Sudan", es: "Spain", lk: "Sri Lanka",
  sd: "Sudan", sr: "Suriname", sz: "Eswatini", se: "Sweden", ch: "Switzerland",
  sy: "Syria", tw: "Taiwan", tj: "Tajikistan", tz: "Tanzania", th: "Thailand",
  tg: "Togo", tt: "Trinidad & Tobago", tn: "Tunisia", tr: "Turkey", tm: "Turkmenistan",
  ug: "Uganda", ua: "Ukraine", ae: "UAE", gb: "UK", us: "United States",
  uy: "Uruguay", uz: "Uzbekistan", ve: "Venezuela", vn: "Vietnam", eh: "W. Sahara",
  ye: "Yemen", zm: "Zambia", zw: "Zimbabwe",
};

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
  const [recent, setRecent] = useState<RecentVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgText, setSvgText] = useState<string | null>(null);

  /* track & fetch stats */
  useEffect(() => {
    async function init() {
      try {
        await fetch("/api/track", { method: "POST" });
        const [statsRes, recentRes] = await Promise.all([
          fetch("/api/visitors"),
          fetch("/api/recent"),
        ]);
        const statsData = await statsRes.json();
        const recentData = await recentRes.json();
        if (Array.isArray(statsData)) setStats(statsData);
        if (Array.isArray(recentData)) setRecent(recentData.slice(0, 3));
      } catch {
        // ok
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
                {stats.slice(0, 5).map((s) =>
                  `${COUNTRY_NAMES[s.country] || s.country.toUpperCase()} ${s.value}`
                ).join(" · ")}
                {stats.length > 5 ? " · ..." : ""}
              </span>
            )}
            {recent.length > 0 && (
              <div className="flex flex-col items-center gap-0.5 mt-2">
                {recent.map((v, i) => (
                  <span key={i} className="text-[9px] text-[#98989d]/25 tracking-wide">
                    {v.ip} — {v.city}, {v.country} — {v.isp} — {new Date(v.time).toLocaleString()}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
