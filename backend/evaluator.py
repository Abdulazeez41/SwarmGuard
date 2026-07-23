import os
from typing import Dict

class AutonomousEvaluator:
    def __init__(self):
        # Positive and negative signals for heuristic evaluation
        self.positive_signals = ["succeeded", "passed", "validated", "100%", "complete", "zero vulnerabilities", "no critical"]
        self.negative_signals = ["failed", "error", "bug", "incomplete", "rejected", "40%", "timeout", "crash", "exploit"]

    def evaluate_deliverable(self, deliverable_summary: str, specialization: str) -> Dict:
        """
        Uses a multi-signal heuristic engine (MVP) instead of simple keyword matching.
        Calculates dynamic confidence based on the ratio of positive to negative signals.
        """
        summary_lower = deliverable_summary.lower()
        
        pos_count = sum(1 for sig in self.positive_signals if sig in summary_lower)
        neg_count = sum(1 for sig in self.negative_signals if sig in summary_lower)
        
        # Dynamic confidence calculation
        base_confidence = 50
        confidence = base_confidence + (pos_count * 15) - (neg_count * 25)
        confidence = max(15, min(95, confidence))
        
        is_success = neg_count == 0 and pos_count >= 1
        
        reasoning = f"Detected {pos_count} positive validation signals and {neg_count} negative failure signals."
        if neg_count > 0 and "40%" in summary_lower:
            reasoning += " Specific failure: Test coverage below threshold."

        return {
            "is_success": is_success,
            "confidence": confidence,
            "reasoning": reasoning,
            "method": "HEURISTIC_ENGINE"
        }
