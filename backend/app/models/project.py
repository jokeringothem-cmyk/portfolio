from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(64), unique=True, nullable=False, index=True)
    title = Column(String(128), nullable=False)
    title_en = Column(String(128), nullable=True)
    subtitle = Column(Text, nullable=False)
    subtitle_en = Column(Text, nullable=True)
    category = Column(String(64), nullable=True)
    category_en = Column(String(64), nullable=True)
    brief = Column(Text, nullable=False)
    brief_en = Column(Text, nullable=True)
    media_type = Column(String(16), default="none")
    video_path = Column(String(256), nullable=True)
    video_left_path = Column(String(256), nullable=True)
    video_left_label = Column(String(128), nullable=True)
    video_left_label_en = Column(String(128), nullable=True)
    video_right_path = Column(String(256), nullable=True)
    video_right_label = Column(String(128), nullable=True)
    video_right_label_en = Column(String(128), nullable=True)
    poster_path = Column(String(256), nullable=True)
    code_path = Column(String(256), nullable=True)
    code_label = Column(String(128), nullable=True)
    code_label_en = Column(String(128), nullable=True)
    results_path = Column(String(256), nullable=True)
    results_label = Column(String(128), nullable=True)
    results_label_en = Column(String(128), nullable=True)
    gallery = Column(Text, nullable=True)
    github_url = Column(String(256), nullable=True)
    bg_color = Column(String(32), default="bg-white")
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    highlights = relationship("Highlight", back_populates="project", cascade="all, delete-orphan", order_by="Highlight.sort_order")
    tags = relationship("Tag", back_populates="project", cascade="all, delete-orphan")


class Highlight(Base):
    __tablename__ = "highlights"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    content_en = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)

    project = relationship("Project", back_populates="highlights")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    tag = Column(String(64), nullable=False)

    project = relationship("Project", back_populates="tags")
