import anthropic
import json
import os
from prompts import RESUME_ANALYSIS_PROMPT
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

def analyze_resume(resume_text: str, job_description: str = "") -> dict:
    try:
        prompt = RESUME_ANALYSIS_PROMPT.format(
            resume_text=resume_text,
            job_description=job_description if job_description else "Not provided"
        )

        message = client.messages.create(
          model="claude-opus-4-20250514",
            max_tokens=4000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        response_text = message.content[0].text

        # Clean response
        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        result = json.loads(response_text.strip())
        return result

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return get_fallback_response()
    except Exception as e:
        print(f"Analysis error: {e}")
        return get_fallback_response()


def get_fallback_response() -> dict:
    return {
        "overall_score": 50,
        "ats_score": 50,
        "jd_match_score": None,
        "section_scores": {
            "experience": 50,
            "skills": 50,
            "education": 50,
            "summary": 50
        },
        "weaknesses": [
            {
                "issue": "Could not analyze resume properly",
                "fix": "Please try uploading again"
            }
        ],
        "keyword_gaps": [],
        "existing_keywords": [],
        "rewrite_suggestions": [],
        "interview_questions": [
            "Tell me about yourself",
            "What are your strengths?",
            "Where do you see yourself in 5 years?"
        ],
        "cover_letter": "Please try again to generate cover letter",
        "summary": "Analysis could not be completed. Please try again."
    }