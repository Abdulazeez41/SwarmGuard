"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { swarmguardApi } from "@/lib/api/swarmguard";
import { CommandAnalysisResponse } from "@/lib/types";
import { useUiStore } from "@/store/ui-store";

type SpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionResult = {
  isFinal: boolean;
  length: number;
  item: (index: number) => SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
};

type SpeechRecognitionResultList = {
  length: number;
  item: (index: number) => SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
};

type SpeechRecognitionEventLike = {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
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

export function useCommandConsole(
  initialCommand = "",
  onCommandSubmitted?: () => void,
) {
  const queryClient = useQueryClient();
  const setHasAnalyzed = useUiStore((state) => state.setHasAnalyzed);
  const [input, setInput] = useState(initialCommand);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialCommand);
  const [latestAnalysis, setLatestAnalysis] =
    useState<CommandAnalysisResponse | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(
    null,
  );
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef<string>("");
  const mutation = useMutation({
    mutationFn: swarmguardApi.analyzeCommand,
    onSuccess: async (data) => {
      setTranscript(data.transcript);
      setLatestAnalysis(data);
      setHasAnalyzed(true);
      await queryClient.invalidateQueries({ queryKey: ["snapshot"] });
      onCommandSubmitted?.();
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const frame = window.requestAnimationFrame(() => {
      setSpeechSupported(getSpeechSupport());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const resetSilenceTimer = (
    recognition: InstanceType<SpeechRecognitionCtor>,
  ) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      try {
        recognition.stop();
      } catch {
        // Already stopped
      }
    }, 2500); // 2.5 seconds of silence
  };

  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setIsListening(false);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Already stopped
        }
      }
      setIsListening(false);
      return;
    }

    // Start new recognition session
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;
    finalTranscriptRef.current = "";

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let interimTranscript = "";

      // Process results from resultIndex onwards
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const alternative = result[0];
        const transcriptPiece = alternative?.transcript ?? "";

        if (result.isFinal) {
          // Accumulate final transcripts
          finalTranscriptRef.current += transcriptPiece + " ";
          resetSilenceTimer(recognition);
        } else {
          // Build interim transcript for live display
          interimTranscript += transcriptPiece;
        }
      }

      // Update input with combined final + interim transcripts
      const combined = (finalTranscriptRef.current + interimTranscript).trim();
      if (combined) {
        setInput(combined);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      // Don't stop on recoverable errors like "no-speech" or "aborted"
      if (event.error !== "no-speech" && event.error !== "aborted") {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
      setIsListening(true);
      resetSilenceTimer(recognition);
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setIsListening(false);
    }
  };

  const submit = async (source: "voice" | "text", commandOverride?: string) => {
    const command = commandOverride ?? input;
    setInput(command);
    await mutation.mutateAsync({ command, source });
  };

  const reasoning = useMemo(
    () => latestAnalysis?.reasoning ?? [],
    [latestAnalysis],
  );
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Already stopped
        }
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);
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
