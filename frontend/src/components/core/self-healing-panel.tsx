"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function SelfHealingPanel() {
  return (
    <Card className="overflow-hidden p-6">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-white/42">Self-healing orchestration</div>
          <div className="mt-3 text-2xl font-semibold text-white">When an agent fails, the project keeps moving.</div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Performance bond seized. Trust score reduced. Swarm memory updated. Replacement search initiated. Better candidate deployed. Timeline and payments continue without a human coordinator stepping in.
          </p>
          <div className="mt-6 space-y-3">
            {[
              ["Red pulse", "Anomaly severity crosses threshold and lights the lane."],
              ["Bond seized", "Risk recovery capital returns to the project reserve."],
              ["Replacement joins", "The stronger candidate inherits task context and evidence requirements."],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white">{title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-300">{detail}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/4 p-5">
          <div className="grid gap-3">
            {[
              ["Performance bond seized", "danger"],
              ["Trust score reduced", "warning"],
              ["Swarm memory updated", "primary"],
              ["Replacement search scanning", "warning"],
              ["Better candidate found", "success"],
              ["Workflow continues", "success"],
            ].map(([label, tone], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/5 p-4"
              >
                <motion.span
                  className={`inline-flex h-3 w-3 rounded-full ${tone === "danger" ? "bg-rose-300" : tone === "warning" ? "bg-amber-300" : tone === "success" ? "bg-emerald-300" : "bg-cyan-300"}`}
                  animate={tone === "danger" ? { scale: [1, 1.5, 1], opacity: [0.55, 1, 0.55] } : { opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="text-sm text-white">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
