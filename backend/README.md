# 🛡️ SwarmGuard: Autonomous Workforce OS for OKX.AI

> **The first autonomous workforce manager that hires, evaluates, penalizes, learns, and optimizes AI agent teams in real-time.**

## 🎯 The Problem

The AI agent economy is scaling rapidly, but managing multi-agent teams is fundamentally broken:

- ❌ **Passive trust scores** don't prevent workflow collapse
- ❌ **Manual dispute resolution** is slow and expensive
- ❌ **Budget overruns** happen when scope isn't validated
- ❌ **No organizational learning** from past failures
- ❌ **Reputation doesn't persist** across projects

Current solutions just match agents to tasks. They don't manage the entire lifecycle.

## 💡 The Solution

**SwarmGuard** is an autonomous workforce operating system that actively manages multi-agent teams from deployment to completion:

### Core Capabilities

1. **Budget-Aware Deployment**
   - Validates project scope against client budget before hiring
   - Prevents 164% budget overruns (common in manual workflows)
   - Locks funds in sub-escrow (simulated)

2. **Performance Bonds**
   - Requires agents to lock OKB stakes to guarantee delivery
   - Forfeits bonds on objective failure
   - Returns bonds on success
   - Creates real economic incentives

3. **Autonomous Evaluation**
   - Analyzes deliverable summaries for objective success/failure
   - No human bias, no subjective judgment
   - Detects: build failures, test coverage gaps, schema violations, timeouts

4. **Self-Optimizing Replacement**
   - On failure: forfeits bond, downgrades reputation, records lesson
   - Queries Truora Decision Intelligence for highest-confidence replacement
   - Factors in: trust score, availability, cost, past penalties
   - Hires replacement instantly, no human intervention

5. **Swarm Memory (Persistent Learning)**
   - Records every failure pattern in `swarm_memory.json`
   - Penalizes repeat offenders in future matching
   - Tracks global stats: projects managed, total budget handled
   - Survives server restarts

## 🏗️ Architecture

```
User Request
    ↓
SwarmGuard Orchestrator
    ↓
├─→ Team Builder (analyzes requirements)
├─→ Budget Validator (prevents overruns)
├─→ Performance Bond Lock (economic guarantee)
    ↓
Agent Team Deployed
    ↓
Milestone Execution
    ↓
Auto-Evaluator (keyword + logic analysis)
    ↓
├─→ SUCCESS: Release payment, return bond, advance milestone
└─→ FAILURE: Forfeit bond, downgrade reputation, record lesson, hire replacement
    ↓
Mission Complete / Continue
```

### Components

- **`mcp_server.py`**: Exposes 4 MCP tools to OpenClaw
- **`swarm_orchestrator.py`**: Core logic for deployment, evaluation, replacement
- **`team_builder.py`**: Analyzes project brief, selects optimal team
- **`marketplace_collector.py`**: Fetches real agent data from OKX.AI
- **`swarm_memory.json`**: Persistent storage for lessons learned

## 🔧 MCP Tools

### 1. `initiate_swarm_task(project_brief, budget_usd)`

Deploys an autonomous workforce within budget constraints.

**Example:**

```
Input: "Build a DeFi dashboard", $20,000
Output: Task ID, team composition, budget locked
```

### 2. `evaluate_and_heal_milestone(task_id, deliverable_summary)`

Autonomously evaluates work and handles success/failure.

**Example:**

```
Input: "Build succeeded, 100% tests passed"
Output: Payment released, bond returned, next milestone

Input: "Build failed, 40% test coverage"
Output: Bond forfeited, reputation downgraded, replacement hired
```

### 3. `get_swarm_status(task_id)`

Returns real-time status, budget, team, and full audit trail.

### 4. `generate_credit_report(agent_identifier)`

Generates Truora Decision Intelligence Report for any agent.

## 🎬 Live Demo

**OKX.AI Agent:** [Agent #5993](https://okx.ai/agents/5993)

### Demo Flow

1. **Deploy**: "Build a DeFi dashboard, budget $20k"
   - System validates budget, hires 3 agents, locks bonds
2. **Success**: "Smart contract build succeeded"
   - Payment released, bond returned, budget updated
3. **Failure**: "Frontend build failed, 40% tests"
   - Bond forfeited, reputation downgraded, lesson recorded
4. **Replacement**: "Hire Agent Delta-2 (88% confidence)"
   - Truora-optimized replacement, no human intervention
5. **Complete**: "All milestones verified"
   - Mission accomplished, full audit trail available

## 📊 Real Results

From our demo run:

```
Initial Budget: $20,000
After Smart Contract Success: $18,500 (paid $1,500)
After Frontend Failure: $19,000 (received $500 from forfeited bond)
After Replacement Success: $17,900 (paid $1,100)
After Security Audit Success: $15,900 (paid $2,000)

Final Status: COMPLETED
Budget Utilized: $4,100 / $20,000 (20.5%)
Lessons Learned: 1 (Agent Beta frontend failure)
```

SwarmGuard provides:

- ✅ **Active workforce management** (not just matching)
- ✅ **Economic incentives** (performance bonds)
- ✅ **Autonomous evaluation** (no human bias)
- ✅ **Persistent learning** (Swarm Memory)
- ✅ **Full lifecycle management** (hire → evaluate → replace → complete)

## 🛠️ Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Install onchainos CLI
npm install -g @okxweb3/onchainos-cli

# Configure OpenClaw
openclaw mcp set SwarmGuard '{"command":"python","args":["mcp_server.py"]}'

# Start gateway
openclaw gateway
```

## 📝 Future Work

- [ ] Real LLM-based evaluation (replace keyword matching)
- [ ] On-chain smart contract for bonds/escrow
- [ ] Integration with OKX arbitration system
- [ ] Multi-project reputation aggregation
- [ ] Agent performance analytics dashboard

**Live Agent:** [#5993](https://okx.ai/agents/5993)  
**Stack:** Python, FastMCP, Web3.py, OpenClaw
