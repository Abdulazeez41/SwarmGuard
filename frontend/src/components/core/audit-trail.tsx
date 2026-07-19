"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AuditRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles = {
  Verified: "bg-emerald-300/10 text-emerald-200 border-emerald-300/20",
  Escalated: "bg-rose-300/10 text-rose-200 border-rose-300/20",
  Released: "bg-teal-300/10 text-teal-200 border-teal-300/20",
};

function formatTimestamp(iso: string) {
  try {
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function AuditTrail({ records }: { records: AuditRecord[] }) {
  const [expandedId, setExpandedId] = useState(records[0]?.id ?? "");

  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-[0.28em] text-white/42">
        Audit trail
      </div>
      <div className="mt-3 text-2xl font-semibold text-gradient-primary">
        Full transparency across decisions, money, evidence, and trust.
      </div>
      <div className="mt-6 space-y-4">
        {records.map((record, index) => {
          const isOpen = expandedId === record.id;
          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-[24px] border border-white/10 bg-white/5 p-4"
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setExpandedId(isOpen ? "" : record.id)}
                aria-expanded={isOpen}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/38">
                      {formatTimestamp(record.timestamp)}
                    </div>
                    <div className="mt-2 text-lg text-white">
                      {record.action}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs",
                      statusStyles[record.status],
                    )}
                  >
                    {record.status}
                  </div>
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-300/80">
                  {record.decision}
                </div>
                {isOpen ? (
                  <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                        Evidence
                      </div>
                      <div className="mt-2 text-sm">{record.evidence}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                        Budget Impact
                      </div>
                      <div className="mt-2 text-sm font-medium text-emerald-200">
                        {record.budgetImpact}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                        Trust Impact
                      </div>
                      <div className="mt-2 text-sm">{record.trustImpact}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                        Confidence / Hash
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-teal-200">
                          {record.confidence}
                        </span>
                        <span className="text-white/40"> · </span>
                        <span className="font-mono text-xs text-white/60">
                          {record.hash}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </button>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
