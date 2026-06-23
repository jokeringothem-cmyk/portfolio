export type Locale = "zh" | "en";

export const translations: Record<string, Record<Locale, string>> = {
  // Nav
  "nav.portfolio": { zh: "Portfolio", en: "Portfolio" },

  // Hero
  "hero.label": { zh: "Research Portfolio 2025", en: "Research Portfolio 2025" },
  "hero.title1": { zh: "AI & Robotics", en: "AI & Robotics" },
  "hero.title2": { zh: "Research", en: "Research" },
  "hero.subtitle": { zh: "强化学习 · 基础模型 · 自主系统", en: "Reinforcement Learning · Foundation Models · Autonomous Systems" },
  "hero.desc": { zh: "7 个研究项目，覆盖机器人运动控制到多智能体学术助手", en: "7 research projects spanning robot locomotion to multi-agent academic assistants" },
  "hero.scroll": { zh: "Scroll", en: "Scroll" },

  // ProjectSection buttons
  "project.github": { zh: "View on GitHub", en: "View on GitHub" },
  "project.results": { zh: "查看结果", en: "View Results" },
  "project.showAll": { zh: "展示全部 {n} 个创新点", en: "Show all {n} highlights" },
  "project.collapse": { zh: "收起", en: "Collapse" },

  // Bento card fallbacks
  "bento.coreInnovation": { zh: "核心创新", en: "Core Innovation" },
  "bento.highlight": { zh: "创新点 {n}", en: "Highlight {n}" },

  // Footer
  "footer.openSource": { zh: "所有项目开源", en: "All projects open source" },
  "footer.license": { zh: "MIT 许可协议。持续更新中。", en: "MIT licensed. Continuously updated." },
  "footer.copyright": { zh: "© {year} Research Portfolio", en: "© {year} Research Portfolio" },

  // Loading
  "loading": { zh: "加载项目中...", en: "Loading projects..." },

  // Metadata
  "meta.title": { zh: "Research Portfolio — AI × Robotics", en: "Research Portfolio — AI × Robotics" },
  "meta.description": {
    zh: "个人研究作品集：强化学习、机器人运动控制、空中自主系统、多智能体系统与基础模型应用。",
    en: "Personal research portfolio: reinforcement learning, robot locomotion, aerial autonomy, multi-agent systems, and foundation model applications.",
  },
};

export function t(key: string, locale: Locale, vars?: Record<string, string | number>): string {
  const entry = translations[key];
  if (!entry) return key;
  let text = entry[locale] || entry.zh || key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
