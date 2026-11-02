"""
AgriSmart – Agricultural AI/ML FastAPI & HTTP Microservice
Serves demand forecasting and price prediction endpoints on port 8000.
"""

import json
import sys
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Ensure local module path is included
sys.path.insert(0, os.path.dirname(__file__))
from ml_engine import ml_engine

HOST = "0.0.0.0"
PORT = 8000

class AgriForecastHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/health" or path == "/api/health":
            self._set_headers(200)
            res = {
                "status": "healthy",
                "service": "AgriSmart AI/ML Python Microservice",
                "engine": "Time-Aware Agricultural Regressor",
                "version": "v2.4",
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/forecast/trending-products":
            self._set_headers(200)
            trending = ml_engine.get_trending_products()
            res = {
                "success": True,
                "trending_products": trending,
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/forecast/model-performance":
            self._set_headers(200)
            res = {
                "success": True,
                "performance": ml_engine.model_metrics,
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        try:
            body = json.loads(post_data) if post_data else {}
        except Exception:
            body = {}

        if path == "/api/forecast/demand":
            crop = body.get("crop") or body.get("product_name") or "Vine Tomatoes"
            season = body.get("season") or "Rabi"
            supply = float(body.get("available_supply") or body.get("supply") or 15000)
            recent_sales = float(body.get("historical_sales") or body.get("recent_sales") or 12000)

            result = ml_engine.predict_demand_internal(
                crop=crop,
                season=season,
                supply=supply,
                recent_sales=recent_sales,
            )

            self._set_headers(200)
            res = {
                "success": True,
                "crop": crop,
                "season": season,
                "prediction": result,
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/forecast/price":
            crop = body.get("crop") or body.get("product") or "Vine Tomatoes"
            location = body.get("location") or "Lasalgaon APMC"
            season = body.get("season") or "Rabi"
            quality = body.get("product_quality") or body.get("quality") or "Grade A"
            supply = float(body.get("supply") or 15000)

            result = ml_engine.predict_price_internal(
                crop=crop,
                location=location,
                season=season,
                quality=quality,
                supply=supply,
            )

            self._set_headers(200)
            res = {
                "success": True,
                "crop": crop,
                "location": location,
                "quality": quality,
                "prediction": result,
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

def run_server():
    for p in [8000, 8001, 8002]:
        try:
            server_address = (HOST, p)
            httpd = HTTPServer(server_address, AgriForecastHandler)
            print(f"🌾 AgriSmart AI/ML Python Microservice running on http://{HOST}:{p}")
            httpd.serve_forever()
            break
        except OSError:
            continue

if __name__ == "__main__":
    run_server()
