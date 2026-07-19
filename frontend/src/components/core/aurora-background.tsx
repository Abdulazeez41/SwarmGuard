"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AuroraBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Primary Sea Green Orb */}
      <motion.div
        className="absolute left-[-20%] top-[-15%] h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.25),rgba(45,212,191,0.05)_40%,transparent_70%)] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 60, -40, 0],
                y: [0, 30, 50, 0],
                scale: [1, 1.15, 0.9, 1],
              }
        }
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Warm Moonlight / Amber Orb */}
      <motion.div
        className="absolute right-[-15%] bottom-[-10%] h-[45rem] w-[45rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),rgba(251,191,36,0.03)_40%,transparent_70%)] blur-3xl"
        animate={
          reduceMotion ? undefined : { x: [0, -50, 30, 0], y: [0, 40, -20, 0] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Soft Emerald Accent */}
      <motion.div
        className="absolute right-1/4 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.12),transparent_65%)] blur-3xl"
        animate={
          reduceMotion ? undefined : { x: [0, -35, 20, 0], y: [0, 25, -15, 0] }
        }
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,23,0.05),rgba(2,12,23,0.8))]" />
    </div>
  );
}
