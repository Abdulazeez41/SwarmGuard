"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AuroraBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute left-[-12%] top-[-8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,124,255,0.55),transparent_65%)] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 40, -24, 0], y: [0, 20, 36, 0], scale: [1, 1.08, 0.96, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] top-[8%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(110,231,255,0.45),transparent_65%)] blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -48, 12, 0], y: [0, 22, -14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-12%] left-1/3 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(61,220,151,0.24),transparent_66%)] blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 26, -18, 0], y: [0, -18, 12, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.18),rgba(5,8,22,0.72))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_36%)]" />
    </div>
  );
}
