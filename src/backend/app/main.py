from fastapi import FastAPI

app = FastAPI(title="BeVietnam Backend API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "backend"}
