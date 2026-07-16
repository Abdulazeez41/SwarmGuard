"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const scrollToId = (id: string) => {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge>Autonomous Workforce Operating System</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Deploy Autonomous AI Workforces.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Describe your project. SwarmGuard recruits, manages, evaluates, pays, and heals AI agent teams automatically.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => scrollToId("command-console")}>
                Launch Workforce
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => scrollToId("workforce")}>
                <PlayCircle className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                ["Describe", "State the mission in natural language or voice."],
                ["Swarm", "SwarmGuard recruits, allocates bonds, and assigns milestones."],
                ["Ship", "Evaluation, payments, and self-healing run autonomously."],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 backdrop-blur">
                  <div className="text-white">{title}</div>
                  <div className="mt-2 leading-6">{detail}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(110,231,255,0.28),transparent_48%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#0D1226]/80 p-6 shadow-[0_30px_120px_rgba(5,8,22,0.65)] backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Budget Validation", "$20,000 confirmed with contingency reserve"],
                ["Trust Scores", "Live workforce vetting across evidence depth and bond strength"],
                ["Evaluation Engine", "Confidence gated payouts, objective reasoning, replayable evidence"],
                ["Self-Healing", "Underperformers replaced before the project stalls"],
              ].map(([title, detail], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5"
                >
                  <div className="text-sm uppercase tracking-[0.22em] text-cyan-200/72">{title}</div>
                  <div className="mt-3 text-sm leading-6 text-slate-300">{detail}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 h-56 overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(79,124,255,0.08))] p-5">
              <div className="text-sm uppercase tracking-[0.22em] text-white/48">Neural activity</div>
              <div className="relative mt-6 h-36">
                {[12, 28, 46, 64, 79, 91].map((left, index) => (
                  <motion.span
                    key={left}
                    className="absolute h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(110,231,255,0.9)]"
                    style={{ left: `${left}%`, top: `${(index % 3) * 28 + 12}%` }}
                    animate={{ y: [0, -16, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ delay: index * 0.12, duration: 2.6, repeat: Infinity }}
                  />
                ))}
                <svg viewBox="0 0 400 140" className="h-full w-full">
                  <path d="M10 90 C70 30, 110 30, 150 70 S230 120, 280 55 S340 20, 390 72" fill="none" stroke="rgba(110,231,255,0.5)" strokeWidth="2" />
                  <path d="M10 104 C58 86, 108 118, 164 66 S236 26, 286 78 S338 116, 390 36" fill="none" stroke="rgba(79,124,255,0.45)" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
