"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const scrollToId = (id: string) => {
  if (typeof document === "undefined") return;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[92svh] w-full max-w-[1600px] flex-col justify-center px-6 pb-16 pt-28 lg:px-12">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="border-teal-400/20 bg-teal-500/10 text-teal-200">
              Autonomous Workforce Operating System
            </Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              <span className="text-gradient-primary">Deploy Autonomous</span>
              <br />
              <span className="text-gradient-accent">AI Workforces.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300/90 sm:text-xl">
              Describe your project. SwarmGuard recruits, manages, evaluates,
              pays, and heals AI agent teams automatically.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => scrollToId("command-console")}>
                Launch Workforce
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => scrollToId("workforce")}
              >
                <PlayCircle className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                ["Describe", "State the mission in natural language or voice."],
                [
                  "Swarm",
                  "SwarmGuard recruits, allocates bonds, and assigns milestones.",
                ],
                [
                  "Ship",
                  "Evaluation, payments, and self-healing run autonomously.",
                ],
              ].map(([title, detail]) => (
                <div
                  key={title}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 backdrop-blur transition-all hover:border-teal-400/20 hover:bg-white/8"
                >
                  <div className="font-medium text-white">{title}</div>
                  <div className="mt-2 leading-6 text-slate-400">{detail}</div>
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
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.2),rgba(251,191,36,0.1),transparent_55%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#061826]/80 p-6 shadow-[0_30px_120px_rgba(2,12,23,0.8)] backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [
                  "Budget Validation",
                  "$20,000 confirmed with contingency reserve",
                ],
                [
                  "Trust Scores",
                  "Live workforce vetting across evidence depth and bond strength",
                ],
                [
                  "Evaluation Engine",
                  "Confidence gated payouts, objective reasoning, replayable evidence",
                ],
                [
                  "Self-Healing",
                  "Underperformers replaced before the project stalls",
                ],
              ].map(([title, detail], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  className="group rounded-[24px] border border-white/10 bg-white/5 p-5 transition-all hover:border-teal-400/20 hover:bg-white/8"
                >
                  <div className="text-sm uppercase tracking-[0.22em] text-emerald-300/80">
                    {title}
                  </div>
                  <div className="mt-3 text-sm leading-6 text-slate-300">
                    {detail}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 h-56 overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-teal-500/10 via-amber-500/5 to-transparent p-5">
              <div className="text-sm uppercase tracking-[0.22em] text-white/60">
                Neural activity
              </div>
              <div className="relative mt-6 h-36 w-full">
                <svg
                  viewBox="0 0 400 140"
                  className="absolute inset-0 h-full w-full overflow-visible"
                >
                  {/* Intertwining Path 1 (Teal) */}
                  <motion.path
                    d="M0 70 C 100 10, 150 130, 200 70 S 300 10, 400 70"
                    fill="none"
                    stroke="rgba(45,212,191,0.5)"
                    strokeWidth="2"
                    animate={{
                      d: [
                        "M0 70 C 100 10, 150 130, 200 70 S 300 10, 400 70",
                        "M0 70 C 100 130, 150 10, 200 70 S 300 130, 400 70",
                        "M0 70 C 100 10, 150 130, 200 70 S 300 10, 400 70",
                      ],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.path
                    d="M0 70 C 100 130, 150 10, 200 70 S 300 130, 400 70"
                    fill="none"
                    stroke="rgba(251,191,36,0.5)"
                    strokeWidth="2"
                    animate={{
                      d: [
                        "M0 70 C 100 130, 150 10, 200 70 S 300 130, 400 70",
                        "M0 70 C 100 10, 150 130, 200 70 S 300 10, 400 70",
                        "M0 70 C 100 130, 150 10, 200 70 S 300 130, 400 70",
                      ],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </svg>

                {/* Dots traveling along Path 1 (Teal) */}
                {[0, 25, 50, 75].map((_, i) => (
                  <motion.div
                    key={`teal-${i}`}
                    className="absolute h-2.5 w-2.5 rounded-full bg-teal-300 shadow-[0_0_14px_rgba(45,212,191,0.9)]"
                    style={{
                      offsetPath:
                        "path('M0 70 C 100 10, 150 130, 200 70 S 300 10, 400 70')",
                      offsetRotate: "0deg",
                    }}
                    animate={{
                      offsetDistance: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 1,
                    }}
                  />
                ))}

                {/* Dots traveling along Path 2 (Amber) */}
                {[0, 25, 50, 75].map((_, i) => (
                  <motion.div
                    key={`amber-${i}`}
                    className="absolute h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.9)]"
                    style={{
                      offsetPath:
                        "path('M0 70 C 100 130, 150 10, 200 70 S 300 130, 400 70')",
                      offsetRotate: "0deg",
                    }}
                    animate={{
                      offsetDistance: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 1,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
