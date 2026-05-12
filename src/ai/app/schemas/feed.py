from pydantic import BaseModel


class ExplainRecommendationRequest(BaseModel):
    user_id: str
    place: dict
    interests: list[str] = []
    context: dict = {}


class RecommendationExplanation(BaseModel):
    explanation: str
    reason_codes: list[str] = []
