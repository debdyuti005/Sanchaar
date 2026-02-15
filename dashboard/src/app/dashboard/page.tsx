"use client";

import { motion } from "framer-motion";
import { useSimulatedPipeline } from "@/hooks/useSimulatedPipeline";
import { CommandCenter } from "@/components/command-center/CommandCenter";
import { ContentTree } from "@/components/content-tree/ContentTree";
import { ProgressFeed } from "@/components/progress-feed/ProgressFeed";
import { GlassCard } from "@/components/shared/GlassCard";
import {
    PageTransition,
    StaggerContainer,
    staggerItem,
} from "@/components/layout/PageTransition";
import {
    RotateCcw,
    Zap,
    Clock,
    DollarSign,
    Languages,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const quickStats = [
    { icon: Activity, label: "Pipeline Runs", value: "247", change: "+12%", color: "text-violet-400" },
    { icon: Languages, label: "Languages", value: "4", change: "Active", color: "text-cyan-400" },
    { icon: DollarSign, label: "Avg. Cost", value: "₹157", change: "-8%", color: "text-emerald-400" },
    { icon: Clock, label: "Avg. Time", value: "18.5s", change: "-15%", color: "text-amber-400" },
];

export default function DashboardPage() {
    const { state, isRunning, start, reset } = useSimulatedPipeline();

    return (
        <PageTransition>
            <div className="mx-auto max-w-7xl px-6 py-6">
                {/* Header */}
                <StaggerContainer className="flex items-center justify-between mb-6">
                    <motion.div variants={staggerItem}>
                        <h1 className="text-2xl font-bold text-white">Command Center</h1>
                        <p className="text-sm text-zinc-500">
                            Voice-driven pipeline orchestration
                        </p>
                    </motion.div>
                    <motion.div variants={staggerItem} className="flex items-center gap-3">
                        {state.phase !== "idle" && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={reset}
                                className="gap-1.5 h-8 text-xs border-white/10 text-zinc-400 hover:text-white"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Reset
                            </Button>
                        )}
                    </motion.div>
                </StaggerContainer>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {quickStats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <GlassCard className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                    <span className="text-[10px] text-emerald-400 font-medium">
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="text-xl font-bold text-white">{stat.value}</p>
                                <p className="text-[11px] text-zinc-500">{stat.label}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-8 space-y-6">
                        <CommandCenter
                            phase={state.phase}
                            transcript={state.voiceTranscript}
                            onActivate={start}
                            isRunning={isRunning}
                        />

                        {/* Mini Content Tree Preview */}
                        <ContentTree agents={state.agents} />
                    </div>

                    {/* Right column: Progress Feed */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-20">
                            <ProgressFeed entries={state.feed} isActive={isRunning} />
                        </div>
                    </div>
                </div>

                {/* Pipeline Complete Stats */}
                {state.phase === "complete" && (
                    <motion.div
                        className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-400" />
                                <span className="text-sm font-medium text-white">
                                    Pipeline Complete
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
                                <span><strong className="text-zinc-200">4</strong> languages</span>
                                <span><strong className="text-zinc-200">3</strong> platforms</span>
                                <span><strong className="text-zinc-200">3</strong> aspect ratios</span>
                                <span>Cost: <strong className="text-emerald-400">₹157 ($1.85)</strong></span>
                                <span>Time: <strong className="text-zinc-200">18.5s</strong></span>
                                <Link href="/distribution" className="text-violet-400 hover:text-violet-300 font-medium">
                                    View Distribution →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </PageTransition>
    );
}
