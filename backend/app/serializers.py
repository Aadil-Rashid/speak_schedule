from datetime import datetime
from pydantic import BaseModel, field_serializer


class ReminderRequest(BaseModel):
    user_id: int
    raw_text: str


class ReminderResponse(BaseModel):
    user_id: int
    original_text: str
    scheduled_time: datetime
    
    @field_serializer("scheduled_time")
    def format_scheduled_time(self, value: datetime) -> str:
        return value.strftime("%-d %b, %Y at %-I:%M %p")

    class Config:
        from_attributes = True
