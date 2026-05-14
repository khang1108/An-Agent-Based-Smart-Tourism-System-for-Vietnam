"""
BeVietnam AI Core — FastAPI Application.

This is the AI service entry point. It provides:
  - /health          — service health check
  - /generate-task   — cultural task generation (Quest Maker pipeline)
  - /quest-chain     — full quest chain for UI rendering
  - /explain-recommendation, /verify-capture, /generate-vlog — stubs

The AI Core is a separate service from the Backend.
Backend owns product data; AI Core owns retrieval, reasoning, and generation.
"""

import logging

from fastapi import FastAPI

from ai.api.routes import router

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(name)-30s │ %(levelname)-5s │ %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="BeVietnam AI Core",
    version="0.2.0",
    description="AI agent service for cultural task generation and knowledge retrieval.",
)

app.include_router(router)


@app.get("/health")
def health() -> dict[str, str]:
    """Health check endpoint — used by backend and monitoring."""
    return {"status": "ok", "service": "ai-core", "version": "0.2.0"}


@app.on_event("startup")
async def startup_event() -> None:
    """Log startup info. Heavy model loading is lazy (on first request)."""
    logger.info("🚀 BeVietnam AI Core v0.2.0 started")
    logger.info("   Embedding model will load on first Culture Scout query")
    logger.info("   Gemini client will initialize on first Quest Maker call")
