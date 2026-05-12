from pydantic import BaseModel


class VerifyCaptureRequest(BaseModel):
    user_id: str
    task: dict
    capture: dict


class CaptureVerification(BaseModel):
    status: str
    reason: str
    confidence: float
