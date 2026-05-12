from app.agents.publisher import PublisherAgent
from app.agents.trip_advisor import TripAdvisorAgent


def explain_recommendation_workflow(context: dict) -> dict:
    explanation = TripAdvisorAgent().explain(context)
    return PublisherAgent().publish_response(explanation)
