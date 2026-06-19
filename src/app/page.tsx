import { getProjects } from "@/lib/api";
import { AppShell } from "./app-shell";

export default function Home() {
  const projects = getProjects();

  return <AppShell projects={projects} />;
}
