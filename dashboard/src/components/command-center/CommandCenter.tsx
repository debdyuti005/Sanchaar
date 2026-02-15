"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useAudioVisualizer } from "@/hooks/useAudioVisualizer";
import type { PipelinePhase } from "@/types/pipeline";

interface CommandCenterProps {
    phase: PipelinePhase;
    transcript: string;
    onActivate: () => void;
    isRunning: boolean;
}

const phaseLabels: Partial<Record<PipelinePhase, string>> = {
    idle: "Tap to speak your command",
    listening: "Listening…",
    "intent-parsing": "Parsing intent…",
    transcreation: "Transcreating content…",
    "media-processing": "Processing media…",
    "quality-validation": "Validating quality…",
    distribution: "Distributing…",
    complete: "Pipeline complete ✓",
};

export function CommandCenter({
    phase,
    transcript,
    onActivate,
    isRunning,
}: CommandCenterProps) {
    const isListening = phase === "listening";
    const isActive = phase !== "idle" && phase !== "complete";
    const { canvasRef } = useAudioVisualizer(isListening);

    return (
        <GlassCard
            className="p-6"
            glowColor={
                isListening
                    ? "rgba(139, 92, 246, 0.3)"
                    : isActive
                        ? "rgba(59, 130, 246, 0.2)"
                        : phase === "complete"
                            ? "rgba(16, 185, 129, 0.2)"
                            : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-semibold text-white">Command Center</h2>
                    <p className="text-sm text-zinc-400 mt-0.5">Voice-First Interface</p>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`h-2 w-2 rounded-full ${isActive
                                ? "bg-blue-400 animate-pulse"
                                : phase === "complete"
                                    ? "bg-emerald-400"
                                    : "bg-zinc-600"
                            }`}
                    />
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                        {phase === "idle" ? "Ready" : phase === "complete" ? "Done" : "Active"}
                    </span>
                </div>
            </div>

            {/* Voice Button */}
            <div className="flex flex-col items-center mb-5">
                <div className="relative">
                    {/* Pulse rings */}
                    <AnimatePresence>
                        {(isListening || isActive) && (
                            <>
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-violet-500/30"
                                    initial={{ scale: 1, opacity: 0.6 }}
                                    animate={{ scale: 1.8, opacity: 0 }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                    }}
                                />
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-blue-500/20"
                                    initial={{ scale: 1, opacity: 0.4 }}
                                    animate={{ scale: 2.2, opacity: 0 }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                        delay: 0.5,
                                    }}
                                />
                            </>
                        )}
                    </AnimatePresence>

                    {/* Main button */}
                    <motion.button
                        onClick={onActivate}
                        disabled={isRunning}
                        className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-violet-600/80 to-blue-600/80 text-white shadow-lg backdrop-blur-sm disabled:opacity-70 cursor-pointer"
                        whileHover={!isRunning ? { scale: 1.08 } : {}}
                        whileTap={!isRunning ? { scale: 0.95 } : {}}
                        animate={
                            isListening
                                ? {
                                    boxShadow: [
                                        "0 0 20px rgba(139,92,246,0.4)",
                                        "0 0 40px rgba(139,92,246,0.6)",
                                        "0 0 20px rgba(139,92,246,0.4)",
                                    ],
                                }
                                : {}
                        }
                        transition={
                            isListening
                                ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                                : { type: "spring", stiffness: 400, damping: 25 }
                        }
                    >
                        {phase === "idle" ? (
                            <Mic className="h-8 w-8" />
                        ) : phase === "complete" ? (
                            <CheckCircle2 className="h-8 w-8 text-emerald-300" />
                        ) : isListening ? (
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            >
                                <Mic className="h-8 w-8" />
                            </motion.div>
                        ) : (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        )}
                    </motion.button>
                </div>

                <motion.p
                    className="mt-4 text-sm text-zinc-400 text-center"
                    key={phase}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {phaseLabels[phase]}
                </motion.p>
            </div>

            {/* Wave Visualizer */}
            <div className="mb-4 rounded-xl overflow-hidden border border-white/5 bg-black/20 p-1">
                <canvas
                    ref={canvasRef}
                    width={480}
                    height={80}
                    className="w-full h-16"
                />
            </div>

            {/* Transcript */}
            <AnimatePresence mode="wait">
                {transcript && (
                    <motion.div
                        className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                            Transcript
                        </p>
                        <motion.p
                            className="text-sm text-zinc-300 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            &ldquo;{transcript}&rdquo;
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}
