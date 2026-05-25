import urllib.request
import json
import urllib.error

def make_req(endpoint, data=None):
    url = f"http://127.0.0.1:8000/{endpoint}"
    if data:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    else:
        req = urllib.request.Request(url)
        
    try:
        with urllib.request.urlopen(req) as response:
            print(f"{endpoint}:", response.read().decode()[:200] + "...")
    except urllib.error.HTTPError as e:
        print(f"{endpoint} Error: {e.code} - {e.read().decode()}")
    except Exception as e:
        print(f"{endpoint} Error: {e}")

if __name__ == "__main__":
    make_req("logistics/analytics")
    make_req("logistics/clusters")
    make_req("logistics/route?source=Udupi&target=Ujire")
    make_req("logistics/map")
