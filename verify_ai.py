import asyncio
from src.member1_ai_core.services.product_detection import yolo_detect_stub
from src.member1_ai_core.services.voice_ai import whisper_transcribe, coqui_tts_synthesize
from src.member1_ai_core.services.storefront_generation import mock_llm_generate

def run_tests():
    print("Testing YOLOv8...")
    print(yolo_detect_stub("dummy.jpg"))
    
    print("Testing Whisper Fallback...")
    print(whisper_transcribe("dummy.wav", "en"))
    
    print("Testing Edge TTS...")
    print(coqui_tts_synthesize("Hello world", "en"))
    
    print("Testing Gemini Fallback...")
    print(mock_llm_generate("Alice", "Udupi", "Test transcript", "Test hint"))

if __name__ == "__main__":
    run_tests()
