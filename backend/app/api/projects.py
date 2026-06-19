from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.database import get_db
from app.models.project import Project, Highlight, Tag
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/api/v1")


def verify_admin(x_api_key: str = Header(None)):
    if x_api_key != settings.admin_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# ── Public endpoints ──

@router.get("/projects", response_model=list[ProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.highlights), selectinload(Project.tags))
        .order_by(Project.sort_order)
    )
    return result.scalars().all()


@router.get("/projects/{slug}", response_model=ProjectResponse)
async def get_project(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.highlights), selectinload(Project.tags))
        .where(Project.slug == slug)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ── Admin endpoints ──

@router.post("/admin/projects", response_model=ProjectResponse, status_code=201)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin),
):
    project = Project(
        slug=data.slug,
        title=data.title,
        title_en=data.title_en,
        subtitle=data.subtitle,
        subtitle_en=data.subtitle_en,
        category=data.category,
        category_en=data.category_en,
        brief=data.brief,
        brief_en=data.brief_en,
        media_type=data.media_type,
        video_path=data.video_path,
        video_left_path=data.video_left_path,
        video_left_label=data.video_left_label,
        video_left_label_en=data.video_left_label_en,
        video_right_path=data.video_right_path,
        video_right_label=data.video_right_label,
        video_right_label_en=data.video_right_label_en,
        poster_path=data.poster_path,
        code_path=data.code_path,
        code_label=data.code_label,
        code_label_en=data.code_label_en,
        results_path=data.results_path,
        results_label=data.results_label,
        results_label_en=data.results_label_en,
        gallery=data.gallery,
        github_url=data.github_url,
        bg_color=data.bg_color,
        sort_order=data.sort_order,
    )
    for content in data.highlights:
        project.highlights.append(Highlight(content=content))
    for tag_name in data.tags:
        project.tags.append(Tag(tag=tag_name))

    db.add(project)
    await db.commit()
    await db.refresh(project)

    result = await db.execute(
        select(Project)
        .options(selectinload(Project.highlights), selectinload(Project.tags))
        .where(Project.id == project.id)
    )
    return result.scalar_one()


@router.put("/admin/projects/{slug}", response_model=ProjectResponse)
async def update_project(
    slug: str,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin),
):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.highlights), selectinload(Project.tags))
        .where(Project.slug == slug)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Update scalar fields
    update_data = data.model_dump(exclude={"highlights", "tags"}, exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    # Replace highlights if provided
    if data.highlights is not None:
        project.highlights.clear()
        for i, content in enumerate(data.highlights):
            project.highlights.append(Highlight(content=content, sort_order=i))

    # Replace tags if provided
    if data.tags is not None:
        project.tags.clear()
        for tag_name in data.tags:
            project.tags.append(Tag(tag=tag_name))

    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/admin/projects/{slug}", status_code=204)
async def delete_project(
    slug: str,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin),
):
    result = await db.execute(select(Project).where(Project.slug == slug))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()
