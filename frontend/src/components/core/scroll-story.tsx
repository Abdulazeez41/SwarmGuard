"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const stages = [
  "Describe Project",
  "AI Thinks",
  "Budget Validation",
  "Agent Recruitment",
  "Performance Bonds Locked",
  "Tasks Assigned",
  "Execution",
  "Evaluation Engine",
  "Payment Released",
  "Swarm Memory Updated",
  "Self-Healing Triggered",
  "Project Complete",
];

export function ScrollStory() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stages.map((stage, index) => (
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: index * 0.04, duration: 0.5 }}
        >
          <Card className="relative h-full overflow-hidden p-5">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(110,231,255,0.85),transparent)]" />
            <div className="text-xs uppercase tracking-[0.28em] text-white/42">Step {String(index + 1).padStart(2, "0")}</div>
            <div className="mt-6 text-xl font-medium text-white">{stage}</div>
            <div className="mt-3 text-sm leading-6 text-slate-300">
              {index === 0 && "A single natural-language command becomes the project operating brief."}
              {index === 1 && "Reasoning stays visible so the system feels intelligent, not opaque."}
              {index === 2 && "Budget viability, replacement reserve, and bond policy are resolved automatically."}
              {index === 3 && "Recruitment optimizes for trust, evidence depth, and speed instead of just price."}
              {index === 4 && "Critical workstreams lock stronger bonds to protect delivery quality."}
              {index === 5 && "Milestones are decomposed and routed across the swarm."}
              {index === 6 && "Live activity, handoffs, and status updates make execution feel alive."}
              {index === 7 && "Confidence is computed from evidence, not opinion."}
              {index === 8 && "Payments unlock only when objective gates pass."}
              {index === 9 && "Swarm memory captures lessons so every future hire gets sharper."}
              {index === 10 && "Failures trigger autonomous recovery without human micromanagement."}
              {index === 11 && "The final output ships with an audit trail ready for your backend."}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
