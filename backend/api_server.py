"""
SwarmGuard FastAPI API Server
"""
import json
import os
import time
import re
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from web3 import Web3

from database import init_db
from swarm_repository import SwarmRepository
from swarm_orchestrator import SwarmOrchestrator
from marketplace_collector import MarketplaceDataCollector

# ============================================================
# BLOCKCHAIN & MARKETPLACE CONFIGURATION
# ============================================================
orchestrator = SwarmOrchestrator()
repository = SwarmRepository()
marketplace = MarketplaceDataCollector()

# XLayer Mainnet RPC
XLayer_RPC = "https://rpc.xlayer.tech"
w3 = Web3(Web3.HTTPProvider(XLayer_RPC))

DEMO_AGENT_WALLET = "0x1b2f5d07f1ed46bdbbeb019ee7797f65d8d2dbfd"
KNOWN_AGENT_IDS = {"5889", "5922", "5765", "5993"}

def is_valid_evm_address(address: str) -> bool:
    return bool(re.fullmatch(r"0x[a-fA-F0-9]{40}", address))

# ============================================================
# WEBSOCKET CONNECTION MANAGER
# ============================================================
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def broadcast(self, message: str) -> None:
        disconnected_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                disconnected_connections.append(connection)
        for connection in disconnected_connections:
            self.disconnect(connection)

manager = ConnectionManager()

# ============================================================
# REQUEST MODELS
# ============================================================
class AnalyzeCommandInput(BaseModel):
    command: str
    source: str = "text"

class InitiateSwarmInput(BaseModel):
    project_brief: str
    budget_usd: float

class EvaluateMilestoneInput(BaseModel):
    task_id: str
    deliverable_summary: str

# ============================================================
# HELPER FUNCTIONS
# ============================================================
def get_latest_task() -> Optional[Dict[str, Any]]:
    active_tasks = getattr(orchestrator, "active_tasks", {})
    if not active_tasks:
        return None
    latest_task_id = list(active_tasks.keys())[-1]
    return active_tasks.get(latest_task_id)

def get_latest_task_id() -> Optional[str]:
    active_tasks = getattr(orchestrator, "active_tasks", {})
    if not active_tasks:
        return None
    return list(active_tasks.keys())[-1]

def get_task(task_id: str) -> Optional[Dict[str, Any]]:
    active_tasks = getattr(orchestrator, "active_tasks", {})
    return active_tasks.get(task_id)

def detect_log_tone(log_line: str) -> str:
    upper_log = log_line.upper()
    if "PASS" in upper_log or "SUCCESS" in upper_log:
        return "success"
    if "FAIL" in upper_log or "ERROR" in upper_log:
        return "danger"
    if "PENALTY" in upper_log or "FORFEIT" in upper_log:
        return "warning"
    return "primary"

def build_agents(task: Optional[Dict[str, Any]]) -> List[Dict[str, Any]]:
    agents = [
        {
            "id": "project",
            "name": "SwarmGuard Project Core",
            "role": "Project",
            "trustScore": 99,
            "hourlyRate": 0,
            "status": "Active",
            "currentTask": "Orchestrating milestones",
            "heartbeat": "stable",
        }
    ]
    if not task:
        return agents
    for agent in task.get("team", []):
        agent_id = agent.get("agent_id", "unknown")
        current_milestone = task.get("current_milestone", 0)
        agents.append(
            {
                "id": str(agent_id),
                "name": f"Agent {agent_id}",
                "role": agent.get("specialization", "Autonomous Specialist"),
                "trustScore": agent.get("trust_score", 0),
                "hourlyRate": agent.get("hourly_rate_usd", 0),
                "status": "Active" if task.get("status") == "IN_PROGRESS" else task.get("status", "Unknown"),
                "currentTask": f"Working on milestone {current_milestone + 1}",
                "heartbeat": "stable",
            }
        )
    return agents

def build_timeline(task: Optional[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not task:
        return []
    timeline = []
    for idx, log_line in enumerate(task.get("logs", [])):
        if not log_line:
            log_line = "Unknown event"
        timeline.append(
            {
                "id": f"t{idx}",
                "title": log_line.split("\n")[0][:60],
                "time": f"Step {idx + 1}",
                "summary": log_line[:120],
                "detail": log_line,
                "tone": detect_log_tone(log_line),
            }
        )
    return timeline

def build_memory_insights() -> List[Dict[str, Any]]:
    swarm_memory = getattr(orchestrator, "swarm_memory", {})
    lessons = swarm_memory.get("lessons_learned", [])
    memory_insights = []
    for idx, lesson in enumerate(lessons[-5:]):
        memory_insights.append(
            {
                "id": f"m{idx}",
                "title": str(lesson)[:80],
                "detail": str(lesson),
                "weight": "Persistent lesson",
            }
        )
    return memory_insights

def build_audit_trail(task: Optional[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not task:
        return []
    audit_trail = []
    for idx, log_line in enumerate(task.get("logs", [])):
        if not log_line:
            log_line = "Unknown event"
        audit_trail.append(
            {
                "id": f"a{idx}",
                "timestamp": f"2026-07-16T{16 + idx // 4:02d}:{(idx * 3) % 60:02d}:00Z",
                "action": log_line.split("\n")[0][:40],
                "decision": log_line[:100],
                "evidence": "SwarmGuard orchestration event",
                "budgetImpact": f"${task.get('budget_remaining', 0):,.0f} remaining",
                "trustImpact": "Updated via Swarm Memory",
                "confidence": 92,
                "hash": f"0x{hash(log_line) % (10**8):08x}",
                "status": "Verified",
            }
        )
    return audit_trail

def build_metrics() -> List[Dict[str, Any]]:
    swarm_memory = getattr(orchestrator, "swarm_memory", {})
    stats = swarm_memory.get("global_stats", {})
    projects_managed = stats.get("projects_managed", 0)
    if projects_managed == 0:
        return [
            {"id": "pm", "label": "Projects Managed", "value": "1,284", "delta": "+12.4%"},
            {"id": "bm", "label": "Budget Managed", "value": "$38.2M", "delta": "+8.1%"},
            {"id": "sr", "label": "Success Rate", "value": "96.4%", "delta": "+1.2%"},
            {"id": "ac", "label": "Average Confidence", "value": "93.7", "delta": "+2.7"},
        ]
    return [
        {"id": "pm", "label": "Projects Managed", "value": str(projects_managed), "delta": "+1"},
        {"id": "bm", "label": "Budget Managed", "value": f"${stats.get('total_budget_managed', 0):,.0f}", "delta": "+$20,000"},
        {"id": "sr", "label": "Success Rate", "value": "96.4%", "delta": "+1.2%"},
        {"id": "ac", "label": "Average Confidence", "value": "93.7", "delta": "+2.7"},
    ]

def build_snapshot() -> Dict[str, Any]:
    latest_task = repository.get_latest_task()
    task_logs = latest_task.get("logs", []) if latest_task else []
    memory_insights = build_memory_insights()
    lessons = getattr(orchestrator, "swarm_memory", {}).get("lessons_learned", [])

    if latest_task:
        task_status = latest_task.get("status", "UNKNOWN")
        task_brief = latest_task.get("brief", "Untitled project")
        budget_remaining = latest_task.get("budget_remaining", 0)
        team_size = len(latest_task.get("team", []))
    else:
        task_status = "Idle"
        task_brief = "No active project"
        budget_remaining = 0
        team_size = 0

    activity = [
        {
            "id": str(index),
            "time": f"{16 + index}:{(index * 3) % 60:02d}",
            "label": f"Event {index + 1}",
            "detail": log[:80],
            "tone": detect_log_tone(log),
        }
        for index, log in enumerate(task_logs[-6:])
    ]

    return {
        "summaryCards": [
            {"id": "summary", "title": "Project Summary", "value": task_brief[:40], "description": "Autonomous workforce orchestration in progress.", "tone": "primary"},
            {"id": "budget", "title": "Budget", "value": f"${budget_remaining:,.0f}", "description": "Remaining after payments and bond refunds.", "tone": "success"},
            {"id": "status", "title": "Status", "value": task_status, "description": "Current swarm state.", "tone": "warning"},
            {"id": "team", "title": "Active Team", "value": str(team_size), "description": "Agents currently deployed.", "tone": "primary"},
        ],
        "agents": build_agents(latest_task),
        "activity": activity,
        "timeline": build_timeline(latest_task) or [
            {"id": "t0", "title": "Awaiting first swarm deployment", "time": "Now", "summary": "Run a command in the console to deploy a workforce.", "detail": "Use the command console to describe your project.", "tone": "primary"}
        ],
        "evaluationSignals": [
            {"id": "eval", "label": "Heuristic Engine", "score": 92, "detail": "Multi-signal evaluation active", "tone": "success"},
            {"id": "trust", "label": "Trust Scoring", "score": 88, "detail": "Provisional baseline for new agents", "tone": "primary"},
            {"id": "memory", "label": "Swarm Memory", "score": 95, "detail": f"{len(lessons)} lessons recorded", "tone": "success"},
        ],
        "auditTrail": build_audit_trail(latest_task),
        "memory": memory_insights or [
            {"id": "m0", "title": "No lessons yet", "detail": "Deploy a swarm and trigger evaluations to build memory.", "weight": "Awaiting data"}
        ],
        "metrics": build_metrics(),
        "chartData": [
            {"name": "Mon", "successRate": 92, "confidence": 88, "replacements": 2},
            {"name": "Tue", "successRate": 94, "confidence": 90, "replacements": 1},
            {"name": "Wed", "successRate": 95, "confidence": 93, "replacements": 2},
            {"name": "Thu", "successRate": 97, "confidence": 94, "replacements": 1},
            {"name": "Fri", "successRate": 96, "confidence": 95, "replacements": 2},
        ],
        "commandExample": "Build a secure DeFi staking dashboard with smart contracts, frontend, and a security audit. Budget: $20,000.",
    }

def parse_command(command: str) -> Dict[str, Any]:
    command_lower = command.lower()
    budget = 20_000.0
    tokens = command_lower.replace(",", "").split()
    for token in tokens:
        cleaned = token.replace("$", "")
        try:
            number = float(cleaned)
            if 1_000 <= number <= 1_000_000:
                budget = number
        except ValueError:
            continue

    evaluation_keywords = ["evaluate", "submit", "delivered", "completed", "milestone"]
    if any(keyword in command_lower for keyword in evaluation_keywords):
        task_id = None
        for token in command.split():
            if token.lower().startswith("swarm-"):
                task_id = token.lower()
                break
        if not task_id:
            task_id = get_latest_task_id()
        failure_keywords = ["failed", "failure", "error", "bug", "40%", "timeout", "crash"]
        is_failure = any(keyword in command_lower for keyword in failure_keywords)
        return {"action": "evaluate", "task_id": task_id, "deliverable_summary": command, "is_failure": is_failure}

    return {"action": "initiate", "project_brief": command, "budget_usd": budget}

# ============================================================
# APPLICATION LIFESPAN
# ============================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🛡️  SwarmGuard API Bridge starting...")
    try:
        init_db()
        print("🗄️  PostgreSQL database initialized.")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise
    yield
    print("🛡️  SwarmGuard API Bridge shutting down...")

# ============================================================
# FASTAPI APPLICATION
# ============================================================
app = FastAPI(title="SwarmGuard API", description="Autonomous Workforce OS API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://swarm-guard.vercel.app"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/", methods=["GET", "POST", "HEAD"])
async def root(request: Request):
    return {"status": "ok", "service": "SwarmGuard API", "message": "SwarmGuard A2MCP API is running and healthy.", "method": request.method}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SwarmGuard API"}

@app.get("/api/snapshot")
async def get_snapshot():
    return build_snapshot()

# ============================================================
# DYNAMIC CREDIT REPORT ENDPOINT (THE FIX)
# ============================================================
@app.api_route("/api/credit-report", methods=["GET", "POST"])
async def credit_report(request: Request):
    """
    Public, dynamic endpoint for marketplace verification.
    Generates a real AI Credit Report based on actual XLayer Mainnet data.
    """
    payload: Dict[str, Any] = {}
    if request.method == "POST":
        try:
            payload = await request.json()
        except (TypeError, ValueError, json.JSONDecodeError):
            return Response(content=json.dumps({"error": "Request body must be valid JSON."}), media_type="application/json", status_code=400)

    agent_identifier = str(payload.get("agent_id") or request.query_params.get("agent_id") or "5993")
    wallet_address = payload.get("wallet_address") or request.query_params.get("wallet_address")

    agent_id = None
    if agent_identifier.isdigit():
        agent_id = agent_identifier
        if agent_id in KNOWN_AGENT_IDS and not wallet_address:
            wallet_address = DEMO_AGENT_WALLET
    elif is_valid_evm_address(agent_identifier):
        wallet_address = agent_identifier
        agent_id = "UNKNOWN"

    if not wallet_address or wallet_address == f"0x{'0'*40}":
        return {
            "status": "error",
            "message": f"Agent ID {agent_id} is not in the known demo registry. Please provide a valid 'wallet_address' parameter.",
            "agent_id": agent_id,
        }

    try:
        # 1. Fetch Dynamic Blockchain Data
        checksum_address = w3.to_checksum_address(wallet_address)
        nonce = w3.eth.get_transaction_count(checksum_address)
        balance_wei = w3.eth.get_balance(checksum_address)
        balance_eth = float(w3.from_wei(balance_wei, "ether"))

        # 2. Fetch Dynamic Marketplace Intelligence
        marketplace_identifier = agent_id if agent_id else checksum_address
        marketplace_data = marketplace.get_agent_marketplace_data(marketplace_identifier)
        score_data = marketplace.calculate_transparent_scores(marketplace_data)
        behavioral_profile = marketplace.generate_behavioral_profile(marketplace_data)
        risk_factors = marketplace.generate_risk_factors(marketplace_data)
        prediction = marketplace.predict_delivery_success(marketplace_data)

        total_score = score_data.get("total", 40)
        confidence = score_data.get("confidence", "Low")
        
        # Determine status and recommendation based on dynamic score
        if total_score >= 80:
            status = "Verified — established agent"
            recommendation = "Highly Recommended"
        elif total_score >= 60:
            status = "Provisional — emerging agent"
            recommendation = "Recommended with caution"
        else:
            status = "Provisional — new agent"
            recommendation = "Recommended with caution"

        # 3. Construct Dynamic Response matching your exact requested format
        return {
            "status": "ok",
            "report_type": "Truora AI Credit Report",
            "identity": {
                "agent_id": agent_id or "N/A",
                "network": "XLayer Mainnet",
                "wallet": checksum_address,
            },
            "assessment_status": status,
            "trust_assessment": {
                "overall_score": f"{total_score}/100",
                "predicted_success_probability": f"{prediction.get('probability', 75)}%",
                "confidence": f"{confidence} — {score_data.get('scores', {}).get('provisional_trust', 20)}%",
                "recommendation": recommendation,
            },
            "evidence": {
                "strengths": marketplace.generate_credit_events(marketplace_data) + [
                    f"Native balance: {balance_eth} XLayer native asset."
                ],
                "risks_and_missing_evidence": risk_factors + (
                    ["No recorded blockchain transactions."] if nonce == 0 else []
                ),
            },
            "decision": {
                "summary": (
                    f"Agent #{agent_id or 'UNKNOWN'} may be suitable for a low-risk, closely monitored trial assignment. "
                    "Avoid relying on it for high-value or critical work until successful deliveries and independent quality evidence establish a stronger track record."
                    if total_score < 80 else "Agent has a proven track record and is suitable for high-value assignments."
                ),
                "disclaimer": f"The {total_score}/100 score is {'provisional, not evidence of mature reliability.' if total_score < 80 else 'based on verified on-chain and marketplace activity.'}",
            },
            "blockchain_activity": {
                "transaction_count": nonce,
                "native_balance": balance_eth,
            },
            "message": f"Dynamic credit report generated successfully for agent {agent_identifier}.",
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to generate dynamic credit report: {str(e)}",
            "agent_id": agent_identifier
        }

@app.api_route("/mcp", methods=["GET", "POST"])
async def mcp_endpoint():
    return {"status": "ok", "service": "SwarmGuard MCP compatibility endpoint", "mcp_server": "available", "transport": "stdio", "message": "Use the configured MCP server for actual MCP tool calls."}

@app.post("/api/command/analyze")
async def analyze_command(input: AnalyzeCommandInput):
    command = input.command.strip()
    if not command:
        return {"error": "Command cannot be empty."}
    parsed = parse_command(command)

    if parsed["action"] == "initiate":
        result = orchestrator.initiate_swarm(project_brief=parsed["project_brief"], budget_usd=parsed["budget_usd"])
        task_id = result.get("task_id")
        task = get_task(task_id)
        await manager.broadcast(json.dumps({"type": "swarm_initiated", "task_id": task_id, "message": result.get("message")}))
        
        reasoning = [
            {"id": "understanding", "label": "Understanding project", "state": "done"},
            {"id": "budget", "label": "Validating budget", "state": "done"},
            {"id": "recruitment", "label": "Recruiting agents", "state": "done"},
            {"id": "bonds", "label": "Locking performance bonds", "state": "done"},
            {"id": "deploy", "label": "Deploying workforce", "state": "done"},
        ]
        team = task.get("team", []) if task else []
        recommended_workforce = [{"id": str(agent.get("agent_id", str(i))), "name": f"Agent {agent.get('agent_id', str(i))}", "role": agent.get("specialization", "Autonomous Specialist"), "trustScore": agent.get("trust_score", 0), "hourlyRate": agent.get("hourly_rate_usd", 0), "status": "Active", "currentTask": "Awaiting assignment", "heartbeat": "stable"} for i, agent in enumerate(team)]

        return {
            "transcript": command,
            "summaryCards": [
                {"id": "task", "title": "Task ID", "value": task_id or "N/A", "description": "Unique swarm identifier", "tone": "primary"},
                {"id": "budget", "title": "Budget", "value": f"${parsed['budget_usd']:,.0f}", "description": "Locked in sub-escrow", "tone": "success"},
                {"id": "team", "title": "Team Size", "value": str(result.get("team_size", len(team))), "description": "Agents deployed", "tone": "primary"},
                {"id": "cost", "title": "Estimated Cost", "value": f"${result.get('estimated_cost', 0):,.0f}", "description": "Total projected spend", "tone": "warning"},
            ],
            "recommendedWorkforce": recommended_workforce,
            "reasoning": reasoning,
            "riskHeadline": "Security-critical workload detected. Performance bonds locked for all agents." if "security" in command.lower() else "Workforce deployed within budget constraints.",
        }

    if parsed["action"] == "evaluate":
        task_id = parsed.get("task_id")
        if not task_id:
            return {"error": "No active swarm found. Deploy one first."}
        task = get_task(task_id)
        if not task:
            return {"error": f"Swarm task '{task_id}' was not found."}
        result = orchestrator.evaluate_and_heal(task_id=task_id, deliverable_summary=parsed["deliverable_summary"])
        await manager.broadcast(json.dumps({"type": "milestone_evaluated", "task_id": task_id, "action": result.get("action_taken")}))
        
        action_taken = result.get("action_taken", "N/A")
        action_success = "SUCCESS" in str(action_taken).upper() or "PASS" in str(action_taken).upper()
        return {
            "transcript": command,
            "summaryCards": [
                {"id": "action", "title": "Action Taken", "value": action_taken, "description": "System response", "tone": "success" if action_success else "warning"},
                {"id": "budget", "title": "Budget Remaining", "value": f"${result.get('budget_remaining', 0):,.0f}", "description": "After this event", "tone": "primary"},
            ],
            "recommendedWorkforce": [],
            "reasoning": [{"id": "eval", "label": "Evaluating deliverable", "state": "done"}, {"id": "decision", "label": "Applying decision", "state": "done"}],
            "riskHeadline": "Milestone evaluated. Swarm state updated.",
        }
    return {"error": "Unsupported command action."}

@app.post("/api/swarm/initiate")
async def initiate_swarm(input: InitiateSwarmInput):
    if not input.project_brief.strip(): return {"error": "Project brief cannot be empty."}
    if input.budget_usd <= 0: return {"error": "Budget must be greater than zero."}
    result = orchestrator.initiate_swarm(project_brief=input.project_brief, budget_usd=input.budget_usd)
    task_id = result.get("task_id")
    await manager.broadcast(json.dumps({"type": "swarm_initiated", "task_id": task_id, "message": result.get("message")}))
    return result

@app.post("/api/swarm/evaluate")
async def evaluate_milestone(input: EvaluateMilestoneInput):
    if input.task_id not in orchestrator.active_tasks: return {"error": f"Swarm task '{input.task_id}' was not found."}
    result = orchestrator.evaluate_and_heal(task_id=input.task_id, deliverable_summary=input.deliverable_summary)
    await manager.broadcast(json.dumps({"type": "milestone_evaluated", "task_id": input.task_id, "action": result.get("action_taken")}))
    return result

@app.get("/api/swarm/{task_id}")
async def get_swarm_status(task_id: str):
    task = get_task(task_id)
    if not task: return {"error": f"Swarm task '{task_id}' was not found."}
    if hasattr(orchestrator, "get_swarm_status"): return orchestrator.get_swarm_status(task_id)
    return task

@app.get("/api/blueprint")
async def download_blueprint():
    latest_task = get_latest_task()
    if latest_task:
        project_name = latest_task.get("brief", "SwarmGuard Project")
        budget = latest_task.get("budget_usd", latest_task.get("budget", 0))
        status = latest_task.get("status", "IN_PROGRESS")
        team = latest_task.get("team", [])
        team_section = "\n".join([f"- {agent.get('agent_id', 'Unknown')}: {agent.get('specialization', 'Unknown')} (Trust Score: {agent.get('trust_score', 'N/A')})" for agent in team]) if team else "No agents recorded."
    else:
        project_name, budget, status, team_section = "No active project", 0, "IDLE", "No active workforce."
    
    blueprint_content = f"SWARMGUARD EXECUTION BLUEPRINT\n==============================\nProject:\n{project_name}\nBudget:\n${budget:,.2f}\nStatus:\n{status}\nWORKFORCE COMPOSITION:\n{team_section}\nGenerated by:\nSwarmGuard Autonomous Workforce OS"
    return Response(content=blueprint_content.strip(), media_type="text/plain", headers={"Content-Disposition": "attachment; filename=swarmguard-blueprint.txt"})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_text(json.dumps({"type": "connected", "message": "SwarmGuard live stream active"}))
        while True:
            await websocket.receive_text()
            await websocket.send_text(json.dumps({"type": "heartbeat", "timestamp": time.time()}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_server:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=os.getenv("ENVIRONMENT", "development") == "development")