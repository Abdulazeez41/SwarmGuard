"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { swarmguardApi } from "@/lib/api/swarmguard";
import { ActivityItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const tones = {
  primary: "bg-[#4F7CFF]",
  success: "bg-emerald-300",
  warning: "bg-amber-300",
  danger: "bg-rose-300",
};

export function LiveActivityFeed({ items }: { items: ActivityItem[] }) {
  const [streamNote, setStreamNote] = useState<string>("");

  useEffect(() => {
    const disconnect = swarmguardApi.connectActivityStream(setStreamNote);
    return disconnect;
  }, []);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-white/42">Live agent activity</div>
          <div className="mt-3 text-2xl font-semibold text-white">GitHub and Cursor energy, but for autonomous workforces.</div>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-50">Streaming</div>
      </div>
      {streamNote ? (
        <div className="mt-5 rounded-2xl border border-cyan-300/14 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">{streamNote}</div>
      ) : null}
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.04 }}
            className="flex gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4"
          >
            <div className={cn("mt-1 h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]", tones[item.tone])} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white">
                <span>{item.label}</span>
                <span className="text-white/45">{item.time}</span>
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
