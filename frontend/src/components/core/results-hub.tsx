"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ClipboardList,
  Gauge,
  LineChart as LineChartIcon,
  ShieldCheck,
} from "lucide-react";
import { AnalyticsPanel } from "@/components/core/analytics-panel";
import { AuditTrail } from "@/components/core/audit-trail";
import { EvaluationEngine } from "@/components/core/evaluation-engine";
import { LiveActivityFeed } from "@/components/core/live-activity-feed";
import { ProjectTimeline } from "@/components/core/project-timeline";
import { SelfHealingPanel } from "@/components/core/self-healing-panel";
import { SummaryCards } from "@/components/core/summary-cards";
import { SwarmMemoryPanel } from "@/components/core/swarm-memory-panel";
import { WorkforceGraph } from "@/components/core/workforce-graph";
import { AppSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils";

type TabId = "timeline" | "evaluation" | "activity" | "trust" | "analytics";

const tabs: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: "timeline", label: "Timeline", icon: ClipboardList },
  { id: "evaluation", label: "Evaluation", icon: Gauge },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "trust", label: "Audit & Memory", icon: ShieldCheck },
  { id: "analytics", label: "Analytics", icon: LineChartIcon },
];

/**
 * Replaces what used to be five stacked full-bleed sections (summary,
 * workforce graph + activity, timeline + evaluation, audit + memory,
 * analytics) with a single panel: one hero visual (the workforce graph)
 * plus a tabbed detail area underneath. The graph is the payoff of
 * running a command — everything else is supporting evidence a visitor
 * can dig into, not something they're marched through.
 */
export function ResultsHub({ data }: { data: AppSnapshot }) {
  const [activeTab, setActiveTab] = useState<TabId>("timeline");

  return (
    <div className="space-y-6">
      <SummaryCards cards={data.summaryCards} />

      <WorkforceGraph agents={data.agents} />

      <div className="rounded-[32px] border border-white/10 bg-white/4 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={isActive}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "border-teal-300/30 bg-teal-300/12 text-teal-100"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/85",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "timeline" ? (
                <ProjectTimeline events={data.timeline} />
              ) : null}
              {activeTab === "evaluation" ? (
                <div className="space-y-4">
                  <EvaluationEngine signals={data.evaluationSignals} />
                  <SelfHealingPanel />
                </div>
              ) : null}
              {activeTab === "activity" ? (
                <LiveActivityFeed items={data.activity} />
              ) : null}
              {activeTab === "trust" ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  <AuditTrail records={data.auditTrail} />
                  <SwarmMemoryPanel insights={data.memory} />
                </div>
              ) : null}
              {activeTab === "analytics" ? (
                <AnalyticsPanel
                  metrics={data.metrics}
                  chartData={data.chartData}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
