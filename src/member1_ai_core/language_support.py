SUPPORTED_LANGUAGES = {
    "ta": "Tamil",
    "hi": "Hindi",
    "te": "Telugu",
    "kn": "Kannada",
    "bn": "Bengali",
    "en": "English",
}


def normalize_language_code(language_code: str) -> str:
    code = (language_code or "").strip().lower()
    if code in SUPPORTED_LANGUAGES:
        return code
    return "en"

