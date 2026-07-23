"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { swarmguardApi } from "@/lib/api/swarmguard";
import { ActivityItem, BackendStreamEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const tones = {
  primary: "bg-[#2dd4bf]",
  success: "bg-emerald-300",
  warning: "bg-amber-300",
  danger: "bg-rose-300",
};

function eventTone(event: BackendStreamEvent): ActivityItem["tone"] {
  if (
    event.type === "milestone_evaluated" &&
    event.action?.includes("SUCCESS")
  ) {
    return "success";
  }
  if (event.type === "milestone_evaluated") {
    return "warning";
  }
  if (event.type === "swarm_initiated") {
    return "primary";
  }
  return "primary";
}

function eventLabel(event: BackendStreamEvent) {
  if (event.type === "connected") return "Live stream connected";
  if (event.type === "swarm_initiated")
    return event.task_id
      ? `Swarm ${event.task_id} initiated`
      : "Swarm initiated";
  if (event.type === "milestone_evaluated") return "Milestone evaluated";
  if (event.type === "heartbeat") return "Heartbeat";
  return event.type.replaceAll("_", " ");
}

function eventDetail(event: BackendStreamEvent) {
  if (event.type === "milestone_evaluated" && event.action) {
    return `Backend applied ${event.action.replaceAll("_", " ")} after evaluating the current milestone.`;
  }
  if (event.type === "swarm_initiated" && event.message) {
    return event.message;
  }
  return event.message ?? "Backend event received.";
}

export function LiveActivityFeed({
  items,
  onStreamEvent,
}: {
  items: ActivityItem[];
  onStreamEvent?: (event: BackendStreamEvent) => void;
}) {
  const [streamNote, setStreamNote] = useState<string>("");
  const [streamEvents, setStreamEvents] = useState<ActivityItem[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const disconnect = swarmguardApi.connectActivityStream(
      setStreamNote,
      (event) => {
        onStreamEvent?.(event);
        if (event.type === "heartbeat") return;

        const nextEvent: ActivityItem = {
          id: `${event.type}-${event.task_id ?? "global"}-${event.timestamp ?? Date.now()}`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          label: eventLabel(event),
          detail: eventDetail(event),
          tone: eventTone(event),
        };

        setStreamEvents((current) => [nextEvent, ...current].slice(0, 4));
      },
    );
    return disconnect;
  }, [onStreamEvent]);

  const visibleItems = useMemo(
    () => [...streamEvents, ...items].slice(0, 8),
    [items, streamEvents],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [visibleItems.length]);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-white/42">
            Live agent activity
          </div>
          <div className="mt-3 text-2xl font-semibold text-white">
            GitHub and Cursor energy, but for autonomous workforces.
          </div>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-50">
          Streaming
        </div>
      </div>
      {streamNote ? (
        <div className="mt-5 rounded-2xl border border-cyan-300/14 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
          {streamNote}
        </div>
      ) : null}
      <div
        ref={scrollRef}
        className="mt-6 max-h-[420px] space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]"
      >
        {visibleItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index === 0 ? 0 : index * 0.03 }}
            className="flex gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4"
          >
            <div
              className={cn(
                "mt-1 h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]",
                tones[item.tone],
              )}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white">
                <span>{item.label}</span>
                <span className="text-white/45">{item.time}</span>
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                {item.detail}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
