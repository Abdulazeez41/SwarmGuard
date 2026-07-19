"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  Command,
  Menu,
  Network,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
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

const bootSequence = [
  "Initializing neural mesh",
  "Loading swarm protocols",
  "Syncing trust ledger",
  "Calibrating evaluation engine",
  "Workforce OS ready",
];

function BootScreen() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020c17] text-white">
      <AuroraBackground />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated logo - NOW WITH TEAL/AMBER GRADIENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,#2dd4bf,#fbbf24)] blur-2xl opacity-40" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#2dd4bf,#fbbf24)] text-2xl font-bold text-white shadow-[0_20px_80px_rgba(45,212,191,0.5)]">
            SG
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="text-xs uppercase tracking-[0.32em] text-white/40">
            SwarmGuard
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Booting the operating system
          </div>
        </motion.div>

        {/* Animated boot sequence */}
        <div className="mt-10 w-full max-w-md">
          <div className="space-y-2">
            {bootSequence.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.25, duration: 0.4 }}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-2.5 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.7 + index * 0.25,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20"
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </motion.div>
                <span className="text-sm text-white/70">{step}</span>
                {index === bootSequence.length - 1 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="ml-auto text-xs text-emerald-300"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress bar - NOW WITH TEAL/AMBER GRADIENT */}
          <div className="mt-6 h-px w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-[linear-gradient(90deg,#2dd4bf,#fbbf24)]"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export function SwarmguardShell() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["snapshot"],
    queryFn: swarmguardApi.getSnapshot,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  if (isLoading || !data) {
    return <BootScreen />;
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020c17] px-4 text-white">
        <AuroraBackground />
        <div className="relative z-10 rounded-[32px] border border-rose-300/18 bg-rose-300/10 p-8 text-center backdrop-blur-xl">
          <div className="text-xl font-semibold">
            Unable to load SwarmGuard snapshot.
          </div>
          <div className="mt-3 text-sm text-rose-100/80">
            Check your API mode or backend connection settings.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-[#020c17] text-white">
      <AuroraBackground />

      {/* Scroll Progress Indicator - PREMIUM TOUCH */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400"
        style={{ scaleX }}
      />

      <div className="relative z-10">
        {/* Refined Header with Mobile Menu */}
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-[#020c17]/70 backdrop-blur-2xl">
          <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 lg:px-12">
            <a href="#top" className="group flex items-center gap-3 text-white">
              {/* SG Logo */}
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#2dd4bf,#fbbf24)] text-xs font-bold text-white shadow-[0_8px_30px_rgba(45,212,191,0.4)] transition-shadow group-hover:shadow-[0_12px_40px_rgba(45,212,191,0.6)]">
                SG
              </span>
              <span>
                <span className="block text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
                  SwarmGuard
                </span>
                <span className="block text-xs text-white/80">
                  Autonomous Workforce OS
                </span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 text-sm md:flex">
              {[
                { href: "#command-console", label: "Console" },
                { href: "#workforce", label: "Workforce" },
                { href: "#evaluation", label: "Evaluation" },
                { href: "#audit", label: "Audit" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Live Status Indicator */}
              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/8 px-3 py-1 text-xs text-emerald-200 sm:flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </span>
                Live
              </span>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white md:hidden"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-white/6 bg-[#020c17]/90 backdrop-blur-2xl md:hidden"
              >
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                  {[
                    { href: "#command-console", label: "Console" },
                    { href: "#workforce", label: "Workforce" },
                    { href: "#evaluation", label: "Evaluation" },
                    { href: "#audit", label: "Audit" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-4 py-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
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
          description="React Flow turns the workforce into a believable operating graph with trust, task state, and heartbeats."
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

        {/* Feature Cards */}
        <section className="mx-auto grid w-full max-w-[1600px] gap-4 px-6 pb-8 sm:px-8 lg:grid-cols-3 lg:px-12">
          {[
            {
              icon: Command,
              title: "Command-first UX",
              detail:
                "A single console replaces staffing workflows, PM overhead, and manual coordination.",
            },
            {
              icon: Network,
              title: "Agentic coordination",
              detail:
                "Recruitment, milestones, payments, trust, and self-healing all speak the same design language.",
            },
            {
              icon: ShieldCheck,
              title: "Enterprise trust",
              detail:
                "Evidence-driven evaluation, audit logs, and memory updates make autonomy believable.",
            },
            {
              icon: BrainCircuit,
              title: "Learning system",
              detail:
                "Every outcome feeds future hiring weights and replacement decisions.",
            },
            {
              icon: Sparkles,
              title: "Premium motion",
              detail:
                "Aurora gradients, glass, micro-interactions, and cinematic pacing make the product feel alive.",
            },
            {
              icon: Activity,
              title: "Backend-ready architecture",
              detail:
                "Mock and live modes share one typed service layer for minimal integration friction.",
            },
          ].map(({ icon: Icon, title, detail }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:border-teal-400/20 hover:bg-white/8"
            >
              {/* Teal hover glow - MATCHES NEW THEME */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/20 to-amber-400/10 text-teal-200 transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-xl font-medium text-white">
                  {title}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </section>
        <Footer />
      </div>
    </main>
  );
}
