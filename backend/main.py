from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine, Base
import models, schemas

app = FastAPI()

# ✅ Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (for testing, restrict in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
Base.metadata.create_all(bind=engine)

# ✅ Dependency for DB session (Handles Exceptions)
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()  # Rollback in case of error
        raise HTTPException(status_code=500, detail="Database connection failed")
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Cloud Notes API"}

# ✅ Create a new note (Handles Exceptions)
@app.post("/notes/", response_model=schemas.Note)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    try:
        db_note = models.Note(**note.dict())
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        return db_note
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add note")

# ✅ Get all notes (Handles Exceptions)
@app.get("/notes/", response_model=list[schemas.Note])
def read_notes(db: Session = Depends(get_db)):
    try:
        return db.query(models.Note).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch notes")

# ✅ Delete a note (New Feature)
@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}
