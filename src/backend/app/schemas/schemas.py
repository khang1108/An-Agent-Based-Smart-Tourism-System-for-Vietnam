"""
Backend Pydantic Schemas.

Defines the API contract between the Backend and its clients (Android, Web).
Schemas are used for request validation and response serialization.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ── Health ────────────────────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str = "ok"
    version: str
    timestamp: datetime


# ── Place ─────────────────────────────────────────────────────────────────────
class PlaceSchema(BaseModel):
    id: str
    name: str
    category: str                        # e.g. "temple", "museum", "park"
    description: str
    latitude: float
    longitude: float
    image_url: Optional[str] = None
    reference_url: Optional[str] = None

class PlacesResponse(BaseModel):
    total: int
    items: List[PlaceSchema]


# ── Feed ──────────────────────────────────────────────────────────────────────
class FeedItem(BaseModel):
    id: str
    place_id: str
    name: str
    category: str
    thumbnail_url: Optional[str] = None
    score: float = Field(ge=0.0, le=1.0, description="Điểm gợi ý (0.0 - 1.0)")
    explanation: str = Field(description="Giải thích tại sao gợi ý địa điểm này")
    created_at: datetime

class FeedResponse(BaseModel):
    items: List[FeedItem]


# ── Storyline — Quest Chain ──────────────────────────────────────────────────

class QuestTask(BaseModel):
    """A single task in a quest chain (Duolingo-style node)."""

    quest_id: str = ""
    task_id: str
    step_index: int = 1
    title: str
    description: str
    cultural_explanation: str = Field(description="Giải thích văn hoá/lịch sử")
    completion_requirement: str = Field(description="Điều kiện hoàn thành task")
    unlock_condition: dict = Field(default_factory=dict)
    next_task_hint: str = ""
    difficulty: str = Field(default="easy", description="easy | medium | hard")
    reason_codes: list[str] = []
    place_id: Optional[str] = None
    status: str = Field(
        default="locked",
        description="locked | active | completed",
    )


class QuestChainResponse(BaseModel):
    """Full quest chain for the Duolingo-style path UI."""

    quest_id: str
    place_name: str
    total_tasks: int
    current_step: int = 1
    tasks: List[QuestTask]


class StorylineTask(BaseModel):
    """Legacy storyline task schema (kept for backward compatibility)."""

    task_id: str
    title: str
    description: str
    cultural_explanation: str = Field(description="Giải thích văn hoá/lịch sử")
    difficulty: str = Field(description="easy | medium | hard")
    completion_requirement: str = Field(description="Điều kiện hoàn thành task")
    place_id: Optional[str] = None
    score: float = Field(ge=0.0, le=1.0)

class StorylineNextTaskResponse(BaseModel):
    task: StorylineTask
    ai_generated: bool
    fallback: bool = False


# ── Captures ──────────────────────────────────────────────────────────────────
class CaptureCreateRequest(BaseModel):
    user_id: str
    task_id: Optional[str] = None
    place_id: str
    timestamp: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    media_url: Optional[str] = Field(None, description="URL hoặc key ảnh/video placeholder")
    note: Optional[str] = None

class CaptureResponse(BaseModel):
    id: str
    user_id: str
    task_id: Optional[str]
    place_id: str
    timestamp: datetime
    latitude: Optional[float]
    longitude: Optional[float]
    media_url: Optional[str]
    note: Optional[str]
    created_at: datetime


# ── Logs ─────────────────────────────────────────────────────────────────────
class LogEntry(BaseModel):
    level: str
    message: str
    timestamp: datetime

class LogsResponse(BaseModel):
    logs: List[LogEntry]
