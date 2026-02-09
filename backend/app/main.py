from typing import List
from sqlalchemy.orm import Session
from fastapi import FastAPI, HTTPException, Depends
from .serializers import ReminderRequest, ReminderResponse
from .services.datetime_parser import DucklingDateTimeParser
from app.database import SessionLocal, Reminder
from .settings import app


parser = DucklingDateTimeParser()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# home_route 
# GET url: http://0.0.0.0:8000
@app.get("/")
def home_route():
    return {
        "status": "ok",
        "message": "Speak/Schedule System is working fine...🚀"
    }


# API to post reminders into DB 
# POST url: http://0.0.0.0:8000/api/reminders/
@app.post("/api/reminders/", response_model=ReminderResponse)
def create_reminder(payload: ReminderRequest):
    parsed_time = parser.parse(text=payload.raw_text)    
    if not parsed_time:
        raise HTTPException(
            status_code=422,
            detail="Could not understand date/time. Please specify clearly."
        )
    db = SessionLocal()

    reminder = Reminder(
        user_id=payload.user_id,
        original_text=payload.raw_text,
        scheduled_time=parsed_time,
    )

    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder


# API to get all list of reminders 
# GET url: http://0.0.0.0:8000/api/all/reminders/
@app.get("/api/all/reminders/", response_model=List[ReminderResponse])
def get_all_reminders(db: Session = Depends(get_db)):
    reminders = db.query(Reminder).all()

    if not reminders:
        raise HTTPException(
            status_code=404,
            detail="No reminders found"
        )

    return reminders


# API to delete all reminders 
# DELETE url: http://0.0.0.0:8000/api/all/reminders/
@app.delete("/api/all/reminders/")
def delete_all_reminders(db: Session = Depends(get_db)):
    reminders = db.query(Reminder)

    if not reminders.first():
        raise HTTPException(
            status_code=404,
            detail="No reminders found to delete"
        )

    deleted_count = reminders.delete(synchronize_session=False)
    db.commit()

    return {
        "message": "All reminders deleted successfully",
        "deleted_count": deleted_count
    }