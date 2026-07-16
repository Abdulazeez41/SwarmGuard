"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TimelineEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const toneMap = {
  primary: "bg-cyan-300",
  success: "bg-emerald-300",
  warning: "bg-amber-300",
  danger: "bg-rose-300",
};

export function ProjectTimeline({ events }: { events: TimelineEvent[] }) {
  const [openId, setOpenId] = useState(events[0]?.id ?? "");

  return (
    <Card className="p-5 sm:p-6">
      <div className="text-xs uppercase tracking-[0.28em] text-white/42">Project timeline</div>
      <div className="mt-3 text-2xl font-semibold text-white">Every milestone stays legible, explainable, and expandable.</div>
      <div className="mt-8 space-y-4">
        {events.map((event) => {
          const isOpen = openId === event.id;
          return (
            <div key={event.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <button
                type="button"
                className="flex w-full items-start gap-4 text-left"
                onClick={() => setOpenId(isOpen ? "" : event.id)}
                aria-expanded={isOpen}
              >
                <div className="flex flex-col items-center">
                  <span className={cn("mt-1 h-3 w-3 rounded-full", toneMap[event.tone])} />
                  <span className="mt-2 h-full w-px bg-white/10" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-sm text-white/48">{event.time}</div>
                      <div className="mt-2 text-lg font-medium text-white">{event.title}</div>
                    </div>
                    <ChevronDown className={cn("mt-1 h-5 w-5 text-white/48 transition-transform", isOpen && "rotate-180")} />
                  </div>
                  <div className="mt-3 text-sm leading-6 text-slate-300">{event.summary}</div>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-3 text-sm leading-6 text-slate-400"
                      >
                        {event.detail}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
