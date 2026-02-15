"use client";

import { motion } from "framer-motion";
import { useSimulatedPipeline } from "@/hooks/useSimulatedPipeline";
import { ContentTree } from "@/components/content-tree/ContentTree";
import { ProgressFeed } from "@/components/progress-feed/ProgressFeed";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
    PageTransition,
    StaggerContainer,
    staggerItem,
} from "@/components/layout/PageTransition";
import {
    Play,
    RotateCcw,
    Clock,
    DollarSign,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const pipelineSteps = [
    { phase: "listening", label: "Voice Ingestion", description: "Capture and transcribe voice brief", time: "2s", cost: "₹0.50" },
    { phase: "intent-parsing", label: "Intent Parsing", description: "Analyze intent, audience, and tone", time: "1.5s", cost: "₹3.00" },
    { phase: "transcreation", label: "Transcreation", description: "Cultural adaptation to 4 languages", time: "6s", cost: "₹45.00" },
    { phase: "media-processing", label: "Media Processing", description: "Generate 9:16, 1:1, 16:9 formats", time: "5s", cost: "₹62.00" },
    { phase: "quality-validation", label: "Quality Gate", description: "BLEU scoring + semantic validation", time: "2s", cost: "₹12.00" },
    { phase: "distribution", label: "Distribution", description: "Deploy to 3 platforms simultaneously", time: "2s", cost: "₹35.00" },
];

export default function PipelinePage() {
    const { state, isRunning, start, reset } = useSimulatedPipeline();

    const getCurrentStepIndex = () => {
        const idx = pipelineSteps.findIndex((s) => s.phase === state.phase);
        return idx >= 0 ? idx : state.phase === "complete" ? pipelineSteps.length : -1;
    };
    const currentStep = getCurrentStepIndex();

    return (
        <PageTransition>
            <div className="mx-auto max-w-7xl px-6 py-6">
                <StaggerContainer className="flex items-center justify-between mb-6">
                    <motion.div variants={staggerItem}>
                        <h1 className="text-2xl font-bold text-white">Content Pipeline</h1>
                        <p className="text-sm text-zinc-500">
                            Step-by-step orchestration flow
                        </p>
                    </motion.div>
                    <motion.div variants={staggerItem} className="flex gap-2">
                        <Button
                            onClick={start}
                            disabled={isRunning}
                            className="gap-1.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white"
                            size="sm"
                        >
                            <Play className="h-3.5 w-3.5" />
                            Run Pipeline
                        </Button>
                        {state.phase !== "idle" && (
                            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5 border-white/10 text-zinc-400">
                                <RotateCcw className="h-3 w-3" />
                                Reset
                            </Button>
                        )}
                    </motion.div>
                </StaggerContainer>

                {/* Pipeline Steps Timeline */}
                <div className="mb-8">
                    <GlassCard className="p-6">
                        <div className="space-y-0">
                            {pipelineSteps.map((step, i) => {
                                const isActive = state.phase === step.phase;
                                const isComplete = currentStep > i;
                                const isPending = currentStep < i;

                                return (
                                    <motion.div
                                        key={step.phase}
                                        className="flex gap-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                    >
                                        {/* Timeline dot + line */}
                                        <div className="flex flex-col items-center">
                                            <motion.div
                                                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 ${isComplete
                                                        ? "border-emerald-500 bg-emerald-500/20"
                                                        : isActive
                                                            ? "border-violet-500 bg-violet-500/20"
                                                            : "border-white/10 bg-white/[0.02]"
                                                    }`}
                                                animate={isActive ? { scale: [1, 1.15, 1], borderColor: ["#8b5cf6", "#3b82f6", "#8b5cf6"] } : {}}
                                                transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                                            >
                                                {isComplete ? (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                ) : (
                                                    <span className={`text-xs font-bold ${isActive ? "text-violet-400" : "text-zinc-600"}`}>
                                                        {i + 1}
                                                    </span>
                                                )}
                                            </motion.div>
                                            {i < pipelineSteps.length - 1 && (
                                                <div className={`w-0.5 h-12 ${isComplete ? "bg-emerald-500/30" : "bg-white/5"}`} />
                                            )}
                                        </div>

                                        {/* Step content */}
                                        <div className="pb-8 pt-1 min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className={`text-sm font-semibold ${isActive ? "text-white" : isComplete ? "text-zinc-300" : "text-zinc-500"}`}>
                                                        {step.label}
                                                    </h3>
                                                    <p className={`text-xs mt-0.5 ${isActive ? "text-zinc-400" : "text-zinc-600"}`}>
                                                        {step.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {step.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3" />
                                                        {step.cost}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>

                {/* Content Tree + Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7">
                        <ContentTree agents={state.agents} />
                    </div>
                    <div className="lg:col-span-5">
                        <ProgressFeed entries={state.feed} isActive={isRunning} />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
