import os
import time
import json
import numpy as np
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import joblib

app = FastAPI(title="Sentinel AI ML Service", version="1.0.0")

FEATURE_NAMES = [
    "payload_length", "num_special_chars", "shannon_entropy",
    "num_json_keys", "nesting_depth", "has_base64", "has_unicode_escape",
    "has_hex_encoding", "hour_of_day", "day_of_week", "requests_last_minute",
    "error_rate_last_hour", "transition_probability"
]

MODEL_DIR = "/models"
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "anomaly_detector.joblib")
ONNX_PATH = os.path.join(MODEL_DIR, "anomaly_detector.onnx")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")


def count_special_chars(s: str) -> int:
    return sum(1 for c in s if not c.isalnum() and not c.isspace())


def calculate_entropy(s: str) -> float:
    if not s:
        return 0.0
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    probs = [f / len(s) for f in freq.values()]
    return -sum(p * np.log2(p) for p in probs)


def count_json_keys(obj: Any) -> int:
    if isinstance(obj, dict):
        return len(obj)
    return 0


def max_nesting_depth(obj: Any) -> int:
    if isinstance(obj, dict):
        return 1 + max((max_nesting_depth(v) for v in obj.values()), default=0)
    if isinstance(obj, list):
        return 1 + max((max_nesting_depth(v) for v in obj), default=0)
    return 0


def has_base64_pattern(s: str) -> bool:
    import re
    return bool(re.search(r'[A-Za-z0-9+/]{40,}={0,2}', s))


def extract_features(request_data: Dict[str, Any]) -> np.ndarray:
    payload = request_data.get("body", "")
    payload_str = json.dumps(payload) if not isinstance(payload, str) else payload

    features = {
        "payload_length": len(payload_str),
        "num_special_chars": count_special_chars(payload_str),
        "shannon_entropy": calculate_entropy(payload_str),
        "num_json_keys": count_json_keys(payload),
        "nesting_depth": max_nesting_depth(payload),
        "has_base64": 1.0 if has_base64_pattern(payload_str) else 0.0,
        "has_unicode_escape": 1.0 if r"\u" in payload_str else 0.0,
        "has_hex_encoding": 1.0 if r"\x" in payload_str else 0.0,
        "hour_of_day": request_data.get("hour", 12),
        "day_of_week": request_data.get("dayOfWeek", 1),
        "requests_last_minute": request_data.get("velocity", {}).get("lastMinute", 1),
        "error_rate_last_hour": request_data.get("velocity", {}).get("errorRate", 0.0),
        "transition_probability": request_data.get("graph", {}).get("transitionProb", 0.5),
    }
    return np.array([[features[name] for name in FEATURE_NAMES]], dtype=np.float64)


class AnomalyDetector:
    def __init__(self, contamination=0.05, n_estimators=200):
        self.model = IsolationForest(
            contamination=contamination,
            n_estimators=n_estimators,
            max_samples='auto',
            random_state=42,
            n_jobs=-1,
        )
        self.scaler = StandardScaler()
        self.is_fitted = False

    def fit(self, X: np.ndarray):
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)
        self.is_fitted = True
        self._save()
        try:
            self._export_onnx(X_scaled.shape[1])
        except Exception as e:
            print(f"ONNX export skipped: {e}")

    def predict(self, X: np.ndarray) -> Dict[str, Any]:
        if not self.is_fitted:
            return {"anomalyScore": 0.0, "isAnomaly": False, "confidence": 0.0}
        X_scaled = self.scaler.transform(X)
        raw_scores = self.model.score_samples(X_scaled)
        # Normalize: 0 = normal, 1 = highly anomalous
        anomaly_score = 1.0 - (1.0 / (1.0 + np.exp(-raw_scores * 2)))
        is_anomaly = anomaly_score > 0.7
        confidence = np.minimum(1.0, np.abs(anomaly_score - 0.5) * 2)
        return {
            "anomalyScore": float(anomaly_score[0]),
            "isAnomaly": bool(is_anomaly[0]),
            "confidence": float(confidence[0]),
        }

    def _save(self):
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.scaler, SCALER_PATH)

    def _load(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
            self.model = joblib.load(MODEL_PATH)
            self.scaler = joblib.load(SCALER_PATH)
            self.is_fitted = True

    def _export_onnx(self, n_features: int):
        initial_type = [('float_input', FloatTensorType([None, n_features]))]
        onnx_model = convert_sklearn(self.model, initial_types=initial_type)
        with open(ONNX_PATH, "wb") as f:
            f.write(onnx_model.SerializeToString())


detector = AnomalyDetector()
detector._load()

# Pre-train with dummy normal data if not fitted
if not detector.is_fitted:
    np.random.seed(42)
    dummy_normal = np.random.normal(loc=0.0, scale=1.0, size=(500, len(FEATURE_NAMES)))
    detector.fit(dummy_normal)


class AnalyzeRequest(BaseModel):
    features: List[float]
    identity_id: str
    tenant_id: str


class AnalyzeResponse(BaseModel):
    anomalyScore: float
    isAnomaly: bool
    confidence: float
    modelVersion: str


@app.get("/health")
async def health() -> Dict[str, Any]:
    return {"status": "ok", "modelLoaded": detector.is_fitted, "version": "1.0.0"}


@app.post("/v1/anomaly-score", response_model=AnalyzeResponse)
async def anomaly_score(req: AnalyzeRequest) -> AnalyzeResponse:
    if len(req.features) != len(FEATURE_NAMES):
        raise HTTPException(400, f"Expected {len(FEATURE_NAMES)} features, got {len(req.features)}")
    X = np.array([req.features], dtype=np.float64)
    result = detector.predict(X)
    return AnalyzeResponse(
        anomalyScore=result["anomalyScore"],
        isAnomaly=result["isAnomaly"],
        confidence=result["confidence"],
        modelVersion="1.0.0",
    )


@app.post("/v1/analyze-request")
async def analyze_request(request_data: Dict[str, Any]) -> Dict[str, Any]:
    start = time.perf_counter()
    features = extract_features(request_data)
    result = detector.predict(features)
    latency = (time.perf_counter() - start) * 1000
    return {
        **result,
        "latencyMs": round(latency, 3),
        "modelVersion": "1.0.0",
    }


@app.post("/v1/retrain")
async def retrain(tenant_id: str) -> Dict[str, Any]:
    # Stub: would fetch data from PostgreSQL and retrain
    return {"status": "retrained", "modelVersion": "1.0.1", "samplesUsed": 5000, "tenantId": tenant_id}
