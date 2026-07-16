from typing import Dict, Any

class MarketplaceDataCollector:
    def get_agent_marketplace_data(self, agent_id: str) -> Dict:
        return {
            "agent_id": agent_id,
            "raw_metrics": {
                "completed_jobs": 0,
                "average_rating": 0.0,
                "total_transactions": 5,
                "wallet_balance_eth": 0.5,
                "active_disputes": 0
            }
        }

    def calculate_transparent_scores(self, marketplace_data: Dict) -> Dict:
        metrics = marketplace_data["raw_metrics"]
        
        if metrics["completed_jobs"] == 0:
            return {
                "total": 75,
                "confidence": "Low",
                "scores": {
                    "provisional_trust": 75,
                    "dispute_history": 20,
                    "completion_rate": 0,
                    "user_ratings": 0,
                    "proof_of_work": 0
                },
                "status": "PROVISIONAL (New Agent)"
            }
        
        completion_score = min(30, metrics["completed_jobs"] * 2)
        dispute_score = 20 if metrics["active_disputes"] == 0 else 0
        rating_score = min(25, metrics["average_rating"] * 5)
        pow_score = min(25, metrics["total_transactions"] * 0.5)
        
        total = completion_score + dispute_score + rating_score + pow_score
        
        return {
            "total": total,
            "confidence": "High" if metrics["completed_jobs"] > 10 else "Medium",
            "scores": {
                "completion_rate": completion_score,
                "dispute_history": dispute_score,
                "user_ratings": rating_score,
                "proof_of_work": pow_score
            },
            "status": "VERIFIED"
        }
