"use client";

import type { Project } from "@/lib/api";
import { LocaleProvider } from "@/lib/locale";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProjectSection } from "@/components/ProjectSection";
import { Footer } from "@/components/Footer";

export function AppShell({ projects }: { projects: Project[] }) {
  return (
    <LocaleProvider>
      <div className="min-h-screen bg-[#0a0a0b]">
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="absolute top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-900/15 blur-[150px]" />
          <div className="absolute bottom-[10%] -right-[15%] w-[50%] h-[50%] rounded-full bg-purple-900/15 blur-[150px]" />
        </div>
        <div className="relative z-10">
          <Nav projects={projects} />
          <Hero />
          {projects.map((p, i) => (
            <ProjectSection key={p.slug} p={p} index={i} />
          ))}
          <Footer />
        </div>
      </div>
    </LocaleProvider>
  );
}
