"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AuditRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles = {
  Verified: "bg-cyan-300/10 text-cyan-50 border-cyan-300/20",
  Escalated: "bg-rose-300/10 text-rose-100 border-rose-300/20",
  Released: "bg-emerald-300/10 text-emerald-50 border-emerald-300/20",
};

export function AuditTrail({ records }: { records: AuditRecord[] }) {
  const [expandedId, setExpandedId] = useState(records[0]?.id ?? "");

  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-[0.28em] text-white/42">Audit trail</div>
      <div className="mt-3 text-2xl font-semibold text-white">Full transparency across decisions, money, evidence, and trust.</div>
      <div className="mt-6 space-y-4">
        {records.map((record) => {
          const isOpen = expandedId === record.id;
          return (
            <div key={record.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setExpandedId(isOpen ? "" : record.id)}
                aria-expanded={isOpen}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/38">{record.timestamp}</div>
                    <div className="mt-2 text-lg text-white">{record.action}</div>
                  </div>
                  <div className={cn("rounded-full border px-3 py-1 text-xs", statusStyles[record.status])}>{record.status}</div>
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-300">{record.decision}</div>
                {isOpen ? (
                  <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><div className="text-white/40">Evidence</div><div className="mt-2">{record.evidence}</div></div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><div className="text-white/40">Budget Impact</div><div className="mt-2">{record.budgetImpact}</div></div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><div className="text-white/40">Trust Impact</div><div className="mt-2">{record.trustImpact}</div></div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><div className="text-white/40">Confidence / Hash</div><div className="mt-2">{record.confidence} · {record.hash}</div></div>
                  </div>
                ) : null}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
