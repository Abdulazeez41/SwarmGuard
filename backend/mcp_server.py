from mcp.server.fastmcp import FastMCP
from web3 import Web3
import re
from marketplace_collector import MarketplaceDataCollector
from swarm_orchestrator import SwarmOrchestrator

mcp = FastMCP("SwarmGuard: Autonomous Workforce OS")
XLayer_RPC = "https://testrpc.xlayer.tech"
w3 = Web3(Web3.HTTPProvider(XLayer_RPC))

marketplace = MarketplaceDataCollector()
swarm = SwarmOrchestrator()

def is_valid_evm_address(address: str) -> bool:
    return bool(re.match(r"^0x[a-fA-F0-9]{40}$", address))

@mcp.tool()
def generate_credit_report(agent_identifier: str) -> dict:
    """Generates a Decision Intelligence Report for a single agent."""
    wallet_address = agent_identifier
    agent_id = None
    if agent_identifier.isdigit():
        agent_id = agent_identifier
        if agent_id in ["5889", "5922", "5765", "5993"]:
            wallet_address = "0x1b2f5d07f1ed46bdbbeb019ee7797f65d8d2dbfd"
    
    if not is_valid_evm_address(wallet_address):
        return {"error": "Invalid Agent ID or EVM wallet address format."}
    
    try:
        checksum_address = w3.to_checksum_address(wallet_address)
        nonce = w3.eth.get_transaction_count(checksum_address)
        balance_wei = w3.eth.get_balance(checksum_address)
        balance_eth = float(w3.from_wei(balance_wei, 'ether'))
        
        marketplace_data = marketplace.get_agent_marketplace_data(agent_id or wallet_address)
        behavioral_profile = marketplace.generate_behavioral_profile(marketplace_data)
        risk_factors = marketplace.generate_risk_factors(marketplace_data)
        credit_events = marketplace.generate_credit_events(marketplace_data)
        specialization = marketplace.determine_specialization(marketplace_data)
        prediction = marketplace.predict_delivery_success(marketplace_data)
        score_data = marketplace.calculate_transparent_scores(marketplace_data)
        
        total_score = score_data["total"]
        primary_strength = "Strong behavioral profile" if "Proven Track Record" in behavioral_profile else "Zero adverse disputes (New Agent)"
        primary_risk = risk_factors[0] if risk_factors and "No significant" not in risk_factors[0] else "None detected"

        if total_score >= 80 and prediction["confidence"] >= 70:
            hiring_verdict = "HIGHLY RECOMMENDED"
            decision_reason = "Strong track record, excellent behavioral profile, and high prediction confidence."
        elif total_score >= 60:
            hiring_verdict = "RECOMMENDED WITH CAUTION"
            decision_reason = "Adequate history, but monitor specific risk factors."
        else:
            hiring_verdict = "NOT RECOMMENDED FOR HIGH-VALUE TASKS"
            decision_reason = "Insufficient data or elevated risk factors. Consider a low-value trial."

        return {
            "report_type": "Decision Intelligence Report",
            "identity": {"agent_id": agent_id or "N/A", "network": "XLayer Mainnet" if agent_id in ["5765", "5993"] else "XLayer Testnet", "wallet": checksum_address},
            "behavioral_profile": behavioral_profile,
            "risk_factors": risk_factors,
            "credit_events": credit_events,
            "prediction_and_confidence": {"success_probability": f"{prediction['probability']}%", "confidence_level": f"{prediction['confidence']}%"},
            "hiring_decision": {"verdict": hiring_verdict, "reason": decision_reason},
            "executive_summary": {"overall_decision_intelligence_score": total_score, "primary_strength": primary_strength, "primary_risk": primary_risk}
        }
    except Exception as e:
        return {"error": f"Failed to generate report: {str(e)}"}

@mcp.tool()
def initiate_swarm_task(project_brief: str, budget_usd: float) -> dict:
    """
    SwarmGuard Tool 1: Deploys an autonomous workforce. 
    Validates budget constraints and locks performance bonds before hiring.
    """
    return swarm.initiate_swarm(project_brief, budget_usd)

@mcp.tool()
def evaluate_and_heal_milestone(task_id: str, deliverable_summary: str) -> dict:
    """
    SwarmGuard Tool 2: The Autonomous Evaluator. 
    Analyzes the deliverable summary for objective success/failure keywords. 
    On failure, it autonomously forfeits performance bonds, records Swarm Memory lessons, and hires a Truora-optimized replacement.
    """
    return swarm.evaluate_and_heal(task_id, deliverable_summary)

@mcp.tool()
def get_swarm_status(task_id: str) -> dict:
    """
    SwarmGuard Tool 3: Returns the real-time status, active team, Swarm Memory lessons, and full chronological event log.
    """
    return swarm.get_swarm_status(task_id)

if __name__ == "__main__":
    mcp.run()
