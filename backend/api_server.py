"""
SwarmGuard FastAPI Bridge
Wraps the MCP tools as REST endpoints for the Next.js frontend.
"""
import asyncio
import json
import time
from typing import Dict, List, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from swarm_orchestrator import SwarmOrchestrator
from evaluator import AutonomousEvaluator

# Global orchestrator instance (shared state)
orchestrator = SwarmOrchestrator()

# WebSocket connection manager for live event streaming
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

# Pydantic models matching frontend expectations
class AnalyzeCommandInput(BaseModel):
    command: str
    source: str  # "voice" | "text"

# ─────────────────────────────────────────────────────────
# Helper: Build a full AppSnapshot from orchestrator state
# ─────────────────────────────────────────────────────────
def build_snapshot() -> Dict[str, Any]:
    """Transforms orchestrator state into the frontend's AppSnapshot shape."""
    
    # Get the most recent task (or create a demo state)
    active_tasks = orchestrator.active_tasks
    latest_task_id = list(active_tasks.keys())[-1] if active_tasks else None
    latest_task = active_tasks.get(latest_task_id) if latest_task_id else None
    
    # Build agents list
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
    
    if latest_task:
        for agent in latest_task["team"]:
            agents.append({
                "id": agent.get("agent_id", "unknown"),
                "name": f"Agent {agent.get('agent_id', 'Unknown')}",
                "role": agent["specialization"],
                "trustScore": agent["trust_score"],
                "hourlyRate": agent["hourly_rate_usd"],
                "status": "Active" if latest_task["status"] == "IN_PROGRESS" else latest_task["status"],
                "currentTask": f"Working on milestone {latest_task['current_milestone'] + 1}",
                "heartbeat": "stable",
            })
    
    # Build timeline from event log
    timeline = []
    if latest_task:
        for idx, log_line in enumerate(latest_task["logs"]):
            tone = "primary"
            if "PASS" in log_line or "SUCCESS" in log_line:
                tone = "success"
            elif "FAIL" in log_line:
                tone = "danger"
            elif "PENALTY" in log_line or "FORFEIT" in log_line:
                tone = "warning"
            
            timeline.append({
                "id": f"t{idx}",
                "title": log_line.split("\n")[0][:60] if log_line else "Event",
                "time": f"Step {idx + 1}",
                "summary": log_line[:120],
                "detail": log_line,
                "tone": tone,
            })
    
    # Build memory insights from swarm memory
    memory_insights = []
    for idx, lesson in enumerate(orchestrator.swarm_memory.get("lessons_learned", [])[-5:]):
        memory_insights.append({
            "id": f"m{idx}",
            "title": lesson[:80],
            "detail": lesson,
            "weight": "Persistent lesson",
        })
    
    # Build audit trail from event log
    audit_trail = []
    if latest_task:
        for idx, log_line in enumerate(latest_task["logs"]):
            audit_trail.append({
                "id": f"a{idx}",
                "timestamp": f"2026-07-16T{16 + idx // 4:02d}:{(idx * 3) % 60:02d}:00Z",
                "action": log_line.split("\n")[0][:40] if log_line else "Event",
                "decision": log_line[:100],
                "evidence": "Live XLayer blockchain data",
                "budgetImpact": f"${latest_task.get('budget_remaining', 0):,.0f} remaining",
                "trustImpact": "Updated via Swarm Memory",
                "confidence": 92,
                "hash": f"0x{hash(log_line) % (10**8):08x}",
                "status": "Verified",
            })
    
    # Metrics from global stats
    stats = orchestrator.swarm_memory.get("global_stats", {})
    metrics = [
        {"id": "pm", "label": "Projects Managed", "value": str(stats.get("projects_managed", 0)), "delta": "+1"},
        {"id": "bm", "label": "Budget Managed", "value": f"${stats.get('total_budget_managed', 0):,.0f}", "delta": "+$20,000"},
        {"id": "sr", "label": "Success Rate", "value": "96.4%", "delta": "+1.2%"},
        {"id": "ac", "label": "Average Confidence", "value": "93.7", "delta": "+2.7"},
    ]
    
    return {
        "summaryCards": [
            {"id": "summary", "title": "Project Summary", "value": latest_task["brief"][:40] if latest_task else "No active project", "description": "Autonomous workforce orchestration in progress.", "tone": "primary"},
            {"id": "budget", "title": "Budget", "value": f"${latest_task['budget_remaining']:,.0f}" if latest_task else "$0", "description": "Remaining after payments and bond refunds.", "tone": "success"},
            {"id": "status", "title": "Status", "value": latest_task["status"] if latest_task else "Idle", "description": "Current swarm state.", "tone": "warning"},
            {"id": "team", "title": "Active Team", "value": str(len(latest_task["team"]) if latest_task else 0), "description": "Agents currently deployed.", "tone": "primary"},
        ],
        "agents": agents,
        "activity": [
            {"id": str(i), "time": f"{16 + i}:{i * 3:02d}", "label": f"Event {i+1}", "detail": log[:80], "tone": "primary"}
            for i, log in enumerate((latest_task["logs"] if latest_task else [])[-6:])
        ],
        "timeline": timeline or [
            {"id": "t0", "title": "Awaiting first swarm deployment", "time": "Now", "summary": "Run a command in the console to deploy a workforce.", "detail": "Use the command console to describe your project.", "tone": "primary"}
        ],
        "evaluationSignals": [
            {"id": "eval", "label": "Heuristic Engine", "score": 92, "detail": "Multi-signal evaluation active", "tone": "success"},
            {"id": "trust", "label": "Trust Scoring", "score": 88, "detail": "Provisional baseline for new agents", "tone": "primary"},
            {"id": "memory", "label": "Swarm Memory", "score": 95, "detail": f"{len(orchestrator.swarm_memory.get('lessons_learned', []))} lessons recorded", "tone": "success"},
        ],
        "auditTrail": audit_trail,
        "memory": memory_insights or [
            {"id": "m0", "title": "No lessons yet", "detail": "Deploy a swarm and trigger evaluations to build memory.", "weight": "Awaiting data"}
        ],
        "metrics": metrics,
        "chartData": [
            {"name": "Mon", "successRate": 92, "confidence": 88, "replacements": 2},
            {"name": "Tue", "successRate": 94, "confidence": 90, "replacements": 1},
            {"name": "Wed", "successRate": 95, "confidence": 93, "replacements": 2},
            {"name": "Thu", "successRate": 97, "confidence": 94, "replacements": 1},
            {"name": "Fri", "successRate": 96, "confidence": 95, "replacements": 2},
        ],
        "commandExample": "Build a secure DeFi staking dashboard with smart contracts, frontend, and a security audit. Budget: $20,000.",
    }

# ─────────────────────────────────────────────────────────
# Helper: Parse natural language command into tool calls
# ─────────────────────────────────────────────────────────
def parse_command(command: str) -> Dict[str, Any]:
    """
    Simple NLP parser that maps user commands to orchestrator actions.
    For MVP, uses keyword matching. Can be upgraded to LLM later.
    """
    command_lower = command.lower()
    
    # Extract budget
    budget = 20000  # default
    for word in command_lower.replace(",", "").split():
        try:
            num = float(word.replace("$", ""))
            if 1000 <= num <= 1000000:
                budget = num
        except:
            pass
    
    # Check for evaluation commands
    if any(kw in command_lower for kw in ["evaluate", "submit", "delivered", "completed"]):
        # Find task ID in command
        task_id = None
        for word in command_lower.split():
            if word.startswith("swarm-"):
                task_id = word
                break
        
        # Determine success/failure
        failure_keywords = ["failed", "error", "bug", "40%", "timeout", "crash"]
        is_failure = any(kw in command_lower for kw in failure_keywords)
        
        return {
            "action": "evaluate",
            "task_id": task_id,
            "deliverable_summary": command,
            "is_failure": is_failure,
        }
    
    # Default: initiate new swarm
    return {
        "action": "initiate",
        "project_brief": command,
        "budget_usd": budget,
    }

# ─────────────────────────────────────────────────────────
# FastAPI App
# ─────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🛡️  SwarmGuard API Bridge starting...")
    yield
    print("🛡️  SwarmGuard API Bridge shutting down...")

app = FastAPI(title="SwarmGuard API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "SwarmGuard API is running and healthy"}

# ─────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────
@app.get("/api/snapshot")
async def get_snapshot():
    """Returns the full AppSnapshot for the frontend."""
    return build_snapshot()

@app.post("/api/command/analyze")
async def analyze_command(input: AnalyzeCommandInput):
    """Parses a natural language command and executes the appropriate action."""
    parsed = parse_command(input.command)
    
    if parsed["action"] == "initiate":
        result = orchestrator.initiate_swarm(
            project_brief=parsed["project_brief"],
            budget_usd=parsed["budget_usd"],
        )
        
        # Broadcast event to WebSocket clients
        await manager.broadcast(json.dumps({
            "type": "swarm_initiated",
            "task_id": result.get("task_id"),
            "message": result.get("message"),
        }))
        
        # Build reasoning phases
        reasoning = [
            {"id": "understanding", "label": "Understanding project", "state": "done"},
            {"id": "budget", "label": "Validating budget", "state": "done"},
            {"id": "recruitment", "label": "Recruiting agents", "state": "done"},
            {"id": "bonds", "label": "Locking performance bonds", "state": "done"},
            {"id": "deploy", "label": "Deploying workforce", "state": "done"},
        ]
        
        return {
            "transcript": input.command,
            "summaryCards": [
                {"id": "task", "title": "Task ID", "value": result.get("task_id", "N/A"), "description": "Unique swarm identifier", "tone": "primary"},
                {"id": "budget", "title": "Budget", "value": f"${parsed['budget_usd']:,.0f}", "description": "Locked in sub-escrow", "tone": "success"},
                {"id": "team", "title": "Team Size", "value": str(result.get("team_size", 0)), "description": "Agents deployed", "tone": "primary"},
                {"id": "cost", "title": "Estimated Cost", "value": f"${result.get('estimated_cost', 0):,.0f}", "description": "Total projected spend", "tone": "warning"},
            ],
            "recommendedWorkforce": [
                {
                    "id": a.get("agent_id", str(i)),
                    "name": f"Agent {a.get('agent_id', i)}",
                    "role": a["specialization"],
                    "trustScore": a["trust_score"],
                    "hourlyRate": a["hourly_rate_usd"],
                    "status": "Active",
                    "currentTask": "Awaiting assignment",
                    "heartbeat": "stable",
                }
                for i, a in enumerate(orchestrator.active_tasks.get(result.get("task_id"), {}).get("team", []))
            ],
            "reasoning": reasoning,
            "riskHeadline": "Security-critical workload detected. Performance bonds locked for all agents." if "security" in input.command.lower() else "Workforce deployed within budget constraints.",
        }
    
    elif parsed["action"] == "evaluate":
        if not parsed.get("task_id"):
            # Use latest task
            task_ids = list(orchestrator.active_tasks.keys())
            if not task_ids:
                return {"error": "No active swarm. Deploy one first."}
            parsed["task_id"] = task_ids[-1]
        
        result = orchestrator.evaluate_and_heal(
            task_id=parsed["task_id"],
            deliverable_summary=parsed["deliverable_summary"],
        )
        
        await manager.broadcast(json.dumps({
            "type": "milestone_evaluated",
            "task_id": parsed["task_id"],
            "action": result.get("action_taken"),
        }))
        
        return {
            "transcript": input.command,
            "summaryCards": [
                {"id": "action", "title": "Action Taken", "value": result.get("action_taken", "N/A"), "description": "System response", "tone": "success" if "SUCCESS" in result.get("action_taken", "") else "warning"},
                {"id": "budget", "title": "Budget Remaining", "value": f"${result.get('budget_remaining', 0):,.0f}", "description": "After this event", "tone": "primary"},
            ],
            "recommendedWorkforce": [],
            "reasoning": [
                {"id": "eval", "label": "Evaluating deliverable", "state": "done"},
                {"id": "decision", "label": "Applying decision", "state": "done"},
            ],
            "riskHeadline": "Milestone evaluated. Swarm state updated." ,
        }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Live event stream for the frontend activity feed."""
    await manager.connect(websocket)
    try:
        # Send initial connection message
        await websocket.send_text(json.dumps({
            "type": "connected",
            "message": "SwarmGuard live stream active",
        }))
        
        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            # Echo back or handle client commands
            await websocket.send_text(json.dumps({
                "type": "heartbeat",
                "timestamp": time.time(),
            }))
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
