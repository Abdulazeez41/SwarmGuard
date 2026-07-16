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
  tone: "primary" | "success" | "warning" | "danger";
};

export type AgentNode = {
  id: string;
  name: string;
  role: string;
  trustScore: number;
  hourlyRate: number;
  status: "Active" | "Evaluating" | "Replaced" | "Deploying";
  currentTask: string;
  heartbeat: "stable" | "warning" | "critical";
};

export type ActivityItem = {
  id: string;
  time: string;
  label: string;
  detail: string;
  tone: "primary" | "success" | "warning" | "danger";
};

export type TimelineEvent = {
  id: string;
  title: string;
  time: string;
  summary: string;
  detail: string;
  tone: "primary" | "success" | "warning" | "danger";
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
