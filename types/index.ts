export type Verdict = "supported" | "refuted" | "uncertain";

export interface Claim {
  claim: string;
  verdict: Verdict;
  score: number;
  reasoning: string;
  source_url?: string;
}

export interface GroundingResult {
  grounding_score: number;
  claims_supported: number;
  claims_refuted: number;
  details: Claim[];
}

export interface JudgeVerdict {
  winner: "A" | "B" | "tie";
  confidence: number;
  reasoning: string;
}

export interface FactCheckResponse {
  grounding_a: GroundingResult;
  grounding_b: GroundingResult;
  judge: JudgeVerdict;
}

export interface LeaderboardItem {
  model: string;
  elo: number;
}

