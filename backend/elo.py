import json
import os

ELO_FILE = os.path.join(os.path.dirname(__file__), "..", "elo.json")

INITIAL_SEEDS = {
    "Claude 3.5 Sonnet": 1640.0,
    "GPT-4o": 1625.0,
    "DeepSeek-V3": 1610.0,
    "Gemini 1.5 Pro": 1580.0,
    "Llama 3.3 70B": 1550.0,
    "Mistral Large": 1520.0
}

def load() -> dict:
    if os.path.exists(ELO_FILE):
        try:
            with open(ELO_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if data:
                    return data
        except Exception as e:
            print(f"[Elo Load Warning] Could not read elo.json: {e}")
    return dict(INITIAL_SEEDS)

def save(ratings: dict):
    try:
        with open(ELO_FILE, "w", encoding="utf-8") as f:
            json.dump(ratings, f, indent=2)
    except Exception as e:
        print(f"[Elo Save Error] {e}")

def update(a: str, b: str, winner: str, k: float = 32.0) -> dict:
    ratings = load()
    ra = ratings.get(a, 1500.0)
    rb = ratings.get(b, 1500.0)

    ea = 1.0 / (1.0 + 10.0 ** ((rb - ra) / 400.0))

    if winner in ["A", a]:
        sa, sb = 1.0, 0.0
    elif winner in ["B", b]:
        sa, sb = 0.0, 1.0
    else:
        sa, sb = 0.5, 0.5

    ratings[a] = round(ra + k * (sa - ea), 1)
    ratings[b] = round(rb + k * (sb - (1.0 - ea)), 1)

    save(ratings)
    return ratings

def leaderboard() -> list[dict]:
    ratings = load()
    sorted_items = sorted(ratings.items(), key=lambda x: -x[1])
    return [{"model": m, "elo": round(v, 1)} for m, v in sorted_items]
