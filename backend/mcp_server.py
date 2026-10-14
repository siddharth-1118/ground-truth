import json
import sys
import os

# Ensure backend directory in sys.path
sys.path.append(os.path.dirname(__file__))

from grounding import search_claim, compute_grounding
from judge import pairwise_judge

def mcp_tools_schema():
    return {
        "mcp_version": "1.0",
        "name": "GroundTruth SerpApi MCP Server",
        "description": "Model Context Protocol (MCP) tool integration for SerpApi live web search evidence and factual grounding.",
        "tools": [
            {
                "name": "serpapi_search_tool",
                "description": "Queries Google live web search via SerpApi search tools to retrieve organic snippets and position rankings.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "claim": {"type": "string", "description": "The atomic claim to verify"}
                    },
                    "required": ["claim"]
                }
            },
            {
                "name": "groundtruth_fact_check_tool",
                "description": "Extracts atomic claims from a text response and computes position-weighted SerpApi grounding score.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "answer": {"type": "string", "description": "The AI model output to verify"}
                    },
                    "required": ["answer"]
                }
            },
            {
                "name": "groundtruth_pairwise_judge_tool",
                "description": "Compares two candidate model responses side-by-side based on live SerpApi factual evidence.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "question": {"type": "string"},
                        "answer_a": {"type": "string"},
                        "answer_b": {"type": "string"}
                    },
                    "required": ["question", "answer_a", "answer_b"]
                }
            }
        ]
    }

def handle_mcp_call(tool_name: str, args: dict) -> dict:
    if tool_name == "serpapi_search_tool":
        claim = args.get("claim", "")
        evidence = search_claim(claim)
        return {"tool": tool_name, "claim": claim, "evidence": evidence}
    elif tool_name == "groundtruth_fact_check_tool":
        answer = args.get("answer", "")
        grounding = compute_grounding(answer)
        return {"tool": tool_name, "grounding": grounding}
    elif tool_name == "groundtruth_pairwise_judge_tool":
        q = args.get("question", "")
        a = args.get("answer_a", "")
        b = args.get("answer_b", "")
        ga = compute_grounding(a)
        gb = compute_grounding(b)
        verdict = pairwise_judge(q, a, b, ga, gb)
        return {"tool": tool_name, "grounding_a": ga, "grounding_b": gb, "verdict": verdict}
    else:
        return {"error": f"Unknown MCP tool: {tool_name}"}

if __name__ == "__main__":
    print(json.dumps(mcp_tools_schema(), indent=2))
