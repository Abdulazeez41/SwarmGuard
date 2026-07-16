"use client";

import { motion } from "framer-motion";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CommandPhase } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ThinkingSequence({ phases, riskHeadline }: { phases: CommandPhase[]; riskHeadline: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-white/46">AI Thinking Experience</div>
          <div className="mt-3 text-2xl font-semibold text-white">Visible machine reasoning with confidence-preserving pacing.</div>
        </div>
        <div className="max-w-sm rounded-2xl border border-cyan-300/20 bg-cyan-300/8 px-4 py-3 text-sm leading-6 text-cyan-100">
          {riskHeadline}
        </div>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "rounded-[24px] border p-4",
              phase.state === "done" && "border-emerald-300/20 bg-emerald-300/8",
              phase.state === "active" && "border-cyan-300/25 bg-cyan-300/10",
              phase.state === "pending" && "border-white/10 bg-white/4",
            )}
          >
            <div className="flex items-center gap-3">
              {phase.state === "done" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              ) : phase.state === "active" ? (
                <LoaderCircle className="h-5 w-5 animate-spin text-cyan-300" />
              ) : (
                <span className="inline-flex h-5 w-5 rounded-full border border-white/14 bg-white/5" />
              )}
              <div className="text-sm font-medium text-white">{phase.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
