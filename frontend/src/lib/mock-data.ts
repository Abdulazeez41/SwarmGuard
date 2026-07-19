import {
  ActivityItem,
  AgentNode,
  AppSnapshot,
  AuditRecord,
  ChartPoint,
  CommandAnalysisResponse,
  CommandPhase,
  EvaluationSignal,
  MemoryInsight,
  MetricCard,
  ProjectSummaryCard,
  TimelineEvent,
} from "@/lib/types";

export const commandExample =
  "Build me a secure DeFi staking dashboard with smart contracts, frontend and security audit. Budget twenty thousand dollars.";

export const reasoningPhases: CommandPhase[] = [
  {
    id: "understanding",
    label: "Parsing natural language brief",
    state: "done",
  },
  {
    id: "complexity",
    label: "Calculating technical complexity",
    state: "done",
  },
  { id: "budget", label: "Validating $20,000 budget envelope", state: "done" },
  { id: "risk", label: "Assessing DeFi security risk profile", state: "done" },
  {
    id: "recruitment",
    label: "Scouting optimal agent candidates",
    state: "done",
  },
  {
    id: "bonds",
    label: "Locking performance bonds in sub-escrow",
    state: "done",
  },
  {
    id: "deployment",
    label: "Deploying autonomous workforce",
    state: "active",
  },
  {
    id: "monitoring",
    label: "Initializing live evaluation streams",
    state: "pending",
  },
];

export const summaryCards: ProjectSummaryCard[] = [
  {
    id: "summary",
    title: "Project Summary",
    value: "DeFi Staking Launchpad",
    description:
      "End-to-end staking protocol with wallet integration, yield tracking, and adversarial security auditing.",
    tone: "primary",
  },
  {
    id: "budget",
    title: "Budget Envelope",
    value: "$20,000",
    description:
      "9% ($1,800) reserved in contingency for autonomous self-healing and agent replacement.",
    tone: "success",
  },
  {
    id: "timeline",
    title: "Estimated Timeline",
    value: "18 Days",
    description:
      "3 core milestones: Contract Dev, Frontend Integration, Security Audit & Deployment.",
    tone: "warning",
  },
  {
    id: "risk",
    title: "Risk Profile",
    value: "High (DeFi)",
    description:
      "Smart contract vulnerability risk mitigated by mandatory dual-audit and strict bond requirements.",
    tone: "danger",
  },
];

export const agents: AgentNode[] = [
  {
    id: "project",
    name: "SwarmGuard Core",
    role: "Project Orchestrator",
    trustScore: 99,
    hourlyRate: 0,
    status: "Active",
    currentTask: "Monitoring milestone progression",
    heartbeat: "stable",
  },
  {
    id: "agent-5993",
    name: "Nexus-7",
    role: "Smart Contract Engineer",
    trustScore: 96,
    hourlyRate: 190,
    status: "Active",
    currentTask: "Compiling staking contracts (v1.2)",
    heartbeat: "stable",
  },
  {
    id: "agent-6014",
    name: "Aria-3",
    role: "Frontend Engineer",
    trustScore: 94,
    hourlyRate: 165,
    status: "Active",
    currentTask: "Building wallet onboarding UI",
    heartbeat: "stable",
  },
  {
    id: "agent-5889",
    name: "Sentinel-5",
    role: "Security Auditor",
    trustScore: 72,
    hourlyRate: 220,
    status: "Replaced",
    currentTask: "Terminated: Missed reentrancy vulnerability",
    heartbeat: "critical",
  },
  {
    id: "agent-6201",
    name: "Sentinel-9",
    role: "Senior Security Auditor",
    trustScore: 98,
    hourlyRate: 250,
    status: "Active",
    currentTask: "Running formal verification on staking logic",
    heartbeat: "stable",
  },
];

export const activity: ActivityItem[] = [
  {
    id: "1",
    time: "16:04",
    label: "Swarm Initialized",
    detail:
      "Budget locked: $20,000 USDT in sub-escrow. Contingency reserve active.",
    tone: "primary",
  },
  {
    id: "2",
    time: "16:07",
    label: "Agent Nexus-7 Hired",
    detail: "Smart Contract Engineer deployed. 5 OKB performance bond locked.",
    tone: "success",
  },
  {
    id: "3",
    time: "16:10",
    label: "Agent Aria-3 Hired",
    detail: "Frontend Engineer deployed. 3 OKB performance bond locked.",
    tone: "success",
  },
  {
    id: "4",
    time: "16:15",
    label: "Code Pushed: Staking Contract v1",
    detail:
      "Nexus-7 submitted initial logic. Gas optimization pass reduced execution cost by 12%.",
    tone: "success",
  },
  {
    id: "5",
    time: "16:22",
    label: "⚠️ Audit Failure Detected",
    detail:
      "Sentinel-5 failed to identify a reentrancy vulnerability in the reward distribution function.",
    tone: "danger",
  },
  {
    id: "6",
    time: "16:25",
    label: "🔄 Self-Healing Triggered",
    detail:
      "Sentinel-5 performance bond partially seized. Agent terminated. Scouting for replacement.",
    tone: "warning",
  },
  {
    id: "7",
    time: "16:40",
    label: "Agent Sentinel-9 Hired",
    detail:
      "Senior Security Auditor deployed. 6 OKB performance bond locked. Inheriting task context.",
    tone: "success",
  },
  {
    id: "8",
    time: "17:05",
    label: "Vulnerability Resolved",
    detail:
      "Sentinel-9 identified and patched reentrancy risk. Formal verification passed.",
    tone: "success",
  },
];

export const timeline: TimelineEvent[] = [
  {
    id: "t1", // FIXED: was "is" typo
    title: "Project Brief Parsed & Budget Locked",
    time: "Day 01 · 09:10",
    summary:
      "SwarmGuard derived requirements and locked the $20,000 operating envelope.",
    detail:
      "Risk multipliers applied due to DeFi context. 9% contingency reserve isolated for autonomous self-healing.",
    tone: "primary",
  },
  {
    id: "t2",
    title: "Workforce Recruited & Bonds Locked",
    time: "Day 01 · 09:15",
    summary:
      "Nexus-7 (Contracts) and Aria-3 (Frontend) deployed with performance bonds.",
    detail:
      "Bonds sized dynamically based on agent trust scores and the criticality of their assigned workstreams.",
    tone: "success",
  },
  {
    id: "t3",
    title: "Milestone 1: Contract Development",
    time: "Day 04 · 14:20",
    summary: "Core staking logic compiled and pushed to staging.",
    detail:
      "Automated gas profiling confirmed optimizations. Handoff to frontend and audit lanes initiated.",
    tone: "success",
  },
  {
    id: "t4",
    title: "Self-Healing Event: Auditor Replacement",
    time: "Day 06 · 11:30",
    summary: "Initial security audit failed to meet confidence thresholds.",
    detail:
      "SwarmGuard autonomously seized 40% of Sentinel-5's bond, terminated the agent, and recruited Sentinel-9 (Senior Auditor) to inherit the context and complete the review.",
    tone: "danger",
  },
  {
    id: "t5",
    title: "Milestone 2: Security Clearance & Payment",
    time: "Day 08 · 16:00",
    summary: "Formal verification passed. Milestone payments released.",
    detail:
      "Confidence score exceeded 95%. $6,200 released to active agents. Swarm memory updated with new vulnerability patterns.",
    tone: "success",
  },
];

export const evaluationSignals: EvaluationSignal[] = [
  {
    id: "build",
    label: "Build Success",
    score: 100,
    detail:
      "All Solidity and React artifacts compiled cleanly. Zero TypeScript errors.",
    tone: "success",
  },
  {
    id: "coverage",
    label: "Test Coverage",
    score: 94,
    detail:
      "Critical staking flows exceed 90% coverage. Adversarial wallet edge cases included.",
    tone: "primary",
  },
  {
    id: "security",
    label: "Security Audit",
    score: 96,
    detail:
      "Reentrancy vulnerability patched by Sentinel-9. Formal verification passed.",
    tone: "success",
  },
];

export const memory: MemoryInsight[] = [
  {
    id: "m1",
    title: "Reentrancy patterns in reward distribution",
    detail:
      "Swarm memory flagged a specific vulnerability pattern missed by junior auditors. Future DeFi projects will auto-assign Senior Auditors (Trust Score > 95) to reward logic.",
    weight: "+15% weight to Senior Auditors",
  },
  {
    id: "m2",
    title: "Sentinel-5 performance degradation",
    detail:
      "Agent 5889 failed 2 consecutive security reviews. Downgraded in the global talent pool. Bond seizure logic validated.",
    weight: "Agent trust score reduced to 72",
  },
];

export const auditTrail: AuditRecord[] = [
  {
    id: "a1",
    timestamp: "2026-07-16T16:04:00Z",
    action: "Budget Validation & Lock",
    decision: "Approved $20,000 reserve",
    evidence:
      "Complexity model 0.78, DeFi risk multiplier 1.15, 9% replacement reserve.",
    budgetImpact: "+$20,000 locked",
    trustImpact: "None",
    confidence: 98,
    hash: "0x3c8d11af4e2b9a7c6d5e8f1a2b3c4d5e6f7a8b9c",
    status: "Verified",
  },
  {
    id: "a2",
    timestamp: "2026-07-16T16:25:00Z",
    action: "Autonomous Self-Healing Triggered",
    decision: "Terminated Agent 5889 (Sentinel-5)",
    evidence:
      "Anomaly score 0.73. Failed to flag reentrancy in reward distribution. Confidence dropped below 70% threshold.",
    budgetImpact: "+$880 recovered (40% bond seizure)",
    trustImpact: "-24 on Agent 5889",
    confidence: 65,
    hash: "0x8fe192ce7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    status: "Escalated",
  },
  {
    id: "a3",
    timestamp: "2026-07-16T17:05:00Z",
    action: "Milestone 1 Payment Released",
    decision: "Disbursed $6,200 to Nexus-7 and Aria-3",
    evidence:
      "Confidence 96. Build pass, coverage pass, security audit pass. No unresolved blockers.",
    budgetImpact: "-$6,200 released",
    trustImpact: "+5 to Nexus-7, +3 to Aria-3",
    confidence: 96,
    hash: "0x712dbb7e3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
    status: "Released",
  },
];

export const metrics: MetricCard[] = [
  { id: "pm", label: "Projects Managed", value: "1,284", delta: "+12.4%" },
  { id: "bm", label: "Budget Managed", value: "$38.2M", delta: "+8.1%" },
  { id: "sr", label: "Success Rate", value: "96.4%", delta: "+1.2%" },
  { id: "ac", label: "Average Confidence", value: "93.7", delta: "+2.7" },
];

export const chartData: ChartPoint[] = [
  { name: "Mon", successRate: 92, confidence: 88, replacements: 2 },
  { name: "Tue", successRate: 94, confidence: 90, replacements: 1 },
  { name: "Wed", successRate: 85, confidence: 65, replacements: 4 },
  { name: "Thu", successRate: 97, confidence: 96, replacements: 0 },
  { name: "Fri", successRate: 98, confidence: 97, replacements: 0 },
];

export const appSnapshot: AppSnapshot = {
  summaryCards,
  agents,
  activity,
  timeline,
  evaluationSignals,
  auditTrail,
  memory,
  metrics,
  chartData,
  commandExample,
};

export const commandAnalysisResponse: CommandAnalysisResponse = {
  transcript: commandExample,
  summaryCards,
  recommendedWorkforce: agents.filter(
    (agent) =>
      agent.role !== "Project Orchestrator" && agent.status !== "Replaced",
  ),
  reasoning: reasoningPhases,
  riskHeadline:
    "Security-critical DeFi workload detected. Mandatory dual-audit and strict performance bonds applied.",
};
