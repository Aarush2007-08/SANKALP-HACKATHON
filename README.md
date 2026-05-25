# Member 1 Build: AI Core & Commerce Engine

This module delivers the **Member 1** scope for the Artisan Women’s Market platform:

- Auto-storefront generation from image + voice (`Whisper -> Gemini -> IndicTrans`)
- AI fair pricing engine (regression + demand adjustment)
- Regional voice AI (`Tamil, Hindi, Telugu, Kannada, Bengali`)
- Multi-modal product detection pipeline (`YOLOv8 / OpenCV -> LLM`)
- Demand forecasting (seasonal + festival-aware baseline; Prophet-ready hook)

## Why this exists

Women artisans across 15+ rural craft districts often face:

- No direct digital storefront
- Poor market reach and language barriers
- Middlemen-driven unfair pricing
- Low visibility in demand and supply-chain trends

This backend provides a practical AI-first baseline to reduce those barriers.

## Quick start

```bash
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
uvicorn src.member1_ai_core.main:app --reload
```

Open: `http://127.0.0.1:8000/docs`

## API Endpoints

- `POST /storefront/generate`
  - Builds multilingual storefront copy from voice transcript + product context.
- `POST /pricing/predict`
  - Predicts fair price band and recommended price using feature-based regression.
- `POST /voice/roundtrip`
  - Transcribe input audio + synthesize localized output text-to-speech (stub URI).
- `POST /products/detect`
  - Detects product attributes from image path (OpenCV baseline, YOLO hook).
- `POST /demand/forecast`
  - Forecasts demand with seasonal and festival uplift signals.
- `GET /logistics/analytics`
  - Returns analytics related to clustering and estimated delivery savings.
- `GET /logistics/clusters`
  - Groups artisans into logical delivery clusters using KMeans.
- `GET /logistics/route`
  - Returns the shortest delivery path between two points.
- `GET /logistics/map`
  - Generates a map visualization of the logistics network and saves it to an HTML file.
- `POST /ledger/transaction`
  - Adds a new immutable block to the SHECAN Trust Ledger (handles product creation, ratings, and consent logging with fake-rating heuristics).
- `GET /ledger/history/{product_id}`
  - Blockchain explorer to fetch a product's immutable history and validate the hash chain.
- `GET /ledger/passport/{product_id}`
  - Generates a physical QR code image that resolves to the product's trust history.
- `POST /ledger/sync`
  - Offline-first stub to sync the local blockchain state to the remote Supabase.
- `GET /health`
  - Service health status.

## Design notes

- External models are wrapped behind service interfaces.
- If advanced model dependencies are unavailable, safe fallback logic is used.
- Language support is centralized in `language_support.py`.
- Forecasting includes a festival uplift map to model Indian seasonal demand behavior.

## Suggested next integration steps

1. Wire real Whisper ASR + Coqui TTS model paths in `services/voice_ai.py`.
2. Replace `mock_llm_generate` with Gemini API calls in `services/storefront.py`.
3. Attach YOLOv8 inference in `services/product_detection.py`.
4. Feed real sales history to `/demand/forecast`.
5. Add district-level logistics and inventory services in next member modules.
