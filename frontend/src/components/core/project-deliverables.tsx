"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileCode2,
  FileText,
  Package,
  Rocket,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectPackage, Deliverable } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap = {
  external: ExternalLink,
  download: Download,
  pdf: FileText,
  code: FileCode2,
  deploy: Rocket,
};

function PackagingAnimation({ onComplete }: { onComplete: () => void }) {
  const steps = [
    "Collecting smart contracts",
    "Bundling frontend application",
    "Attaching audit report",
    "Compiling documentation",
    "Generating deployment package",
    "Finalizing deliverables",
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,#2dd4bf,#fbbf24)] blur-2xl opacity-40" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 border border-white/10">
          <Package className="h-10 w-10 text-teal-300" />
        </div>
      </motion.div>

      <div className="mt-8 text-center">
        <div className="text-xs uppercase tracking-[0.28em] text-white/42">
          Packaging your project
        </div>
        <div className="mt-3 text-2xl font-semibold text-gradient-primary">
          Preparing deliverables
        </div>
      </div>

      <div className="mt-8 w-full max-w-md space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: index <= currentStep ? 1 : 0.3,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-2.5"
          >
            {index < currentStep ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-300" />
            ) : index === currentStep ? (
              <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-teal-300" />
            ) : (
              <div className="h-4 w-4 flex-shrink-0 rounded-full border border-white/14 bg-white/5" />
            )}
            <span
              className={cn(
                "text-sm transition-colors",
                index <= currentStep ? "text-white" : "text-white/40",
              )}
            >
              {step}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DeliverableCard({
  deliverable,
  index,
}: {
  deliverable: Deliverable;
  index: number;
}) {
  const Icon = iconMap[deliverable.action.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.06 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-5 transition-all hover:border-teal-400/20 hover:bg-white/8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/80">
              Completed
            </div>
          </div>
          <div className="mt-3 text-lg font-medium text-white">
            {deliverable.title}
          </div>
          <div className="mt-2 text-sm leading-6 text-slate-300/80">
            {deliverable.description}
          </div>
        </div>
      </div>

      <div className="relative mt-5">
        <a
          href={deliverable.action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 transition-all hover:border-teal-400/30 hover:bg-teal-500/10 hover:text-teal-200"
        >
          <Icon className="h-4 w-4" />
          {deliverable.action.label}
        </a>
      </div>
    </motion.div>
  );
}

export function ProjectDeliverables({
  projectPackage,
}: {
  projectPackage: ProjectPackage;
}) {
  const [showDeliverables, setShowDeliverables] = useState(
    projectPackage.status === "ready",
  );

  if (!showDeliverables) {
    return (
      <Card className="overflow-hidden p-6">
        <PackagingAnimation onComplete={() => setShowDeliverables(true)} />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-6">
      {/* Header with celebration */}
      <div className="relative overflow-hidden rounded-[28px] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-amber-500/5 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.15),transparent_60%)]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <Sparkles className="h-6 w-6 text-emerald-300" />
                </motion.div>
                <div className="text-xs uppercase tracking-[0.28em] text-emerald-200">
                  Project delivered
                </div>
              </div>

              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-gradient-primary sm:text-4xl">
                Your project is ready.
              </h3>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300/90">
                SwarmGuard has packaged every deliverable from your autonomous
                workforce. Source code, smart contracts, frontend, audit report,
                and documentation — all collected, verified, and ready for
                deployment.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                  {projectPackage.projectName}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                  {projectPackage.deliverables.length} deliverables
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                  {projectPackage.totalSize}
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              <Download className="h-4 w-4" />
              Download Complete Package
            </Button>
            <Button size="lg" variant="secondary">
              <Rocket className="h-4 w-4" />
              Deploy to Mainnet
            </Button>
          </div>
        </div>
      </div>

      {/* Deliverables grid */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/42">
              Deliverables
            </div>
            <div className="mt-2 text-xl font-semibold text-white">
              Everything your workforce produced
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projectPackage.deliverables.map((deliverable, index) => (
            <DeliverableCard
              key={deliverable.id}
              deliverable={deliverable}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Continue CTA */}
      <div className="mt-10 rounded-[24px] border border-white/10 bg-white/3 p-6 text-center">
        <div className="text-sm text-white/60">
          Ready for your next project?
        </div>
        <button
          onClick={() => {
            document
              .getElementById("command-console")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="mt-3 inline-flex items-center gap-2 text-base font-medium text-teal-300 transition hover:text-teal-200"
        >
          <Sparkles className="h-4 w-4" />
          Start a new workforce
        </button>
      </div>
    </Card>
  );
}
