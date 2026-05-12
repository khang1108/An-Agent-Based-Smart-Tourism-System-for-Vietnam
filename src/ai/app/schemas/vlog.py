from pydantic import BaseModel


class GenerateVlogRequest(BaseModel):
    user_id: str
    local_date: str
    captures: list[dict] = []


class GeneratedVlog(BaseModel):
    title: str
    summary: str
    body: str
