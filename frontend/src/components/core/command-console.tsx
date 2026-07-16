"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Mic, Paperclip, Sparkles, Upload, Waves } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCommandConsole } from "@/hooks/use-command-console";
import { SummaryCards } from "@/components/core/summary-cards";
import { ThinkingSequence } from "@/components/core/thinking-sequence";

type CommandForm = {
  command: string;
  repository: string;
};

export function CommandConsole() {
  const {
    input,
    setInput,
    submit,
    isListening,
    toggleListening,
    latestAnalysis,
    reasoning,
    speechSupported,
    isAnalyzing,
    error,
  } = useCommandConsole();
  const { register, control, handleSubmit, setValue } = useForm<CommandForm>({
    defaultValues: {
      command: input,
      repository: "",
    },
  });
  const [attachedFile, setAttachedFile] = useState<string>("");
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const commandValue = useWatch({ control, name: "command" });

  useEffect(() => {
    setValue("command", input, { shouldDirty: true });
  }, [input, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    await submit(isListening ? "voice" : "text", values.command);
  });

  return (
    <Card
      id="command-console"
      className="overflow-hidden border-white/12 bg-[linear-gradient(180deg,rgba(13,18,38,0.9),rgba(13,18,38,0.74))] p-6 sm:p-8"
    >
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-300/24 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100">
              Voice-first command console
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
              Speech recognition {speechSupported ? "available" : "unsupported in this browser"}
            </span>
          </div>
          <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Tell SwarmGuard what to build. The workforce plan appears instantly.
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Speak, type, upload a brief, or paste a repository. SwarmGuard transforms one command into budget validation, risk analysis, and a complete autonomous workforce.
          </p>
          <form className="mt-7 space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="command-textarea">
                Project command
              </label>
              <Textarea
                id="command-textarea"
                aria-label="Project command"
                {...register("command", {
                  onChange: (event) => setInput(event.target.value),
                })}
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={toggleListening}
                aria-pressed={isListening}
                aria-label={isListening ? "Stop voice capture" : "Start voice capture"}
                className="group relative flex min-h-[128px] min-w-[128px] flex-col items-center justify-center rounded-[28px] border border-cyan-300/18 bg-[radial-gradient(circle_at_top,rgba(110,231,255,0.16),rgba(79,124,255,0.1))] text-cyan-50 shadow-[0_24px_70px_rgba(79,124,255,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <div className="absolute inset-0 rounded-[28px] border border-white/8" />
                <motion.div
                  animate={isListening ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 1.6, repeat: isListening ? Infinity : 0 }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10"
                >
                  <Mic className="h-7 w-7" />
                </motion.div>
                <div className="mt-4 text-sm font-medium">{isListening ? "Listening" : "Voice"}</div>
                <div className="mt-1 text-xs text-cyan-50/68">Primary interaction</div>
                <div className="mt-4 flex gap-1.5">
                  {[0, 1, 2, 3].map((index) => (
                    <motion.span
                      key={index}
                      className="h-6 w-1 rounded-full bg-cyan-200"
                      animate={isListening ? { height: [12, 28, 16] } : { height: 10 }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.8,
                        repeat: isListening ? Infinity : 0,
                      }}
                    />
                  ))}
                </div>
              </motion.button>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto]">
              <Input
                aria-label="GitHub repository"
                placeholder="Paste GitHub repository URL"
                {...register("repository")}
              />
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload brief"
                className="w-full"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
              <Button
                variant="secondary"
                aria-label="Paste GitHub repository from clipboard"
                className="w-full"
                onClick={async () => {
                  if (typeof navigator === "undefined" || !navigator.clipboard) return;
                  const value = await navigator.clipboard.readText();
                  setValue("repository", value, { shouldDirty: true });
                }}
              >
                <GitBranch className="h-4 w-4" />
                Paste Repo
              </Button>
              <Button type="submit" className="w-full" aria-label="Generate workforce">
                <Sparkles className="h-4 w-4" />
                Generate Workforce
              </Button>
            </div>
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setAttachedFile(file?.name ?? "");
              }}
            />
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Waves className="h-4 w-4 text-cyan-200" />
              Live transcription: {commandValue || "Waiting for your brief"}
            </span>
            {attachedFile ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Paperclip className="h-4 w-4 text-cyan-200" />
                Attached: {attachedFile}
              </span>
            ) : null}
          </div>
          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </div>
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/4 p-5">
          <div className="text-xs uppercase tracking-[0.28em] text-white/42">
            Immediate interpretation
          </div>
          <div className="mt-4 text-2xl font-semibold text-white">
            No wizard. No project manager. Just an AI operating system.
          </div>
          <div className="mt-6 space-y-4">
            {[
              [
                "Project summary",
                "Mission scope and outcomes recognized from a single command.",
              ],
              [
                "Budget",
                "Reserve, milestone routing, and replacement headroom resolved upfront.",
              ],
              [
                "Risk analysis",
                "Critical delivery areas receive stricter evaluation and bond policies.",
              ],
              [
                "Required skills",
                "Swarm architecture appears without manual staffing decisions.",
              ],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white">{title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-300">{detail}</div>
              </div>
            ))}
          </div>
          {isAnalyzing ? (
            <div className="mt-6 rounded-2xl border border-cyan-300/14 bg-cyan-300/8 px-4 py-3 text-sm leading-6 text-cyan-50">
              SwarmGuard is converting your brief into budget, roles, milestones, and
              performance bonds.
            </div>
          ) : null}
        </div>
      </div>
      {latestAnalysis ? (
        <div className="mt-8 space-y-6">
          <ThinkingSequence phases={reasoning} riskHeadline={latestAnalysis.riskHeadline} />
          <SummaryCards cards={latestAnalysis.summaryCards} />
        </div>
      ) : null}
    </Card>
  );
}
