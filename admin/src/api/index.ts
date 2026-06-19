const API_BASE = "http://localhost:8000";
const ADMIN_KEY = "portfolio-admin-key-change-me";

export interface Highlight {
  id?: number;
  project_id?: number;
  content: string;
  sort_order: number;
}

export interface Tag {
  id?: number;
  project_id?: number;
  tag: string;
}

export interface Project {
  id?: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  brief: string;
  media_type: string;
  video_path?: string;
  video_left_path?: string;
  video_left_label?: string;
  video_right_path?: string;
  video_right_label?: string;
  poster_path?: string;
  code_path?: string;
  code_label?: string;
  results_path?: string;
  results_label?: string;
  gallery?: string;
  bg_color: string;
  sort_order: number;
  highlights: ({ content: string } | Highlight)[];
  tags: string[] | Tag[];
  created_at?: string;
  updated_at?: string;
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": ADMIN_KEY,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  listProjects: () => request("/api/v1/projects"),

  getProject: (slug: string) => request(`/api/v1/projects/${slug}`),

  createProject: (data: Project) =>
    request("/api/v1/admin/projects", { method: "POST", body: JSON.stringify(data) }),

  updateProject: (slug: string, data: Partial<Project>) =>
    request(`/api/v1/admin/projects/${slug}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteProject: (slug: string) =>
    request(`/api/v1/admin/projects/${slug}`, { method: "DELETE" }),
};
