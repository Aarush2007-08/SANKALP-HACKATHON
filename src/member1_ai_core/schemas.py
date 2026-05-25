from typing import Any

from pydantic import BaseModel, Field


class StorefrontRequest(BaseModel):
    product_image_path: str = Field(..., description="Local path or URL to product image")
    voice_audio_path: str = Field(..., description="Local path or URL to artisan voice note")
    artisan_name: str
    craft_district: str
    preferred_language: str = "hi"


class StorefrontResponse(BaseModel):
    transcript_text: str
    detected_product_summary: dict[str, Any]
    storefront_copy: dict[str, str]


class PricingRequest(BaseModel):
    product_category: str
    material_cost: float
    labor_hours: float
    artisan_experience_years: int
    district: str
    current_market_demand_index: float = Field(1.0, ge=0.1, le=5.0)
    historical_prices: list[float] = Field(default_factory=list)


class PricingResponse(BaseModel):
    recommended_price: float
    fair_price_min: float
    fair_price_max: float
    explanation: str


class VoiceRoundTripRequest(BaseModel):
    input_audio_path: str
    input_language: str = "hi"
    output_language: str = "en"
    response_text: str


class VoiceRoundTripResponse(BaseModel):
    transcript_text: str
    translated_text: str
    tts_audio_uri: str


class ProductDetectionRequest(BaseModel):
    image_path: str
    language: str = "en"


class ProductDetectionResponse(BaseModel):
    detections: list[dict[str, Any]]
    product_summary: str


class DemandPoint(BaseModel):
    date: str
    sales: float


class DemandForecastRequest(BaseModel):
    product_category: str
    district: str
    language: str = "en"
    horizon_days: int = Field(30, ge=7, le=180)
    history: list[DemandPoint]


class DemandForecastResponse(BaseModel):
    forecast: list[dict[str, Any]]
    demand_signal: str


class LogisticsAnalyticsResponse(BaseModel):
    total_orders: int
    clusters: int
    estimated_traditional_cost: float
    optimized_cost: float
    estimated_savings: float
    efficiency_improvement_percentage: float


class ArtisanCluster(BaseModel):
    artisan: str
    village: str
    cluster: int


class LogisticsClusteringResponse(BaseModel):
    clusters: list[ArtisanCluster]


class LogisticsRouteResponse(BaseModel):
    source: str
    target: str
    path: list[str]
    total_distance_km: float


class LogisticsMapResponse(BaseModel):
    message: str
    map_file_path: str


class TransactionRequest(BaseModel):
    product_id: str
    action_type: str = Field(..., description="E.g., 'creation', 'consent', 'rating'")
    details: dict[str, Any]
    ip_address: str = "127.0.0.1"


class TransactionResponse(BaseModel):
    message: str
    block_hash: str
    block_index: int


class LedgerBlock(BaseModel):
    index: int
    timestamp: float
    data: dict[str, Any]
    previous_hash: str
    hash: str


class LedgerHistoryResponse(BaseModel):
    product_id: str
    is_valid: bool
    blocks: list[LedgerBlock]


class QRPassportResponse(BaseModel):
    message: str
    qr_file_path: str
    passport_url: str

