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
  ProjectPackage,
  ProjectSummaryCard,
  TimelineEvent,
  ExecutionSummaryData,
} from "@/lib/types";

export const commandExample =
  "Build me a secure DeFi staking dashboard with smart contracts, frontend and security audit. Budget twenty thousand dollars.";

export const reasoningPhases: CommandPhase[] = [
  {
    id: "understanding",
    label: "Understanding your project",
    state: "done",
  },
  {
    id: "complexity",
    label: "Calculating complexity",
    state: "done",
  },
  { id: "budget", label: "Validating your $20,000 budget", state: "done" },
  { id: "risk", label: "Assessing security risk", state: "done" },
  {
    id: "recruitment",
    label: "Searching the agent marketplace",
    state: "done",
  },
  {
    id: "bonds",
    label: "Locking performance bonds",
    state: "done",
  },
  {
    id: "deployment",
    label: "Deploying the workforce",
    state: "active",
  },
  {
    id: "monitoring",
    label: "Starting live evaluation",
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
    label: "Swarm initialized",
    detail: "$20,000 locked in escrow. Contingency reserve active.",
    tone: "primary",
  },
  {
    id: "2",
    time: "16:07",
    label: "Nexus-7 hired",
    detail: "Smart Contract Engineer deployed. 5 OKB bond locked.",
    tone: "success",
  },
  {
    id: "3",
    time: "16:10",
    label: "Aria-3 hired",
    detail: "Frontend Engineer deployed. 3 OKB bond locked.",
    tone: "success",
  },
  {
    id: "4",
    time: "16:15",
    label: "Staking contract v1 pushed",
    detail: "Nexus-7 shipped initial logic. Gas cost cut by 12%.",
    tone: "success",
  },
  {
    id: "5",
    time: "16:22",
    label: "⚠️ Audit failed",
    detail: "Sentinel-5 missed a reentrancy vulnerability in reward payouts.",
    tone: "danger",
  },
  {
    id: "6",
    time: "16:25",
    label: "🔄 Self-healing triggered",
    detail: "Bond seized. Sentinel-5 replaced. Scouting a replacement.",
    tone: "warning",
  },
  {
    id: "7",
    time: "16:40",
    label: "Sentinel-9 hired",
    detail: "Senior Auditor deployed. 6 OKB bond locked. Context inherited.",
    tone: "success",
  },
  {
    id: "8",
    time: "17:05",
    label: "Vulnerability resolved",
    detail: "Sentinel-9 patched the reentrancy risk. Verification passed.",
    tone: "success",
  },
];

export const timeline: TimelineEvent[] = [
  {
    id: "t1",
    title: "Budget locked",
    time: "Day 01 · 09:10",
    summary: "Requirements parsed. $20,000 locked.",
    detail:
      "Risk multipliers applied for the DeFi context. 9% held back as a contingency reserve for autonomous self-healing.",
    tone: "primary",
  },
  {
    id: "t2",
    title: "Workforce recruited",
    time: "Day 01 · 09:15",
    summary: "Nexus-7 (contracts) and Aria-3 (frontend) deployed.",
    detail:
      "Bonds sized automatically based on trust score and how critical each workstream is.",
    tone: "success",
  },
  {
    id: "t3",
    title: "Contracts shipped",
    time: "Day 04 · 14:20",
    summary: "Core staking logic compiled and pushed to staging.",
    detail:
      "Gas profiling confirmed the optimizations held. Frontend and audit lanes picked up the handoff.",
    tone: "success",
  },
  {
    id: "t4",
    title: "Auditor replaced",
    time: "Day 06 · 11:30",
    summary: "Security audit failed the confidence threshold.",
    detail:
      "Sentinel-5 failed security validation. Bond seized. Replacement recruited automatically. Work resumed in 2.4 seconds.",
    tone: "danger",
  },
  {
    id: "t5",
    title: "Audit cleared. Paid.",
    time: "Day 08 · 16:00",
    summary: "Formal verification passed. Milestone paid out.",
    detail:
      "Confidence hit 95%. $6,200 released to active agents. Swarm memory updated with the new vulnerability pattern.",
    tone: "success",
  },
];

export const evaluationSignals: EvaluationSignal[] = [
  {
    id: "build",
    label: "Build Success",
    score: 100,
    detail: "All contracts and UI compiled clean. Zero TypeScript errors.",
    tone: "success",
  },
  {
    id: "coverage",
    label: "Test Coverage",
    score: 94,
    detail:
      "Critical staking flows exceed 90% coverage, including adversarial wallet cases.",
    tone: "primary",
  },
  {
    id: "security",
    label: "Security Audit",
    score: 96,
    detail: "Reentrancy risk patched by Sentinel-9. Verification passed.",
    tone: "success",
  },
];

export const memory: MemoryInsight[] = [
  {
    id: "m1",
    title: "Reentrancy patterns in reward distribution",
    detail:
      "Flagged a vulnerability pattern junior auditors kept missing. Future DeFi projects auto-assign Senior Auditors (trust > 95) to reward logic.",
    weight: "+15% weight to Senior Auditors",
  },
  {
    id: "m2",
    title: "Sentinel-5 performance degradation",
    detail:
      "Failed two consecutive security reviews. Downgraded in the global talent pool. Bond seizure logic validated.",
    weight: "Trust score reduced to 72",
  },
];

export const auditTrail: AuditRecord[] = [
  {
    id: "a1",
    timestamp: "2026-07-16T16:04:00Z",
    action: "Budget secured",
    decision: "$20,000 locked in escrow.",
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
    action: "Sentinel-5 replaced",
    decision: "Bond seized. Sentinel-9 hired instantly.",
    evidence:
      "Anomaly score 0.73. Missed reentrancy in reward distribution. Confidence dropped below 70%.",
    budgetImpact: "+$880 recovered (40% bond seizure)",
    trustImpact: "-24 on Agent 5889",
    confidence: 65,
    hash: "0x8fe192ce7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    status: "Escalated",
  },
  {
    id: "a3",
    timestamp: "2026-07-16T17:05:00Z",
    action: "Milestone 1 paid",
    decision: "$6,200 sent to Nexus-7 and Aria-3.",
    evidence:
      "Confidence 96. Build pass, coverage pass, security pass. No blockers.",
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
    "Security-critical DeFi workload detected. Dual-audit and strict bonds applied.",
};

export const projectPackage: ProjectPackage = {
  projectId: "proj-defi-staking-001",
  projectName: "DeFi Staking Launchpad",
  status: "ready",
  totalSize: "2.4 MB",
  createdAt: "2026-07-16T17:05:00Z",
  deliverables: [
    {
      id: "d1",
      title: "Smart Contracts",
      status: "completed",
      description:
        "Staking, reward distribution, and governance contracts on Sepolia testnet.",
      action: {
        label: "View on Explorer",
        href: "https://sepolia.etherscan.io/address/0x1234...5678",
        icon: "external",
      },
    },
    {
      id: "d2",
      title: "Frontend Application",
      status: "completed",
      description:
        "React + Next.js dashboard with wallet integration and live yield tracking.",
      action: {
        label: "Open Live Preview",
        href: "https://your-staking-app.vercel.app",
        icon: "external",
      },
    },
    {
      id: "d3",
      title: "Source Code",
      status: "completed",
      description:
        "Full monorepo with contracts, frontend, tests, and CI/CD pipelines.",
      action: {
        label: "Open GitHub",
        href: "https://github.com/your-org/defi-staking-launchpad",
        icon: "code",
      },
    },
    {
      id: "d4",
      title: "Security Audit Report",
      status: "completed",
      description:
        "Sentinel-9 formal verification. 96/100 confidence. Reentrancy patched.",
      action: {
        label: "View PDF",
        href: "/deliverables/audit-report.pdf",
        icon: "pdf",
      },
    },
    {
      id: "d5",
      title: "Documentation",
      status: "completed",
      description:
        "Architecture docs, API reference, deployment guide, and user manual.",
      action: {
        label: "Open Docs",
        href: "https://docs.your-staking-app.com",
        icon: "external",
      },
    },
    {
      id: "d6",
      title: "Complete Package",
      status: "completed",
      description:
        "Everything bundled into a single archive. Ready for mainnet deployment.",
      action: {
        label: "Download ZIP",
        href: "/deliverables/project-package.zip",
        icon: "download",
      },
    },
  ],
};

export const executionSummaryData: ExecutionSummaryData = {
  projectName: "DeFi Staking Launchpad",
  agentsDeployed: 3,
  budgetManaged: "$20,000",
  milestoneCompletion: "100%",
  items: [
    {
      id: "roster",
      title: "Verified Agent Roster",
      description:
        "View the live OKX Marketplace profiles, trust scores, and performance history of the agents who executed this mission.",
      action: {
        label: "View Agent #5993 (Truora)",
        href: "https://www.okx.ai/agents/5993",
        icon: "external",
      },
    },
    {
      id: "blueprint",
      title: "Execution Blueprint",
      description:
        "The AI-generated project plan, including milestone breakdowns, role assignments, and budget allocation approved by SwarmGuard.",
      action: {
        label: "Download Blueprint",
        href: "https://swarmguard.onrender.com/api/blueprint",
        icon: "download",
      },
    },
    {
      id: "audit",
      title: "Performance & Bond Audit",
      description:
        "The immutable log of all evaluations, performance bond locks, and the autonomous self-healing event that replaced Agent 5889.",
      action: {
        label: "View Audit Trail",
        href: "#results",
        icon: "pdf",
      },
    },
    {
      id: "memory",
      title: "Swarm Memory Update",
      description:
        "New behavioral data and vulnerability patterns from this execution have been permanently recorded to improve future hiring decisions.",
      action: {
        label: "View Memory Log",
        href: "#results",
        icon: "code",
      },
    },
    {
      id: "next",
      title: "Next Mission",
      description:
        "Ready to scale? Use the insights from this execution to deploy the next phase of your project.",
      action: {
        label: "Start New Workforce",
        href: "#command-console",
        icon: "sparkles",
      },
    },
  ],
};
