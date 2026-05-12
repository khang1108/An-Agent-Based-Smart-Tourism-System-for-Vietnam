from fastapi import APIRouter

from app.graphs.feed_graph import explain_recommendation_workflow
from app.graphs.task_graph import generate_task_workflow
from app.graphs.verify_graph import verify_capture_workflow
from app.graphs.vlog_graph import generate_vlog_workflow
from app.schemas.capture import VerifyCaptureRequest
from app.schemas.feed import ExplainRecommendationRequest
from app.schemas.task import GenerateTaskRequest
from app.schemas.vlog import GenerateVlogRequest

router = APIRouter()


@router.post("/generate-task")
def generate_task(request: GenerateTaskRequest) -> dict:
    return generate_task_workflow(request.model_dump())


@router.post("/explain-recommendation")
def explain_recommendation(request: ExplainRecommendationRequest) -> dict:
    return explain_recommendation_workflow(request.model_dump())


@router.post("/verify-capture")
def verify_capture(request: VerifyCaptureRequest) -> dict:
    return verify_capture_workflow(request.model_dump())


@router.post("/generate-vlog")
def generate_vlog(request: GenerateVlogRequest) -> dict:
    return generate_vlog_workflow(request.model_dump())
