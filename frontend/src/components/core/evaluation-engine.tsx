"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { EvaluationSignal } from "@/lib/types";

export function EvaluationEngine({ signals, confidence = 94 }: { signals: EvaluationSignal[]; confidence?: number }) {
  const circumference = 2 * Math.PI * 84;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <Card className="p-6">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/5 p-8">
          <div className="text-xs uppercase tracking-[0.28em] text-white/42">AI evaluation engine</div>
          <div className="relative mt-6 flex items-center justify-center">
            <svg viewBox="0 0 220 220" className="h-56 w-56 -rotate-90">
              <circle cx="110" cy="110" r="84" stroke="rgba(255,255,255,0.08)" strokeWidth="18" fill="none" />
              <motion.circle
                cx="110"
                cy="110"
                r="84"
                stroke="url(#confidenceGradient)"
                strokeWidth="18"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeDasharray={circumference}
              />
              <defs>
                <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F7CFF" />
                  <stop offset="100%" stopColor="#6EE7FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center">
              <div className="text-xs uppercase tracking-[0.28em] text-white/42">Confidence</div>
              <div className="mt-2 text-5xl font-semibold tracking-[-0.05em] text-white">{confidence}</div>
              <div className="mt-2 text-sm text-emerald-200">Objective pass</div>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-center text-sm leading-6 text-slate-300">
            SwarmGuard fuses build success, test coverage, gas profile, security evidence, and mission objectives before payment release.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {signals.map((signal, index) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[24px] border border-white/10 bg-white/5 p-4"
            >
              <div className="text-xs uppercase tracking-[0.24em] text-white/48">{signal.label}</div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div className="text-4xl font-semibold text-white">{signal.score}</div>
                <div className="text-sm text-emerald-200">Pass / Fail: Pass</div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/8">
                <div className="h-2 rounded-full bg-[linear-gradient(90deg,#4F7CFF,#6EE7FF)]" style={{ width: `${signal.score}%` }} />
              </div>
              <div className="mt-4 text-sm leading-6 text-slate-300">{signal.detail}</div>
            </motion.div>
          ))}
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-[0.24em] text-white/48">Reasoning</div>
            <div className="mt-4 text-lg text-white">Evidence exceeded release thresholds across the critical path.</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Confidence remained above 90 throughout final evaluation, with the security lane weighted more heavily after a self-healing event. Payment release occurred only after all objective signals passed.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
