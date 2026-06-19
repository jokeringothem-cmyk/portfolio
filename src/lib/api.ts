import projectsData from "@/data/projects.json";

export interface Highlight {
  id: number;
  project_id: number;
  content: string;
  content_en: string | null;
  sort_order: number;
}

export interface Tag {
  id: number;
  project_id: number;
  tag: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  title_en: string | null;
  subtitle: string;
  subtitle_en: string | null;
  category: string | null;
  category_en: string | null;
  brief: string;
  brief_en: string | null;
  media_type: string;
  video_path: string | null;
  video_left_path: string | null;
  video_left_label: string | null;
  video_left_label_en: string | null;
  video_right_path: string | null;
  video_right_label: string | null;
  video_right_label_en: string | null;
  poster_path: string | null;
  code_path: string | null;
  code_label: string | null;
  code_label_en: string | null;
  results_path: string | null;
  results_label: string | null;
  results_label_en: string | null;
  gallery: string | null;
  github_url: string | null;
  bg_color: string;
  sort_order: number;
  highlights: Highlight[];
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getProject(slug: string): Project | undefined {
  return (projectsData as Project[]).find((p) => p.slug === slug);
}
