import urllib.request
import json

def make_req(endpoint, data):
    url = f"http://127.0.0.1:8000/{endpoint}"
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            print(f"{endpoint}:", response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"{endpoint} Error: {e.code} - {e.read().decode()}")
    except Exception as e:
        print(f"{endpoint} Error: {e}")

if __name__ == "__main__":
    make_req("storefront/generate", {
        "product_image_path": "abc.jpg",
        "voice_audio_path": "audio.wav",
        "artisan_name": "test",
        "craft_district": "test",
        "preferred_language": "hi"
    })
    make_req("pricing/predict", {
        "product_category": "test",
        "material_cost": 10.0,
        "labor_hours": 5.0,
        "artisan_experience_years": 2,
        "district": "test",
        "current_market_demand_index": 1.0,
        "historical_prices": [100.0]
    })
    make_req("voice/roundtrip", {
        "input_audio_path": "test.wav",
        "input_language": "hi",
        "output_language": "en",
        "response_text": "test"
    })
    make_req("products/detect", {
        "image_path": "test.jpg",
        "language": "en"
    })
    make_req("demand/forecast", {
        "product_category": "test",
        "district": "test",
        "language": "en",
        "horizon_days": 30,
        "history": [{"date": "2023-01-01", "sales": 10.0}]
    })
