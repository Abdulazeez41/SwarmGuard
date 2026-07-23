"use client";

import { motion } from "framer-motion";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CommandPhase } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEP_DELAY = 0.35;

export function ThinkingSequence({
  phases,
  riskHeadline,
}: {
  phases: CommandPhase[];
  riskHeadline: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-white/46">
            AI Thinking Experience
          </div>
          <div className="mt-3 text-2xl font-semibold text-gradient-primary">
            Visible machine reasoning with confidence-preserving pacing.
          </div>
        </div>
        <div className="max-w-sm rounded-2xl border border-teal-300/20 bg-teal-300/8 px-4 py-3 text-sm leading-6 text-teal-100">
          {riskHeadline}
        </div>
      </div>
      <div className="mt-8 max-w-xl space-y-2">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * STEP_DELAY, duration: 0.3 }}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-2.5",
              phase.state === "done" &&
                "border-emerald-300/20 bg-emerald-300/8",
              phase.state === "active" && "border-teal-300/25 bg-teal-300/10",
              phase.state === "pending" && "border-white/10 bg-white/4",
            )}
          >
            {phase.state === "done" ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * STEP_DELAY + 0.15,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <CheckCircle2 className="h-[18px] w-[18px] text-emerald-300" />
              </motion.span>
            ) : phase.state === "active" ? (
              <LoaderCircle className="h-[18px] w-[18px] animate-spin text-teal-300" />
            ) : (
              <span className="inline-flex h-[18px] w-[18px] rounded-full border border-white/14 bg-white/5" />
            )}
            <div className="text-sm font-medium text-white">{phase.label}</div>
            {index === phases.length - 1 && phase.state !== "done" ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * STEP_DELAY + 0.3 }}
                className="ml-auto text-xs text-white/40"
              >
                working…
              </motion.span>
            ) : null}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
