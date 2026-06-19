"use client";

import { useLocale } from "@/lib/locale";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative pt-36 pb-24 sm:pt-52 sm:pb-36 bg-[#0a0a0b] text-center overflow-hidden">
      {/* Animated orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-[10%] w-80 h-80 bg-gradient-to-br from-blue-500/8 to-purple-500/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-40 right-[5%] w-96 h-96 bg-gradient-to-bl from-indigo-500/6 to-cyan-500/4 rounded-full blur-3xl animate-float-slower" />
        <div className="absolute bottom-0 left-[20%] w-72 h-72 bg-gradient-to-tr from-violet-500/5 to-blue-500/4 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-[15%] w-48 h-48 bg-gradient-to-tl from-sky-500/6 to-indigo-500/3 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:48px_48px]" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)" }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <p className="reveal text-xs font-medium tracking-[0.2em] uppercase text-[#98989d] mb-6">
          {t("hero.label")}
        </p>

        <h1 className="reveal text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
          <span className="text-[#f5f5f7]">{t("hero.title1")}</span>
          <br />
          <span className="bg-gradient-to-r from-[#2997ff] via-[#7b61ff] to-[#2997ff] bg-clip-text text-transparent">
            {t("hero.title2")}
          </span>
        </h1>

        <p className="reveal text-lg sm:text-xl text-[#98989d] max-w-xl mx-auto leading-relaxed">
          {t("hero.subtitle")}
        </p>
        <p className="reveal mt-2 text-sm text-[#98989d]/60 max-w-lg mx-auto leading-relaxed">
          {t("hero.desc")}
        </p>

        <div className="reveal mt-16 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#98989d]/40">{t("hero.scroll")}</span>
          <div className="w-5 h-8 rounded-full border border-white/[0.08] flex justify-center">
            <div className="w-1 h-1.5 bg-[#98989d]/30 rounded-full mt-1.5 animate-scroll-dot" />
          </div>
        </div>
      </div>
    </section>
  );
}
