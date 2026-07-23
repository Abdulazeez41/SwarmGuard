"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, ChevronDown, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MemoryInsight } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SwarmMemoryPanel({ insights }: { insights: MemoryInsight[] }) {
  const hasInsights = insights && insights.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/42">
            <Brain className="h-3.5 w-3.5" />
            Swarm memory
          </div>
          <div className="mt-3 text-2xl font-semibold text-gradient-primary">
            An AI memory layer that makes every future workforce sharper.
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-white/50 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {!hasInsights ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-[24px] border border-teal-400/20 bg-gradient-to-br from-teal-500/8 via-amber-500/4 to-transparent p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/20 to-amber-400/10">
                    <Brain className="h-6 w-6 text-teal-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      Memory initialization in progress
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300/80">
                      The swarm memory layer activates after your first
                      evaluation cycle. Deploy a workforce and trigger milestone
                      evaluations to begin building persistent lessons.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-teal-200/70">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>
                        Lessons learned will appear here automatically
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="mt-6 space-y-4">
                {insights.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium text-white">
                        {item.title}
                      </div>
                      <div className="rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-1 text-xs text-teal-200">
                        {item.weight}
                      </div>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-300/80">
                      {item.detail}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="mt-3 text-sm text-slate-400">
            {hasInsights
              ? `${insights.length} lesson${insights.length === 1 ? "" : "s"} learned so far - tap to view.`
              : "No lessons learned yet - tap to view status."}
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}
