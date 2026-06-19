from datetime import datetime
from pydantic import BaseModel


class HighlightBase(BaseModel):
    content: str
    content_en: str | None = None
    sort_order: int = 0


class HighlightResponse(HighlightBase):
    id: int
    project_id: int

    model_config = {"from_attributes": True}


class TagBase(BaseModel):
    tag: str


class TagResponse(TagBase):
    id: int
    project_id: int

    model_config = {"from_attributes": True}


class ProjectBase(BaseModel):
    slug: str
    title: str
    title_en: str | None = None
    subtitle: str
    subtitle_en: str | None = None
    category: str | None = None
    category_en: str | None = None
    brief: str
    brief_en: str | None = None
    media_type: str = "none"
    video_path: str | None = None
    video_left_path: str | None = None
    video_left_label: str | None = None
    video_left_label_en: str | None = None
    video_right_path: str | None = None
    video_right_label: str | None = None
    video_right_label_en: str | None = None
    poster_path: str | None = None
    code_path: str | None = None
    code_label: str | None = None
    code_label_en: str | None = None
    results_path: str | None = None
    results_label: str | None = None
    results_label_en: str | None = None
    gallery: str | None = None
    github_url: str | None = None
    bg_color: str = "bg-white"
    sort_order: int = 0


class ProjectCreate(ProjectBase):
    highlights: list[str] = []
    tags: list[str] = []


class ProjectUpdate(BaseModel):
    title: str | None = None
    title_en: str | None = None
    subtitle: str | None = None
    subtitle_en: str | None = None
    category: str | None = None
    category_en: str | None = None
    brief: str | None = None
    brief_en: str | None = None
    media_type: str | None = None
    video_path: str | None = None
    video_left_path: str | None = None
    video_left_label: str | None = None
    video_left_label_en: str | None = None
    video_right_path: str | None = None
    video_right_label: str | None = None
    video_right_label_en: str | None = None
    poster_path: str | None = None
    code_path: str | None = None
    code_label: str | None = None
    code_label_en: str | None = None
    results_path: str | None = None
    results_label: str | None = None
    results_label_en: str | None = None
    gallery: str | None = None
    github_url: str | None = None
    bg_color: str | None = None
    sort_order: int | None = None
    highlights: list[str] | None = None
    tags: list[str] | None = None


class ProjectResponse(ProjectBase):
    id: int
    highlights: list[HighlightResponse] = []
    tags: list[TagResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
