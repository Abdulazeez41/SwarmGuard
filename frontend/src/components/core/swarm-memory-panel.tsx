"use client";

import { Card } from "@/components/ui/card";
import { MemoryInsight } from "@/lib/types";

export function SwarmMemoryPanel({ insights }: { insights: MemoryInsight[] }) {
  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-[0.28em] text-white/42">Swarm memory</div>
      <div className="mt-3 text-2xl font-semibold text-white">An AI memory layer that makes every future workforce sharper.</div>
      <div className="mt-6 space-y-4">
        {insights.map((item) => (
          <div key={item.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium text-white">{item.title}</div>
              <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">{item.weight}</div>
            </div>
            <div className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
