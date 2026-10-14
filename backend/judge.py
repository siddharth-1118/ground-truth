import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.deepseek.com")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

def get_llm_client():
    api_key = DEEPSEEK_API_KEY or os.getenv("OPENAI_API_KEY", "")
    if not api_key or api_key.startswith("your_"):
        return None
    return OpenAI(api_key=api_key, base_url=LLM_BASE_URL)

def pairwise_judge(q: str, a: str, b: str, ga: dict, gb: dict, model_a_name: str = "Model A", model_b_name: str = "Model B") -> dict:
    client = get_llm_client()
    if not client:
        # Fallback decision based directly on grounding scores
        score_a = ga.get("grounding_score", 0)
        score_b = gb.get("grounding_score", 0)
        if score_a > score_b:
            winner = "A"
            reasoning = f"{model_a_name} achieved higher factual grounding ({score_a}/100) compared to {model_b_name} ({score_b}/100)."
        elif score_b > score_a:
            winner = "B"
            reasoning = f"{model_b_name} achieved higher factual grounding ({score_b}/100) compared to {model_a_name} ({score_a}/100)."
        else:
            winner = "tie"
            reasoning = f"Both {model_a_name} and {model_b_name} showed equal factual grounding scores ({score_a}/100)."
        return {"winner": winner, "confidence": 0.8, "reasoning": reasoning}

    prompt = f"""Judge which response is more factually grounded based on SerpApi evidence verification.

QUESTION: {q}

RESPONSE A ({model_a_name}):
{a}

GROUNDING ANALYSIS A:
Score: {ga.get('grounding_score', 0)}/100
Supported Claims: {ga.get('claims_supported', 0)}
Refuted Claims: {ga.get('claims_refuted', 0)}
Analyzed Claims: {ga.get('claims_analyzed', 0)}

RESPONSE B ({model_b_name}):
{b}

GROUNDING ANALYSIS B:
Score: {gb.get('grounding_score', 0)}/100
Supported Claims: {gb.get('claims_supported', 0)}
Refuted Claims: {gb.get('claims_refuted', 0)}
Analyzed Claims: {gb.get('claims_analyzed', 0)}

Return JSON: {{"winner": "A"|"B"|"tie", "confidence": float_between_0_and_1, "reasoning": "2 sentences explaining the decision based on factual evidence"}}"""

    try:
        resp = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.0,
            max_tokens=300
        )
        data = json.loads(resp.choices[0].message.content)
        winner = str(data.get("winner", "tie")).upper()
        if winner not in ["A", "B", "TIE"]:
            winner = "tie"
        return {
            "winner": winner,
            "confidence": float(data.get("confidence", 0.85)),
            "reasoning": data.get("reasoning", f"Comparison completed for {model_a_name} vs {model_b_name}.")
        }
    except Exception as e:
        print(f"[Judge Error] {e}")
        score_a = ga.get("grounding_score", 0)
        score_b = gb.get("grounding_score", 0)
        winner = "A" if score_a > score_b else ("B" if score_b > score_a else "tie")
        return {
            "winner": winner,
            "confidence": 0.75,
            "reasoning": f"Judged based on grounding score delta ({score_a} vs {score_b}). Error in LLM judge call: {e}"
        }
