from ..schemas import PricingRequest, PricingResponse


def _linear_price_estimate(material_cost: float, labor_hours: float, experience_years: int) -> float:
    # Lightweight regression-style baseline that runs without binary ML dependencies.
    return (
        (material_cost * 1.6)
        + (labor_hours * 95.0)
        + (experience_years * 18.0)
        + 120.0
    )


def predict_fair_price(payload: PricingRequest) -> PricingResponse:
    base_price = _linear_price_estimate(
        material_cost=payload.material_cost,
        labor_hours=payload.labor_hours,
        experience_years=payload.artisan_experience_years,
    )

    # Fairness floor to prevent undervaluation by middlemen behavior.
    labor_value = payload.labor_hours * 80.0
    cost_floor = payload.material_cost + labor_value
    recommended = max(base_price, cost_floor) * payload.current_market_demand_index

    # Historical smoothing for local market continuity.
    if payload.historical_prices:
        local_avg = sum(payload.historical_prices) / len(payload.historical_prices)
        recommended = 0.7 * recommended + 0.3 * local_avg

    fair_min = round(recommended * 0.9, 2)
    fair_max = round(recommended * 1.15, 2)
    return PricingResponse(
        recommended_price=round(recommended, 2),
        fair_price_min=fair_min,
        fair_price_max=fair_max,
        explanation=(
            "Price is regression-estimated, demand-adjusted, and protected by a labor+material fairness floor "
            "to reduce underpricing risk for women artisans."
        ),
    )
