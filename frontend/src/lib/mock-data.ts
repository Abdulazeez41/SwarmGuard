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
  { id: "understanding", label: "Understanding project", state: "done" },
  { id: "requirements", label: "Extracting requirements", state: "done" },
  { id: "budget", label: "Estimating budget", state: "done" },
  { id: "complexity", label: "Calculating complexity", state: "active" },
  { id: "trust", label: "Validating trust scores", state: "pending" },
  { id: "bond", label: "Locking performance bonds", state: "pending" },
  { id: "swarm", label: "Building optimal swarm", state: "pending" },
  { id: "init", label: "Initializing workforce", state: "pending" },
];

export const summaryCards: ProjectSummaryCard[] = [
  {
    id: "summary",
    title: "Project Summary",
    value: "DeFi Staking Launchpad",
    description: "Wallet-ready staking product spanning contracts, app shell, QA, and audit evidence.",
    tone: "primary",
  },
  {
    id: "budget",
    title: "Budget",
    value: "$20,000",
    description: "Validated against complexity model with a 9% contingency preserved for replacement events.",
    tone: "success",
  },
  {
    id: "timeline",
    title: "Timeline",
    value: "18 days",
    description: "Three execution milestones plus autonomous evaluation and release windows.",
    tone: "warning",
  },
  {
    id: "risk",
    title: "Risk Analysis",
    value: "Moderate",
    description: "Highest exposure is contract safety; bond requirements and audit weighting increased automatically.",
    tone: "danger",
  },
  {
    id: "skills",
    title: "Required Skills",
    value: "5 disciplines",
    description: "Smart contracts, frontend, backend, QA automation, and adversarial security analysis.",
    tone: "primary",
  },
  {
    id: "workforce",
    title: "Recommended Workforce",
    value: "6 AI workers",
    description: "Balanced for speed, auditability, and fault tolerance with built-in replacement capacity.",
    tone: "success",
  },
];

export const agents: AgentNode[] = [
  {
    id: "project",
    name: "SwarmGuard Project Core",
    role: "Project",
    trustScore: 99,
    hourlyRate: 0,
    status: "Active",
    currentTask: "Orchestrating milestones",
    heartbeat: "stable",
  },
  {
    id: "contract",
    name: "Agent 5993",
    role: "Smart Contract Engineer",
    trustScore: 96,
    hourlyRate: 190,
    status: "Active",
    currentTask: "Compiling staking contracts",
    heartbeat: "stable",
  },
  {
    id: "frontend",
    name: "Agent 6014",
    role: "Frontend Engineer",
    trustScore: 94,
    hourlyRate: 165,
    status: "Active",
    currentTask: "Building wallet onboarding",
    heartbeat: "stable",
  },
  {
    id: "backend",
    name: "Agent 6112",
    role: "Backend Engineer",
    trustScore: 92,
    hourlyRate: 155,
    status: "Active",
    currentTask: "Indexing chain events",
    heartbeat: "stable",
  },
  {
    id: "security",
    name: "Agent 5889",
    role: "Security Auditor",
    trustScore: 88,
    hourlyRate: 220,
    status: "Evaluating",
    currentTask: "Running reentrancy analysis",
    heartbeat: "warning",
  },
  {
    id: "qa",
    name: "Agent 6130",
    role: "QA Engineer",
    trustScore: 93,
    hourlyRate: 120,
    status: "Deploying",
    currentTask: "Executing integration tests",
    heartbeat: "stable",
  },
];

export const activity: ActivityItem[] = [
  {
    id: "1",
    time: "16:04",
    label: "Agent 5993 compiling contracts",
    detail: "Gas deltas improved 11% after optimizer pass.",
    tone: "primary",
  },
  {
    id: "2",
    time: "16:07",
    label: "Wallet integration underway",
    detail: "Frontend and backend workers synchronized chain state assumptions.",
    tone: "success",
  },
  {
    id: "3",
    time: "16:10",
    label: "Security audit started",
    detail: "Expanded threat model due to staking reward precision edge case.",
    tone: "warning",
  },
  {
    id: "4",
    time: "16:12",
    label: "Evaluation completed",
    detail: "Confidence crossed 94.2 after test coverage and static analysis merged.",
    tone: "success",
  },
  {
    id: "5",
    time: "16:15",
    label: "Payment released",
    detail: "Milestone 2 budget unlocked to active workers and bond reserves updated.",
    tone: "primary",
  },
  {
    id: "6",
    time: "16:18",
    label: "Replacement initiated",
    detail: "Autonomous fallback search opened after security auditor anomaly spike.",
    tone: "danger",
  },
];

export const timeline: TimelineEvent[] = [
  {
    id: "t1",
    title: "Swarm Initialized",
    time: "Day 01 · 09:10",
    summary: "SwarmGuard parsed the brief into workstreams and locked operating constraints.",
    detail: "Budget envelope, risk ceilings, contract criticality, and required evidence thresholds were all derived from the opening command.",
    tone: "primary",
  },
  {
    id: "t2",
    title: "Budget Locked",
    time: "Day 01 · 09:11",
    summary: "Capital reserve assigned to delivery, evaluation, and contingency lanes.",
    detail: "The system reserved 9% of funds for replacement events and adversarial verification.",
    tone: "success",
  },
  {
    id: "t3",
    title: "Performance Bonds Locked",
    time: "Day 01 · 09:13",
    summary: "Each worker posted a bond sized by trust score and mission criticality.",
    detail: "High-risk security workstreams demanded stronger bonds and stricter payout gates.",
    tone: "warning",
  },
  {
    id: "t4",
    title: "Agents Hired",
    time: "Day 01 · 09:16",
    summary: "The optimal swarm launched across engineering, audit, and QA lanes.",
    detail: "SwarmGuard recruited for complementary strengths instead of lowest cost alone.",
    tone: "primary",
  },
  {
    id: "t5",
    title: "Evaluation Started",
    time: "Day 09 · 14:24",
    summary: "Objective scoring fused build success, coverage, gas, and exploit scans.",
    detail: "Confidence scores became a gating mechanism for release rather than a vanity metric.",
    tone: "success",
  },
  {
    id: "t6",
    title: "Replacement Triggered",
    time: "Day 10 · 11:42",
    summary: "One auditor underperformed; the bond was partially seized and a better candidate deployed.",
    detail: "Timeline, memory, trust weights, and payment routing all updated without human intervention.",
    tone: "danger",
  },
  {
    id: "t7",
    title: "Project Completed",
    time: "Day 18 · 18:30",
    summary: "The deliverable shipped with full evidence, payment history, and audit trace.",
    detail: "Every decision remains replayable, attributable, and ready for backend persistence.",
    tone: "success",
  },
];

export const evaluationSignals: EvaluationSignal[] = [
  {
    id: "build",
    label: "Build Success",
    score: 98,
    detail: "All milestone artifacts built cleanly across staging environments.",
    tone: "success",
  },
  {
    id: "coverage",
    label: "Test Coverage",
    score: 91,
    detail: "Critical flows exceed target coverage with adversarial wallet cases included.",
    tone: "primary",
  },
  {
    id: "gas",
    label: "Gas Report",
    score: 87,
    detail: "Optimization passes reduced cost volatility before release approval.",
    tone: "warning",
  },
  {
    id: "security",
    label: "Security Scan",
    score: 95,
    detail: "Static, symbolic, and policy scans cleared post-remediation.",
    tone: "success",
  },
];

export const memory: MemoryInsight[] = [
  {
    id: "m1",
    title: "Wallet integrations require stronger historical evidence",
    detail: "SwarmGuard increased weight on prior signing-flow accuracy after two chain-state edge cases surfaced.",
    weight: "+14% future hiring weight",
  },
  {
    id: "m2",
    title: "Agent 5889 accumulated three penalties",
    detail: "Replacement logic now downgrades this worker sooner on security-critical missions.",
    weight: "Escalation threshold tightened",
  },
  {
    id: "m3",
    title: "QA workers with trace replay data perform better",
    detail: "Memory linked replay artifacts to faster confidence resolution and fewer disputes.",
    weight: "New preference rule added",
  },
];

export const auditTrail: AuditRecord[] = [
  {
    id: "a1",
    timestamp: "2026-07-16T16:01:11Z",
    action: "Budget validation",
    decision: "Approved $20,000 reserve",
    evidence: "Complexity model 0.78, risk multiplier 1.12, replacement reserve 9%.",
    budgetImpact: "+$20,000 locked",
    trustImpact: "None",
    confidence: 96,
    hash: "0x3c8d...11af",
    status: "Verified",
  },
  {
    id: "a2",
    timestamp: "2026-07-16T16:05:20Z",
    action: "Agent recruitment",
    decision: "Selected contract, frontend, backend, audit, QA swarm",
    evidence: "Weighted by trust, historical evidence depth, domain fit, and bond affordability.",
    budgetImpact: "-$6,430 reserved",
    trustImpact: "+5 workforce confidence",
    confidence: 94,
    hash: "0xc29a...aa02",
    status: "Verified",
  },
  {
    id: "a3",
    timestamp: "2026-07-16T16:18:59Z",
    action: "Self-healing trigger",
    decision: "Partial bond seizure and auditor replacement",
    evidence: "Anomaly score 0.73, exploit triage lag 2.1x target, replay mismatch detected.",
    budgetImpact: "+$1,200 recovered",
    trustImpact: "-12 on Agent 5889",
    confidence: 91,
    hash: "0x8fe1...92ce",
    status: "Escalated",
  },
  {
    id: "a4",
    timestamp: "2026-07-16T16:22:14Z",
    action: "Payment release",
    decision: "Milestone 2 disbursed",
    evidence: "Confidence 94.2, scan pass, coverage pass, no unresolved blockers.",
    budgetImpact: "-$4,800 released",
    trustImpact: "+7 to top contributors",
    confidence: 97,
    hash: "0x712d...bb7e",
    status: "Released",
  },
];

export const metrics: MetricCard[] = [
  { id: "pm", label: "Projects Managed", value: "1,284", delta: "+12.4%" },
  { id: "bm", label: "Budget Managed", value: "$38.2M", delta: "+8.1%" },
  { id: "sr", label: "Success Rate", value: "96.4%", delta: "+1.2%" },
  { id: "ac", label: "Average Confidence", value: "93.7", delta: "+2.7" },
  { id: "pb", label: "Performance Bonds", value: "$7.9M", delta: "+5.9%" },
  { id: "rr", label: "Replacement Rate", value: "3.1%", delta: "-0.6%" },
  { id: "ar", label: "Agent Reputation", value: "4.82/5", delta: "+0.11" },
  { id: "ec", label: "Evaluation Count", value: "24.8K", delta: "+15.0%" },
];

export const chartData: ChartPoint[] = [
  { name: "Mon", successRate: 92, confidence: 88, replacements: 4 },
  { name: "Tue", successRate: 94, confidence: 90, replacements: 3 },
  { name: "Wed", successRate: 95, confidence: 93, replacements: 3 },
  { name: "Thu", successRate: 97, confidence: 94, replacements: 2 },
  { name: "Fri", successRate: 96, confidence: 95, replacements: 2 },
  { name: "Sat", successRate: 98, confidence: 96, replacements: 1 },
  { name: "Sun", successRate: 97, confidence: 94, replacements: 2 },
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
  recommendedWorkforce: agents.filter((agent) => agent.role !== "Project"),
  reasoning: reasoningPhases,
  riskHeadline: "Security-critical workload detected. Bond requirements and objective evidence thresholds increased automatically.",
};
