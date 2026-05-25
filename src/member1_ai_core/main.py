from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    DemandForecastRequest,
    DemandForecastResponse,
    PricingRequest,
    PricingResponse,
    ProductDetectionRequest,
    ProductDetectionResponse,
    StorefrontRequest,
    StorefrontResponse,
    VoiceRoundTripRequest,
    VoiceRoundTripResponse,
    LogisticsAnalyticsResponse,
    LogisticsClusteringResponse,
    LogisticsRouteResponse,
    LogisticsMapResponse,
    TransactionRequest,
    TransactionResponse,
    LedgerHistoryResponse,
    QRPassportResponse,
)
from .services.demand_forecast import forecast_demand
from .services.pricing_engine import predict_fair_price
from .services.product_detection import detect_product
from .services.storefront_generation import generate_storefront
from .services.voice_ai import run_voice_roundtrip
from .services.logistics_engine import (
    get_analytics,
    get_clusters,
    get_route,
    generate_map,
)
from .services.trust_ledger import (
    add_transaction,
    get_product_history,
    generate_qr_passport,
    sync_to_supabase,
)

app = FastAPI(
    title="Artisan Women Market - Member 1 AI Core",
    version="0.1.0",
    description="AI core and commerce engine for underserved women artisan communities.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/storefront/generate", response_model=StorefrontResponse)
def storefront_generate(payload: StorefrontRequest) -> StorefrontResponse:
    return generate_storefront(payload)


@app.post("/pricing/predict", response_model=PricingResponse)
def pricing_predict(payload: PricingRequest) -> PricingResponse:
    return predict_fair_price(payload)


@app.post("/voice/roundtrip", response_model=VoiceRoundTripResponse)
def voice_roundtrip(payload: VoiceRoundTripRequest) -> VoiceRoundTripResponse:
    return run_voice_roundtrip(payload)


@app.post("/products/detect", response_model=ProductDetectionResponse)
def products_detect(payload: ProductDetectionRequest) -> ProductDetectionResponse:
    return detect_product(payload)


@app.post("/demand/forecast", response_model=DemandForecastResponse)
def demand_forecast(payload: DemandForecastRequest) -> DemandForecastResponse:
    return forecast_demand(payload)


@app.get("/logistics/analytics", response_model=LogisticsAnalyticsResponse)
def logistics_analytics() -> LogisticsAnalyticsResponse:
    return get_analytics()


@app.get("/logistics/clusters", response_model=LogisticsClusteringResponse)
def logistics_clusters(n_clusters: int = 8) -> LogisticsClusteringResponse:
    return get_clusters(n_clusters)


@app.get("/logistics/route", response_model=LogisticsRouteResponse)
def logistics_route(source: str = "Udupi", target: str = "Ujire") -> LogisticsRouteResponse:
    return get_route(source, target)


@app.get("/logistics/map", response_model=LogisticsMapResponse)
def logistics_map() -> LogisticsMapResponse:
    return generate_map()


@app.post("/ledger/transaction", response_model=TransactionResponse)
def ledger_transaction(payload: TransactionRequest) -> TransactionResponse:
    return add_transaction(payload)


@app.get("/ledger/history/{product_id}", response_model=LedgerHistoryResponse)
def ledger_history(product_id: str) -> LedgerHistoryResponse:
    return get_product_history(product_id)


@app.get("/ledger/passport/{product_id}", response_model=QRPassportResponse)
def ledger_passport(product_id: str) -> QRPassportResponse:
    return generate_qr_passport(product_id)


@app.post("/ledger/sync")
def ledger_sync() -> dict[str, str]:
    return sync_to_supabase()

