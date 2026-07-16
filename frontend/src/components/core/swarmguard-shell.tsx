"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, BrainCircuit, Command, Network, ShieldCheck, Sparkles } from "lucide-react";
import { AnalyticsPanel } from "@/components/core/analytics-panel";
import { AuditTrail } from "@/components/core/audit-trail";
import { AuroraBackground } from "@/components/core/aurora-background";
import { CommandConsole } from "@/components/core/command-console";
import { EvaluationEngine } from "@/components/core/evaluation-engine";
import { Footer } from "@/components/core/footer";
import { Hero } from "@/components/core/hero";
import { LiveActivityFeed } from "@/components/core/live-activity-feed";
import { ProjectTimeline } from "@/components/core/project-timeline";
import { ScrollStory } from "@/components/core/scroll-story";
import { SectionShell } from "@/components/core/section-shell";
import { SelfHealingPanel } from "@/components/core/self-healing-panel";
import { SummaryCards } from "@/components/core/summary-cards";
import { SwarmMemoryPanel } from "@/components/core/swarm-memory-panel";
import { WorkforceGraph } from "@/components/core/workforce-graph";
import { swarmguardApi } from "@/lib/api/swarmguard";

export function SwarmguardShell() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["snapshot"],
    queryFn: swarmguardApi.getSnapshot,
  });

  if (isLoading || !data) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <AuroraBackground />
        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/10 bg-white/5 px-6 py-5 text-center backdrop-blur-xl">
            <div className="text-sm uppercase tracking-[0.28em] text-white/45">Initializing</div>
            <div className="mt-3 text-2xl text-white">Booting the SwarmGuard operating system…</div>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 text-white">
        <div className="rounded-[32px] border border-rose-300/18 bg-rose-300/10 p-6 text-center">
          <div className="text-xl">Unable to load SwarmGuard snapshot.</div>
          <div className="mt-3 text-sm text-rose-100/80">Check your API mode or backend connection settings.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-[#050816] text-white">
      <AuroraBackground />
      <div className="relative">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-[#050816]/55 backdrop-blur-xl">
          <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <a href="#top" className="flex items-center gap-3 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F7CFF,#6EE7FF)] text-sm font-semibold text-white shadow-[0_18px_55px_rgba(79,124,255,0.35)]">SG</span>
              <span>
                <span className="block text-sm uppercase tracking-[0.28em] text-white/40">SwarmGuard</span>
                <span className="block text-sm text-white/85">Autonomous workforce OS</span>
              </span>
            </a>
            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <a href="#command-console" className="hover:text-white">Console</a>
              <a href="#workforce" className="hover:text-white">Workforce</a>
              <a href="#evaluation" className="hover:text-white">Evaluation</a>
              <a href="#audit" className="hover:text-white">Audit</a>
            </nav>
          </div>
        </header>
        <div id="top" />
        <Hero />
        <SectionShell
          eyebrow="One command surface"
          title="The homepage is the operating system."
          description="SwarmGuard revolves around a single AI command console instead of a maze of CRUD pages."
          className="pb-24"
        >
          <CommandConsole />
        </SectionShell>
        <SectionShell
          eyebrow="Scroll storytelling"
          title="From brief to delivery, the entire autonomous journey stays visible."
          description="Each scroll step reinforces the core product story: describe the mission once, then let SwarmGuard orchestrate the rest."
          className="pb-24"
        >
          <ScrollStory />
        </SectionShell>
        <SectionShell
          eyebrow="Mission interpretation"
          title="Immediate system understanding, before the workforce even starts moving."
          description="As soon as the command lands, SwarmGuard derives summary, budget, risk, skills, and workforce structure."
          className="pb-24"
        >
          <SummaryCards cards={data.summaryCards} />
        </SectionShell>
        <SectionShell
          eyebrow="Workforce graph"
          title="A living swarm around the project nucleus."
          description="React Flow turns the workforce into a believable operating graph with trust, task state, and heartbeats.
"
          className="pb-24"
        >
          <div id="workforce" className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <WorkforceGraph agents={data.agents} />
            <LiveActivityFeed items={data.activity} />
          </div>
        </SectionShell>
        <SectionShell
          eyebrow="Operational control"
          title="Timelines, evaluation, and self-healing feel autonomous, not administrative."
          description="SwarmGuard shows objective confidence, replayable evidence, and recovery behaviors without collapsing into dashboard chrome."
          className="pb-24"
        >
          <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
            <ProjectTimeline events={data.timeline} />
            <div id="evaluation" className="space-y-4">
              <EvaluationEngine signals={data.evaluationSignals} />
              <SelfHealingPanel />
            </div>
          </div>
        </SectionShell>
        <SectionShell
          eyebrow="Learning and transparency"
          title="The swarm remembers failures and exposes decisions."
          description="Memory and auditability turn orchestration into a trustworthy system that can plug into a real backend."
          className="pb-24"
        >
          <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
            <SwarmMemoryPanel insights={data.memory} />
            <div id="audit">
              <AuditTrail records={data.auditTrail} />
            </div>
          </div>
        </SectionShell>
        <SectionShell
          eyebrow="Analytics"
          title="Animated metrics for investors, operators, and enterprise buyers."
          description="Performance, replacement behavior, confidence, and budget stewardship stay legible at a glance."
          className="pb-12"
        >
          <AnalyticsPanel metrics={data.metrics} chartData={data.chartData} />
        </SectionShell>
        <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-8 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { icon: Command, title: "Command-first UX", detail: "A single console replaces staffing workflows, PM overhead, and manual coordination." },
            { icon: Network, title: "Agentic coordination", detail: "Recruitment, milestones, payments, trust, and self-healing all speak the same design language." },
            { icon: ShieldCheck, title: "Enterprise trust", detail: "Evidence-driven evaluation, audit logs, and memory updates make autonomy believable." },
            { icon: BrainCircuit, title: "Learning system", detail: "Every outcome feeds future hiring weights and replacement decisions." },
            { icon: Sparkles, title: "Premium motion", detail: "Aurora gradients, glass, micro-interactions, and cinematic pacing make the product feel alive." },
            { icon: Activity, title: "Backend-ready architecture", detail: "Mock and live modes share one typed service layer for minimal integration friction." },
          ].map(({ icon: Icon, title, detail }) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-cyan-100"><Icon className="h-5 w-5" /></div>
              <div className="mt-4 text-xl text-white">{title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p>
            </div>
          ))}
        </section>
        <Footer />
      </div>
    </main>
  );
}
