export type Tone = "primary" | "success" | "warning" | "danger";

export type CommandPhase = {
  id: string;
  label: string;
  state: "done" | "active" | "pending";
};

export type ProjectSummaryCard = {
  id: string;
  title: string;
  value: string;
  description: string;
  tone: Tone;
};

export type AgentNode = {
  id: string;
  name: string;
  role: string;
  trustScore: number;
  hourlyRate: number;
  status:
    | "Active"
    | "Evaluating"
    | "Replaced"
    | "Deploying"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "Idle"
    | string;
  currentTask: string;
  heartbeat: "stable" | "warning" | "critical";
};

export type ActivityItem = {
  id: string;
  time: string;
  label: string;
  detail: string;
  tone: Tone;
};

export type TimelineEvent = {
  id: string;
  title: string;
  time: string;
  summary: string;
  detail: string;
  tone: Tone;
};

export type EvaluationSignal = {
  id: string;
  label: string;
  score: number;
  detail: string;
  tone: "primary" | "success" | "warning";
};

export type AuditRecord = {
  id: string;
  timestamp: string;
  action: string;
  decision: string;
  evidence: string;
  budgetImpact: string;
  trustImpact: string;
  confidence: number;
  hash: string;
  status: "Verified" | "Escalated" | "Released";
};

export type MemoryInsight = {
  id: string;
  title: string;
  detail: string;
  weight: string;
};

export type MetricCard = {
  id: string;
  label: string;
  value: string;
  delta: string;
};

export type ChartPoint = {
  name: string;
  successRate: number;
  confidence: number;
  replacements: number;
};

export type CommandAnalysisResponse = {
  transcript: string;
  summaryCards: ProjectSummaryCard[];
  recommendedWorkforce: AgentNode[];
  reasoning: CommandPhase[];
  riskHeadline: string;
};

export type AppSnapshot = {
  summaryCards: ProjectSummaryCard[];
  agents: AgentNode[];
  activity: ActivityItem[];
  timeline: TimelineEvent[];
  evaluationSignals: EvaluationSignal[];
  auditTrail: AuditRecord[];
  memory: MemoryInsight[];
  metrics: MetricCard[];
  chartData: ChartPoint[];
  commandExample: string;
};

export type BackendStreamEvent = {
  type:
    | "connected"
    | "heartbeat"
    | "swarm_initiated"
    | "milestone_evaluated"
    | string;
  message?: string;
  task_id?: string;
  action?: string;
  timestamp?: number;
};

export type ApiErrorPayload = {
  error?: string;
  message?: string;
  detail?: string;
};

export type Deliverable = {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
  description: string;
  action: {
    label: string;
    href: string;
    icon: "external" | "download" | "pdf" | "code" | "deploy";
  };
};

export type ProjectPackage = {
  projectId: string;
  projectName: string;
  status: "packaging" | "ready";
  deliverables: Deliverable[];
  totalSize: string;
  createdAt: string;
};

export type ExecutionSummaryItem = {
  id: string;
  title: string;
  description: string;
  action: {
    label: string;
    href: string;
    icon: "external" | "download" | "pdf" | "code" | "sparkles";
  };
};

export type ExecutionSummaryData = {
  projectName: string;
  agentsDeployed: number;
  budgetManaged: string;
  milestoneCompletion: string;
  items: ExecutionSummaryItem[];
};
