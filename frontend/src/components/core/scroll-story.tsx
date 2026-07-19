"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const stages = [
  {
    title: "Describe Project",
    description:
      "A single natural-language command becomes the project operating brief.",
  },
  {
    title: "AI Thinks",
    description:
      "Reasoning stays visible so the system feels intelligent, not opaque.",
  },
  {
    title: "Budget Validation",
    description:
      "Budget viability, replacement reserve, and bond policy are resolved automatically.",
  },
  {
    title: "Agent Recruitment",
    description:
      "Recruitment optimizes for trust, evidence depth, and speed instead of just price.",
  },
  {
    title: "Performance Bonds Locked",
    description:
      "Critical workstreams lock stronger bonds to protect delivery quality.",
  },
  {
    title: "Tasks Assigned",
    description: "Milestones are decomposed and routed across the swarm.",
  },
  {
    title: "Execution",
    description:
      "Live activity, handoffs, and status updates make execution feel alive.",
  },
  {
    title: "Evaluation Engine",
    description: "Confidence is computed from evidence, not opinion.",
  },
  {
    title: "Payment Released",
    description: "Payments unlock only when objective gates pass.",
  },
  {
    title: "Swarm Memory Updated",
    description:
      "Swarm memory captures lessons so every future hire gets sharper.",
  },
  {
    title: "Self-Healing Triggered",
    description:
      "Failures trigger autonomous recovery without human micromanagement.",
  },
  {
    title: "Project Complete",
    description:
      "The final output ships with an audit trail ready for your backend.",
  },
];

export function ScrollStory() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: index * 0.04, duration: 0.5 }}
        >
          <Card className="group relative h-full overflow-hidden border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-teal-400/20 hover:bg-white/8">
            {/* Teal top gradient line */}
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(45,212,191,0.8),transparent)] opacity-60 transition-opacity group-hover:opacity-100" />

            {/* Step number with subtle glow on hover */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.28em] text-teal-200/60 transition-colors group-hover:text-teal-200">
                Step {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <div className="mt-5 text-xl font-medium text-white transition-colors group-hover:text-teal-50">
              {stage.title}
            </div>

            {/* Description */}
            <div className="mt-3 text-sm leading-6 text-slate-300/80">
              {stage.description}
            </div>

            {/* Subtle hover glow effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
