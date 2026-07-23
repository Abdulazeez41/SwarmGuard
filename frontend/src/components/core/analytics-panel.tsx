"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChartPoint, MetricCard } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

function AnimatedMetricValue({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^([^\d.]*)([\d,]*\.?\d+)([^\d]*)$/);
    if (!match) {
      setDisplay(value);
      return undefined;
    }

    const [, prefix, numberPart, suffix] = match;
    const target = parseFloat(numberPart.replace(/,/g, ""));
    const decimals = numberPart.includes(".")
      ? numberPart.split(".")[1].length
      : 0;
    const hasComma = numberPart.includes(",");
    const duration = 1200;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const formatted = hasComma
        ? current.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : current.toFixed(decimals);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}</>;
}

export function AnalyticsPanel({
  metrics,
  chartData,
}: {
  metrics: MetricCard[];
  chartData: ChartPoint[];
}) {
  const [chartsOpen, setChartsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-white/42">
                {metric.label}
              </div>
              <div className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">
                <AnimatedMetricValue value={metric.value} />
              </div>
              <div className="mt-3 text-sm text-emerald-200">
                {metric.delta}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-5">
        <button
          type="button"
          onClick={() => setChartsOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-expanded={chartsOpen}
        >
          <div className="text-sm text-white">
            Detailed trend charts &amp; self-healing history
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 flex-shrink-0 text-white/50 transition-transform",
              chartsOpen && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {chartsOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                <div>
                  <div className="text-sm text-white">
                    Success and confidence trajectory
                  </div>
                  <div className="mt-5 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis
                          dataKey="name"
                          stroke="rgba(255,255,255,0.35)"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.35)"
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#0D1226",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 16,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="successRate"
                          stroke="#34d399"
                          strokeWidth={3}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="confidence"
                          stroke="#2dd4bf"
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white">
                    Self-healing frequency
                  </div>
                  <div className="mt-5 h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis
                          dataKey="name"
                          stroke="rgba(255,255,255,0.35)"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.35)"
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#0D1226",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 16,
                          }}
                        />
                        <Bar
                          dataKey="replacements"
                          fill="#3DDC97"
                          radius={[10, 10, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Card>
    </div>
  );
}
