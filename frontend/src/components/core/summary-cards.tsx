"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProjectSummaryCard } from "@/lib/types";
import { cn } from "@/lib/utils";

const toneStyles = {
  primary: "from-[#4F7CFF]/20 to-cyan-300/10 border-[#4F7CFF]/20",
  success: "from-emerald-300/16 to-emerald-200/6 border-emerald-300/18",
  warning: "from-amber-300/16 to-transparent border-amber-300/18",
  danger: "from-rose-300/16 to-transparent border-rose-300/18",
};

export function SummaryCards({ cards }: { cards: ProjectSummaryCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className={cn("h-full border bg-gradient-to-b p-5", toneStyles[card.tone])}>
            <div className="text-xs uppercase tracking-[0.24em] text-white/48">{card.title}</div>
            <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{card.value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
