from ..language_support import normalize_language_code
from ..schemas import VoiceRoundTripRequest, VoiceRoundTripResponse


import os
import asyncio
import whisper
import edge_tts
from ..schemas import VoiceRoundTripRequest, VoiceRoundTripResponse

# Load Whisper model globally to avoid loading it on every request
try:
    whisper_model = whisper.load_model("tiny") # use tiny for faster execution
except Exception:
    whisper_model = None

def whisper_transcribe(audio_path: str, language_code: str) -> str:
    if whisper_model is None or not os.path.exists(audio_path):
        return f"[transcript:{language_code}] {audio_path} (Fallback: Whisper not loaded or file missing)"
    
    try:
        result = whisper_model.transcribe(audio_path, language=language_code)
        return result["text"].strip()
    except Exception as e:
        return f"[transcript:{language_code}] Error: {e}"

def indic_translate(text: str, source_lang: str, target_lang: str) -> str:
    # Hook for IndicTrans models/API. (Keeping as stub as per prompt focus on Whisper/TTS/Gemini/YOLO)
    if source_lang == target_lang:
        return text
    return f"[{source_lang}->{target_lang}] {text}"

def coqui_tts_synthesize(text: str, language_code: str) -> str:
    safe = "".join([c if c.isalnum() else "_" for c in text[:15]])
    out_path = f"tts_output_{language_code}_{safe}.wav"
    
    # edge-tts uses async, we run it synchronously here
    voice = "en-US-AriaNeural" # Default edge-tts voice
    if language_code == "hi":
        voice = "hi-IN-SwaraNeural"
    elif language_code == "ta":
        voice = "ta-IN-PallaviNeural"
        
    try:
        communicate = edge_tts.Communicate(text, voice)
        asyncio.run(communicate.save(out_path))
        return f"file://{os.path.abspath(out_path)}"
    except Exception as e:
        return f"tts://{language_code}/{safe}.wav (Fallback error: {e})"


def run_voice_roundtrip(payload: VoiceRoundTripRequest) -> VoiceRoundTripResponse:
    in_lang = normalize_language_code(payload.input_language)
    out_lang = normalize_language_code(payload.output_language)
    transcript = whisper_transcribe(payload.input_audio_path, in_lang)
    translated = indic_translate(payload.response_text, in_lang, out_lang)
    tts_uri = coqui_tts_synthesize(translated, out_lang)
    return VoiceRoundTripResponse(
        transcript_text=transcript,
        translated_text=translated,
        tts_audio_uri=tts_uri,
    )

