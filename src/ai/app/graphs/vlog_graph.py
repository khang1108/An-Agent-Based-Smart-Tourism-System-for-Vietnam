from app.agents.memory_curator import MemoryCurator
from app.agents.publisher import PublisherAgent
from app.agents.story_weaver import StoryWeaver


def generate_vlog_workflow(context: dict) -> dict:
    captures = MemoryCurator().select_captures(context.get("captures", []))
    vlog = StoryWeaver().write({**context, "captures": captures})
    return PublisherAgent().publish_response(vlog)
