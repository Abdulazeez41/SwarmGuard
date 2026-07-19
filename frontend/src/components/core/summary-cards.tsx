"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProjectSummaryCard } from "@/lib/types";
import { cn } from "@/lib/utils";

const toneStyles = {
  primary: "from-teal-500/20 via-teal-500/5 to-transparent border-teal-400/20",
  success:
    "from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-400/20",
  warning:
    "from-amber-500/20 via-amber-500/5 to-transparent border-amber-400/20",
  danger: "from-rose-500/20 via-rose-500/5 to-transparent border-rose-400/20",
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
          <Card
            className={cn(
              "group relative h-full overflow-hidden border bg-gradient-to-br p-5",
              toneStyles[card.tone],
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.24em] text-white/50">
                {card.title}
              </div>
              <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-gradient-primary">
                {card.value}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300/80">
                {card.description}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
