"use client";

import { useLocale } from "@/lib/locale";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="relative bg-[#0a0a0b] py-12 sm:py-16 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-sm text-[#f5f5f7] font-medium">{t("footer.openSource")}</p>
          <p className="text-xs text-[#98989d] max-w-sm leading-relaxed">
            {t("footer.license")}
          </p>
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#98989d]/40 mt-4">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
