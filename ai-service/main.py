from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze_resume
import uvicorn

app = FastAPI(title="ResumeAI - AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str = ""

@app.get("/")
def root():
    return {"message": "✅ ResumeAI AI Service is running!"}

@app.post("/analyze")
async def analyze(request: ResumeRequest):
    if not request.resume_text or len(request.resume_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Resume text too short")
    
    try:
        result = analyze_resume(
            resume_text=request.resume_text,
            job_description=request.job_description
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cover-letter")
async def cover_letter(request: ResumeRequest):
    try:
        result = analyze_resume(
            resume_text=request.resume_text,
            job_description=request.job_description
        )
        return {"cover_letter": result.get("cover_letter", "")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interview-questions")
async def interview_questions(request: ResumeRequest):
    try:
        result = analyze_resume(
            resume_text=request.resume_text,
            job_description=request.job_description
        )
        return {"questions": result.get("interview_questions", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)