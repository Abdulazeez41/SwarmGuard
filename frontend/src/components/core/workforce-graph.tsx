"use client";

import { memo, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Handle,
  MarkerType,
  Node,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentNode } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const WorkforceCard = memo(({ data }: { data: AgentNode }) => {
  const isProject = data.role === "Project";
  return (
    <div
      className={`min-w-[220px] rounded-[24px] border ${
        isProject
          ? "border-teal-300/28 bg-teal-300/8"
          : "border-white/10 bg-[#061826]/90"
      } p-4 text-white shadow-[0_18px_55px_rgba(2,12,23,0.7)]`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!border-0 !bg-teal-300"
      />
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-sm font-semibold">
          {isProject ? "SG" : data.name.split(" ").pop()}
        </div>
        <div>
          <div className="text-sm font-medium">{data.role}</div>
          <div className="text-xs text-white/60">{data.name}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-white/40">Trust</div>
          <div>{data.trustScore}</div>
        </div>
        <div>
          <div className="text-white/40">Rate</div>
          <div>
            {isProject ? "Core" : `${formatCurrency(data.hourlyRate)}/hr`}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-white/8 bg-white/4 px-3 py-2 text-xs text-white/72">
        <span>{data.status}</span>
        <span
          className={`inline-flex h-2.5 w-2.5 rounded-full ${
            data.heartbeat === "warning"
              ? "bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.9)]"
              : data.heartbeat === "critical"
                ? "bg-rose-300"
                : "bg-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.9)]"
          }`}
        />
      </div>
      <div className="mt-3 text-xs leading-5 text-white/58">
        {data.currentTask}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-0 !bg-teal-300"
      />
    </div>
  );
});
WorkforceCard.displayName = "WorkforceCard";

export function WorkforceGraph({ agents }: { agents: AgentNode[] }) {
  const nodes = useMemo<Node[]>(() => {
    const project =
      agents.find((agent) => agent.role === "Project") ?? agents[0];
    const others = agents.filter((agent) => agent.id !== project.id);
    return [
      {
        id: project.id,
        type: "workforce",
        position: { x: 280, y: 20 },
        data: project,
      },
      ...others.map((agent, index) => ({
        id: agent.id,
        type: "workforce",
        position: {
          x: (index % 2) * 320 + 80,
          y: Math.floor(index / 2) * 220 + 240,
        },
        data: agent,
      })),
    ];
  }, [agents]);

  const edges = useMemo<Edge[]>(() => {
    const project =
      agents.find((agent) => agent.role === "Project") ?? agents[0];
    return agents
      .filter((agent) => agent.id !== project.id)
      .map((agent, index) => ({
        id: `${project.id}-${agent.id}`,
        source: project.id,
        target: agent.id,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#2dd4bf" },
        style: {
          stroke: index === 3 ? "#fb7185" : "#2dd4bf",
          strokeWidth: 2.2,
        },
      }));
  }, [agents]);

  return (
    <Card className="overflow-hidden p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-white/42">
            Workforce visualization
          </div>
          <div className="mt-3 text-2xl font-semibold text-gradient-primary">
            Autonomous team graph built around the project nucleus.
          </div>
        </div>
        <Badge className="border-teal-400/20 bg-teal-500/10 text-teal-200">
          React Flow
        </Badge>
      </div>
      <div className="h-[620px] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.1),rgba(255,255,255,0.02))]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ workforce: WorkforceCard }}
          fitView
          fitViewOptions={{ padding: 0.18, minZoom: 0.5, maxZoom: 1.2 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnDrag
        >
          <Background color="rgba(255,255,255,0.06)" gap={26} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </Card>
  );
}
