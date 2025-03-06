import pdfplumber
import uvicorn
from docx import Document
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_ai import Agent

app = FastAPI()

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the response model using Pydantic
class CoverLetterResponse(BaseModel):
    recruiter_message: str = Field(description="Personalized message for the recruiter")
    cover_letter: str = Field(description="Generated cover letter")

# Initialize the PydanticAI Agent
agent = Agent(
    model="openai:gpt-4",
    system_prompt=(
        "You are an AI assistant specializing in crafting personalized recruiter messages and cover letters. "
        "Generate both based on the provided resume and job description."
    ),
    result_type=CoverLetterResponse,
)

# Function to extract text from different resume file formats
async def extract_text_from_resume(resume: UploadFile) -> str:
    file_extension = resume.filename.split(".")[-1].lower()

    try:
        if file_extension == "pdf":
            with pdfplumber.open(resume.file) as pdf:
                return "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])

        elif file_extension in ["doc", "docx"]:
            doc = Document(resume.file)
            return "\n".join([para.text for para in doc.paragraphs])

        elif file_extension == "txt":
            return (await resume.read()).decode("utf-8")

        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF, DOCX, or TXT file.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the resume file: {str(e)}")

@app.post("/generate", response_model=CoverLetterResponse)
async def generate_cover_letter(resume: UploadFile = File(...), job_description: str = Form(...)):
    resume_content = await extract_text_from_resume(resume)

    user_input = (
        f"Resume:\n{resume_content}\n\n"
        f"Job Description:\n{job_description}\n\n"
        "Please generate a personalized recruiter message and a cover letter."
    )

    result = await agent.run(user_input)
    

    return result.data

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
