from pydantic import BaseModel


class GenerateTaskRequest(BaseModel):
    user_id: str
    latitude: float | None = None
    longitude: float | None = None
    interests: list[str] = []


class GeneratedTask(BaseModel):
    title: str
    description: str
    cultural_explanation: str
    completion_requirement: str
    difficulty: str
    reason_codes: list[str] = []
