from ..language_support import normalize_language_code
from ..schemas import ProductDetectionRequest, StorefrontRequest, StorefrontResponse
from .product_detection import detect_product
from .voice_ai import indic_translate, whisper_transcribe


import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
if os.getenv("GEMINI_API_KEY"):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def mock_llm_generate(artisan_name: str, district: str, transcript: str, product_hint: str) -> str:
    prompt = (
        f"You are a marketing copywriter. Create a short, engaging storefront description for a handcrafted product.\n"
        f"Artisan Name: {artisan_name}\n"
        f"District: {district}\n"
        f"Story/Transcript: {transcript}\n"
        f"Product Details: {product_hint}\n\n"
        "Please include the artisan's background, highlight the eco-friendly craft value, the women-led livelihood impact, and end with a clear direct-order call to action."
    )
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        # Fallback to stub if API key is missing or fails
        return (
            f"{artisan_name} from {district} presents a handcrafted product. "
            f"Story: {transcript}. Product insight: {product_hint}. "
            f"Includes eco-friendly craft value, women-led livelihood impact, and direct-order CTA. (Fallback: {e})"
        )


def generate_storefront(payload: StorefrontRequest) -> StorefrontResponse:
    language = normalize_language_code(payload.preferred_language)
    transcript = whisper_transcribe(payload.voice_audio_path, language)
    detection = detect_product(
        ProductDetectionRequest(image_path=payload.product_image_path, language=language)
    )
    llm_copy_en = mock_llm_generate(
        artisan_name=payload.artisan_name,
        district=payload.craft_district,
        transcript=transcript,
        product_hint=detection.product_summary,
    )
    localized = indic_translate(llm_copy_en, "en", language)
    storefront_copy = {
        "en": llm_copy_en,
        language: localized,
    }
    return StorefrontResponse(
        transcript_text=transcript,
        detected_product_summary={
            "summary": detection.product_summary,
            "detections": detection.detections,
        },
        storefront_copy=storefront_copy,
    )

