from datetime import datetime, timedelta

from ..schemas import DemandForecastRequest, DemandForecastResponse

FESTIVAL_UPLIFT_BY_MONTH = {
    1: 1.05,   # Pongal/Makar Sankranti
    8: 1.08,   # Raksha Bandhan/Onam season prep
    10: 1.15,  # Navratri/Dussehra/Diwali run-up
    11: 1.12,  # Diwali/seasonal gifting
    12: 1.07,  # Year-end gifting
}


def _baseline_forecast(history: list[dict], horizon_days: int) -> list[dict]:
    if not history:
        today = datetime.utcnow().date()
        avg_sales = 10.0
        last_date = datetime(today.year, today.month, today.day)
    else:
        sorted_history = sorted(history, key=lambda x: x["date"])
        window = sorted_history[-14:]
        avg_sales = sum(float(row["sales"]) for row in window) / max(len(window), 1)
        last_date = datetime.strptime(sorted_history[-1]["date"], "%Y-%m-%d")

    result: list[dict] = []
    for i in range(1, horizon_days + 1):
        day = last_date + timedelta(days=i)
        month_uplift = FESTIVAL_UPLIFT_BY_MONTH.get(day.month, 1.0)
        weekday_uplift = 1.05 if day.weekday() in (5, 6) else 1.0
        pred = round(avg_sales * month_uplift * weekday_uplift, 2)
        result.append({"date": day.strftime("%Y-%m-%d"), "predicted_sales": pred})
    return result


def _prophet_forecast(history: list[dict], horizon_days: int) -> list[dict] | None:
    try:
        import pandas as pd
        from prophet import Prophet  # type: ignore
    except Exception:
        return None

    df = pd.DataFrame(history).rename(columns={"date": "ds", "sales": "y"})
    df["ds"] = pd.to_datetime(df["ds"])
    model = Prophet(daily_seasonality=True, weekly_seasonality=True, yearly_seasonality=True)
    model.fit(df)
    future = model.make_future_dataframe(periods=horizon_days)
    forecast = model.predict(future).tail(horizon_days)[["ds", "yhat"]]
    return [
        {"date": d.strftime("%Y-%m-%d"), "predicted_sales": round(float(y), 2)}
        for d, y in zip(forecast["ds"], forecast["yhat"])
    ]


def forecast_demand(payload: DemandForecastRequest) -> DemandForecastResponse:
    history = [{"date": p.date, "sales": p.sales} for p in payload.history]
    forecast = _prophet_forecast(history, payload.horizon_days)
    model_name = "prophet"
    if forecast is None:
        forecast = _baseline_forecast(history, payload.horizon_days)
        model_name = "seasonal_baseline"

    peak = max(forecast, key=lambda x: x["predicted_sales"])
    demand_signal = (
        f"Forecast model={model_name}; likely peak demand around {peak['date']} "
        f"with predicted_sales={peak['predicted_sales']} for {payload.product_category}."
    )
    return DemandForecastResponse(forecast=forecast, demand_signal=demand_signal)
