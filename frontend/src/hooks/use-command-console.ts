"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { swarmguardApi } from "@/lib/api/swarmguard";
import { commandExample } from "@/lib/mock-data";
import { CommandAnalysisResponse } from "@/lib/types";

type SpeechRecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

function getSpeechSupport() {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function useCommandConsole() {
  const [input, setInput] = useState(commandExample);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(commandExample);
  const [latestAnalysis, setLatestAnalysis] = useState<CommandAnalysisResponse | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  const mutation = useMutation({
    mutationFn: swarmguardApi.analyzeCommand,
    onSuccess: (data) => {
      setTranscript(data.transcript);
      setLatestAnalysis(data);
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const frame = window.requestAnimationFrame(() => {
      setSpeechSupported(getSpeechSupport());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setIsListening(false);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const combined = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      setInput(combined);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const submit = async (source: "voice" | "text", commandOverride?: string) => {
    const command = commandOverride ?? input;
    setInput(command);
    await mutation.mutateAsync({ command, source });
  };

  const reasoning = useMemo(() => latestAnalysis?.reasoning ?? [], [latestAnalysis]);

  return {
    input,
    setInput,
    submit,
    isListening,
    toggleListening,
    transcript,
    latestAnalysis,
    reasoning,
    speechSupported,
    isAnalyzing: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
