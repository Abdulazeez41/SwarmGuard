"use client";

import { Card } from "@/components/ui/card";
import { ChartPoint, MetricCard } from "@/lib/types";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";

export function AnalyticsPanel({ metrics, chartData }: { metrics: MetricCard[]; chartData: ChartPoint[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => (
          <Card key={metric.id} className="p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-white/42">{metric.label}</div>
            <div className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">{metric.value}</div>
            <div className="mt-3 text-sm text-emerald-200">{metric.delta}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-4">
        <Card className="p-5">
          <div className="text-sm text-white">Success and confidence trajectory</div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0D1226", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16 }} />
                <Line type="monotone" dataKey="successRate" stroke="#6EE7FF" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="confidence" stroke="#4F7CFF" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-white">Self-healing frequency</div>
          <div className="mt-5 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0D1226", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16 }} />
                <Bar dataKey="replacements" fill="#3DDC97" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
