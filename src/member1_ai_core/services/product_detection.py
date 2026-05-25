from pathlib import Path

from ..language_support import normalize_language_code
from ..schemas import ProductDetectionRequest, ProductDetectionResponse


from ultralytics import YOLO

# Load YOLO globally to avoid reloading on each request
try:
    yolo_model = YOLO('yolov8n.pt')
except Exception:
    yolo_model = None

def yolo_detect_stub(image_path: str) -> list[dict]:
    if yolo_model is None or not Path(image_path).exists():
        return [{"label": "handmade_item (fallback)", "confidence": 0.82, "bbox": [0.1, 0.1, 0.7, 0.8]}]
        
    try:
        results = yolo_model(image_path)
        detections = []
        for result in results:
            for box in result.boxes:
                label = result.names[int(box.cls[0])]
                conf = float(box.conf[0])
                bbox = box.xyxyn[0].tolist() # Normalized coordinates
                detections.append({"label": label, "confidence": round(conf, 2), "bbox": bbox})
        
        if not detections:
             return [{"label": "no_objects_detected", "confidence": 0.0, "bbox": []}]
        return detections
    except Exception as e:
        return [{"label": f"error: {e}", "confidence": 0.0, "bbox": []}]


def opencv_metadata(image_path: str) -> dict:
    p = Path(image_path)
    if not p.exists():
        return {"exists": False}
    return {
        "exists": True,
        "readable": True,
        "size_bytes": p.stat().st_size,
        "suffix": p.suffix.lower(),
    }


def summarize_for_llm(detections: list[dict], image_info: dict, language: str) -> str:
    labels = ", ".join(d["label"] for d in detections)
    if not labels:
        labels = "unknown object"
    return (
        f"Detected: {labels}; image_info={image_info}; "
        f"language={language}. Use this to generate artisan-friendly catalog description."
    )


def detect_product(payload: ProductDetectionRequest) -> ProductDetectionResponse:
    language = normalize_language_code(payload.language)
    detections = yolo_detect_stub(payload.image_path)
    image_info = opencv_metadata(payload.image_path)
    summary = summarize_for_llm(detections, image_info, language)
    return ProductDetectionResponse(detections=detections, product_summary=summary)
