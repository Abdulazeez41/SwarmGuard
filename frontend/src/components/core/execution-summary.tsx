"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  ExternalLink,
  Download,
  FileText,
  Code2,
  Sparkles,
  Users,
  DollarSign,
  Target,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExecutionSummaryData, ExecutionSummaryItem } from "@/lib/types";

const iconMap = {
  external: ExternalLink,
  download: Download,
  pdf: FileText,
  code: Code2,
  sparkles: Sparkles,
};

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-white/40">
          {label}
        </div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

function SummaryItemCard({
  item,
  index,
}: {
  item: ExecutionSummaryItem;
  index: number;
}) {
  const Icon = iconMap[item.action.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.06 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-5 transition-all hover:border-teal-400/20 hover:bg-white/8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/80">
              Verified
            </div>
          </div>
          <div className="mt-3 text-lg font-medium text-white">
            {item.title}
          </div>
          <div className="mt-2 text-sm leading-6 text-slate-300/80">
            {item.description}
          </div>
        </div>

        <div className="mt-6">
          <a
            href={item.action.href}
            target={item.action.href.startsWith("http") ? "_blank" : undefined}
            rel={
              item.action.href.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 transition-all hover:border-teal-400/30 hover:bg-teal-500/10 hover:text-teal-200 sm:w-auto"
          >
            <Icon className="h-4 w-4" />
            {item.action.label}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function ExecutionSummary({ data }: { data: ExecutionSummaryData }) {
  return (
    <Card className="overflow-hidden p-6">
      {/* Header with celebration */}
      <div className="relative overflow-hidden rounded-[28px] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-amber-500/5 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.15),transparent_60%)]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <Sparkles className="h-6 w-6 text-emerald-300" />
                </motion.div>
                <div className="text-xs uppercase tracking-[0.28em] text-emerald-200">
                  Mission Complete
                </div>
              </div>

              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-gradient-primary sm:text-4xl">
                Execution Summary
              </h3>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300/90">
                SwarmGuard has successfully orchestrated your workforce. Below
                is the verified execution blueprint, agent performance audit,
                and direct access to the OKX agents who completed your mission.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatItem icon={Target} label="Project" value={data.projectName} />
            <StatItem
              icon={Users}
              label="Agents Deployed"
              value={`${data.agentsDeployed}`}
            />
            <StatItem
              icon={DollarSign}
              label="Budget Managed"
              value={data.budgetManaged}
            />
            <StatItem
              icon={CheckCircle2}
              label="Milestone Completion"
              value={data.milestoneCompletion}
            />
          </div>

          {/* Quick actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              <Download className="h-4 w-4" />
              Download Execution Blueprint
            </Button>
            <Button size="lg" variant="secondary">
              <FileText className="h-4 w-4" />
              Review Full Audit Log
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Items Grid */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/42">
              Mission Artifacts
            </div>
            <div className="mt-2 text-xl font-semibold text-white">
              Everything your workforce produced and verified
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((item, index) => (
            <SummaryItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </Card>
  );
}
