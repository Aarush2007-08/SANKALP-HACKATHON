import requests
import json
import os

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, method, path, payload=None):
    url = f"{BASE_URL}{path}"
    print(f"Testing {name} ({method} {path})... ", end="")
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            print(f"OK")
            return True
        else:
            print(f"FAILED (Status: {response.status_code})")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def run_all_tests():
    success = True
    
    # Health
    success &= test_endpoint("Health", "GET", "/health")
    
    # Storefront
    storefront_payload = {
        "product_image_path": "dummy.jpg",
        "voice_audio_path": "dummy.wav",
        "artisan_name": "Test Artisan",
        "craft_district": "Test District",
        "preferred_language": "hi"
    }
    success &= test_endpoint("Storefront Gen", "POST", "/storefront/generate", storefront_payload)
    
    # Pricing
    pricing_payload = {
        "product_category": "Textiles",
        "material_cost": 500,
        "labor_hours": 10,
        "artisan_experience_years": 5,
        "district": "Udupi"
    }
    success &= test_endpoint("Pricing", "POST", "/pricing/predict", pricing_payload)
    
    # Voice
    voice_payload = {
        "input_audio_path": "dummy.wav",
        "response_text": "Hello world"
    }
    success &= test_endpoint("Voice AI", "POST", "/voice/roundtrip", voice_payload)
    
    # Products
    product_payload = {
        "image_path": "dummy.jpg"
    }
    success &= test_endpoint("Product Detect", "POST", "/products/detect", product_payload)
    
    # Demand
    demand_payload = {
        "product_category": "Textiles",
        "district": "Udupi",
        "history": [{"date": "2023-10-01", "sales": 15.0}]
    }
    success &= test_endpoint("Demand Forecast", "POST", "/demand/forecast", demand_payload)
    
    # Logistics
    success &= test_endpoint("Logistics Analytics", "GET", "/logistics/analytics")
    success &= test_endpoint("Logistics Clusters", "GET", "/logistics/clusters?n_clusters=2")
    success &= test_endpoint("Logistics Route", "GET", "/logistics/route?source=Udupi&target=Ujire")
    success &= test_endpoint("Logistics Map", "GET", "/logistics/map")
    
    # Ledger
    ledger_payload = {
        "product_id": "test_prod_001",
        "action_type": "creation",
        "details": {"test": "data"}
    }
    success &= test_endpoint("Ledger Transaction", "POST", "/ledger/transaction", ledger_payload)
    success &= test_endpoint("Ledger History", "GET", "/ledger/history/test_prod_001")
    success &= test_endpoint("Ledger Passport", "GET", "/ledger/passport/test_prod_001")
    success &= test_endpoint("Ledger Sync", "POST", "/ledger/sync")
    
    print("\n--- TEST SUMMARY ---")
    if success:
        print("All services are fully operational!")
    else:
        print("Some services failed. Please review the logs above.")

if __name__ == "__main__":
    run_all_tests()
