# GroundTruth • Verifiable AI Fact-Checking & Grounding Benchmark

> **"Every other arena asks which answer you like. GroundTruth asks which answer we can prove."**

GroundTruth is a full-stack AI fact-checking framework and benchmark that decomposes LLM answers into atomic claims, grounds each claim in live **SerpApi** search evidence, and ranks models using a **Bradley-Terry Elo** rating system based on verifiable facts rather than human preference votes.

---

## 🚀 Quick Start (Under 60 Seconds)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/groundtruth.git
cd groundtruth

# 2. Install dependencies
npm install

# 3. Launch the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Architecture & Features

1. **Hero Section**: Includes the verbatim thesis headline, animated side-by-side scorecard mockup, and smooth-scrolling CTAs to `#demo` and `#leaderboard`.
2. **4 Architectural Pillars**:
   - **Atomic Claim Decomposition**: Splits AI answers into independently verifiable factual claims.
   - **Position-Weighted SerpApi Grounding**: Weights top search results with higher credibility scores.
   - **Pairwise LLM Judge**: Evaluates claim grounding against retrieved search evidence.
   - **Elo Reliability Leaderboard**: Ranks models by factual accuracy using Bradley-Terry Elo ratings.
3. **Interactive Demo Section (`#demo`)**:
   - Real-time pairwise claim verification between Model A and Model B.
   - Automatic fallback to **DEMO MODE** if the FastAPI backend is offline (using the James Webb Space Telescope benchmark fixture).
   - Animated count-up score meters ($\le 1.2\text{s}$).
   - Expandable supported/refuted claim cards with direct SerpApi source links (`https://www.nasa.gov/webb`).
4. **Elo Leaderboard Section (`#leaderboard`)**:
   - Renders sorted model rankings.
   - Automatically updates and re-sorts standings after votes without requiring a page reload.
5. **Community Benchmarks & Footer**:
   - Testimonials from AI alignment researchers and ML engineers.
   - Verbatim closing principle: *"Preference is cheap. Grounding is verifiable."*

---

## 📡 Wiring the FastAPI Backend

GroundTruth connects to a Python FastAPI service running at `http://localhost:8000`.

### 1. `POST /fact-check`
**Request Body**:
```json
{
  "question": "What year did the James Webb Space Telescope launch, and what is its primary mirror diameter?",
  "answer_a": "JWST launched December 25, 2021 on an Ariane 5 rocket. Its primary mirror is 6.5 meters in diameter...",
  "answer_b": "JWST launched in 2022 on a Falcon 9. Its primary mirror is 8.2 meters in diameter."
}
```

**Response Contract**:
```json
{
  "grounding_a": {
    "grounding_score": 88,
    "claims_supported": 2,
    "claims_refuted": 0,
    "details": [
      {
        "claim": "JWST launched December 25, 2021 on an Ariane 5 rocket.",
        "verdict": "supported",
        "score": 95,
        "reasoning": "Verified by NASA official launch manifest.",
        "source_url": "https://www.nasa.gov/webb"
      }
    ]
  },
  "grounding_b": {
    "grounding_score": 22,
    "claims_supported": 0,
    "claims_refuted": 2,
    "details": [
      {
        "claim": "JWST launched in 2022 on a Falcon 9.",
        "verdict": "refuted",
        "score": 10,
        "reasoning": "Refuted: JWST launched Dec 25, 2021 on Ariane 5, not Falcon 9 in 2022.",
        "source_url": "https://www.nasa.gov/webb"
      }
    ]
  },
  "judge": {
    "winner": "A",
    "confidence": 0.96,
    "reasoning": "Model A's claims are directly supported by NASA sources. Model B misstates both launch year and mirror size."
  }
}
```

### 2. `GET /leaderboard`
Returns current model Elo ratings: `[{ "model": "GPT-4o", "elo": 1612 }, ...]`

### 3. `POST /vote`
Records a pairwise verdict and updates the Bradley-Terry Elo state: `{ "model_a": "Claude 3.5 Sonnet", "model_b": "Unverified Model", "winner": "A" }`

---

## 📜 License & Attribution

- Powered by [SerpApi](https://serpapi.com) for real-time web search evidence retrieval.
- Released under the MIT License. Copyright © 2026 GroundTruth.

