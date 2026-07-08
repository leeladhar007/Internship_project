from google import genai
from backend.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)
def generate_answer(prompt:str)->str:
    response = client.models.generatecontent(
        model = "gemini-2.0-flash",
        contents = prompt
    )
    return response.text