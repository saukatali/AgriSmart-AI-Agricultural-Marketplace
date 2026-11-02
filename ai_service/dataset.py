"""
AgriSmart – Agricultural Market Dataset Generator
Synthetic agricultural data generator for research, model training, and evaluation.
NOTE: This dataset contains synthetic records modeled on realistic APMC mandi patterns.
"""

import csv
import os
import random
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)
CSV_FILE = os.path.join(DATA_DIR, "agricultural_dataset.csv")

CROPS = [
    {
        "name": "Vine Tomatoes",
        "category": "Vegetables",
        "locations": ["Lasalgaon APMC", "Pimpalgaon APMC", "Pune Market", "Surat Mandi"],
        "base_price": 28.0,
        "base_supply": 12000,
        "season_peaks": ["Kharif", "Rabi"],
    },
    {
        "name": "Nashik Red Onions",
        "category": "Vegetables",
        "locations": ["Lasalgaon APMC", "Nashik APMC", "Vashi Wholesale"],
        "base_price": 24.0,
        "base_supply": 45000,
        "season_peaks": ["Late Kharif", "Rabi"],
    },
    {
        "name": "Sharbati Wheat",
        "category": "Grains",
        "locations": ["Sehore Mandi", "Indore Mandi", "Bhopal Mandi"],
        "base_price": 38.0,
        "base_supply": 28000,
        "season_peaks": ["Rabi"],
    },
    {
        "name": "Alphonso Mangoes",
        "category": "Fruits",
        "locations": ["Ratnagiri APMC", "Devgad Mandi", "Vashi Wholesale"],
        "base_price": 160.0,
        "base_supply": 5000,
        "season_peaks": ["Summer"],
    },
    {
        "name": "Green Cardamom",
        "category": "Spices",
        "locations": ["Bodinayakanur APMC", "Vandanmedu Market"],
        "base_price": 1650.0,
        "base_supply": 800,
        "season_peaks": ["Winter"],
    },
    {
        "name": "Basmati Paddy",
        "category": "Grains",
        "locations": ["Karnal Mandi", "Amritsar Grain Market"],
        "base_price": 42.0,
        "base_supply": 35000,
        "season_peaks": ["Kharif"],
    },
    {
        "name": "Organic Desi Ghee",
        "category": "Organic Products",
        "locations": ["Nashik Agro Direct", "Pune Farmers Market"],
        "base_price": 1150.0,
        "base_supply": 600,
        "season_peaks": ["All Seasons"],
    },
]

SEASONS = ["Kharif", "Rabi", "Zaid", "Winter", "Summer"]
QUALITIES = ["Grade A (Export)", "Grade A", "Grade B", "Organic Certified"]

def generate_dataset(num_records=1800):
    start_date = datetime(2025, 1, 1)
    fieldnames = [
        "product_name",
        "product_category",
        "market_location",
        "date",
        "historical_selling_price",
        "quantity_supplied_kg",
        "quantity_sold_kg",
        "demand_score",
        "season",
        "month",
        "day_of_week",
        "product_quality",
    ]

    records = []
    random.seed(42)

    for i in range(num_records):
        crop = random.choice(CROPS)
        location = random.choice(crop["locations"])
        days_offset = random.randint(0, 650)
        rec_date = start_date + timedelta(days=days_offset)
        
        month = rec_date.month
        day_of_week = rec_date.strftime("%A")
        
        # Season determination based on Indian crop cycle
        if month in [6, 7, 8, 9]:
            season = "Kharif"
        elif month in [10, 11, 12, 1, 2]:
            season = "Rabi"
        elif month in [3, 4, 5]:
            season = "Summer"
        else:
            season = "Zaid"

        quality = random.choices(QUALITIES, weights=[0.25, 0.45, 0.15, 0.15])[0]
        
        # Price variation based on quality, season, and random fluctuation
        quality_mult = 1.25 if quality == "Organic Certified" else (1.15 if quality == "Grade A (Export)" else (1.0 if quality == "Grade A" else 0.85))
        seasonal_mult = 1.18 if season in crop["season_peaks"] else 0.95
        noise = random.uniform(-0.12, 0.15)
        
        selling_price = round(crop["base_price"] * quality_mult * seasonal_mult * (1 + noise), 2)
        
        supply_kg = int(crop["base_supply"] * random.uniform(0.7, 1.4))
        # Demand score (0 to 100) inversely correlated with supply surplus and positively with festive/peak months
        festive_boost = 12 if month in [9, 10, 11] else 0
        demand_score = min(99, max(25, int(70 + festive_boost - (supply_kg / crop["base_supply"] - 1) * 35 + random.randint(-8, 8))))
        
        sold_kg = int(supply_kg * (demand_score / 100) * random.uniform(0.85, 1.05))
        sold_kg = min(sold_kg, supply_kg)

        records.append({
            "product_name": crop["name"],
            "product_category": crop["category"],
            "market_location": location,
            "date": rec_date.strftime("%Y-%m-%d"),
            "historical_selling_price": selling_price,
            "quantity_supplied_kg": supply_kg,
            "quantity_sold_kg": sold_kg,
            "demand_score": demand_score,
            "season": season,
            "month": month,
            "day_of_week": day_of_week,
            "product_quality": quality,
        })

    # Sort chronological
    records.sort(key=lambda r: r["date"])

    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"✅ Generated {len(records)} realistic agricultural benchmark records -> {CSV_FILE}")
    return records

if __name__ == "__main__":
    generate_dataset()
