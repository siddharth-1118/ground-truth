import sys
import os

# Add backend directory to python path for relative imports
sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import CheckRequest, VoteRequest
from grounding import compute_grounding
from judge import pairwise_judge
from elo import update, leaderboard

app = FastAPI(
    title="GroundTruth API",
    description="Fact-checking agent using SerpApi to verify claims and rank LLMs by factual grounding.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import FileResponse

@app.get("/")
def read_root():
    html_path = os.path.join(os.path.dirname(__file__), "index.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    return {
        "status": "online",
        "service": "GroundTruth API",
        "version": "1.0.0",
        "pitch": "Preference is cheap. Grounding is verifiable. GroundTruth ranks AI models by what they can prove."
    }

from mcp_server import mcp_tools_schema, handle_mcp_call

@app.get("/mcp")
def get_mcp_schema():
    return mcp_tools_schema()

@app.post("/mcp/call")
def call_mcp_tool(req: dict):
    tool_name = req.get("tool_name", "")
    args = req.get("args", {})
    return handle_mcp_call(tool_name, args)



@app.post("/fact-check")
def fact_check(req: CheckRequest):
    try:
        model_a_name = req.model_a_name or "Model A"
        model_b_name = req.model_b_name or "Model B"

        ga = compute_grounding(req.answer_a)
        gb = compute_grounding(req.answer_b)
        verdict = pairwise_judge(
            q=req.question,
            a=req.answer_a,
            b=req.answer_b,
            ga=ga,
            gb=gb,
            model_a_name=model_a_name,
            model_b_name=model_b_name
        )

        return {
            "grounding_a": ga,
            "grounding_b": gb,
            "judge": verdict
        }
    except Exception as e:
        print(f"[API Error] /fact-check exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vote")
def vote(req: VoteRequest):
    try:
        updated_ratings = update(req.model_a, req.model_b, req.winner)
        return {"leaderboard": leaderboard()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/leaderboard")
def get_leaderboard():
    return {"leaderboard": leaderboard()}
