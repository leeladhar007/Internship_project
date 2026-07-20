from google import genai
from config import GEMINI_API_KEY
from google.genai.errors import ServerError

client = genai.Client(api_key=GEMINI_API_KEY)
def generate_answer(prompt:str)->str:
    try:
        response = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = prompt
        )
        return(response.text)
    except ServerError:
        return (
            "I'm temporarily unable to contact the AI service "
            "because it is experiencing high demand. Please try again in a moment."
        )