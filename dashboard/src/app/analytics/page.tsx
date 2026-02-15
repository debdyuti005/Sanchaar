"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import {
    AnimatedBarChart,
    DonutChart,
    AnimatedLineChart,
} from "@/components/charts/AnimatedChart";
import {
    PageTransition,
    StaggerContainer,
    staggerItem,
} from "@/components/layout/PageTransition";
import {
    Activity,
    DollarSign,
    Gauge,
    Languages,
    TrendingUp,
    Zap,
    Clock,
    CheckCircle2,
} from "lucide-react";

const metricCards = [
    { icon: Activity, label: "Pipeline Runs", value: 247, suffix: "", color: "text-violet-400", change: "+12% this week" },
    { icon: DollarSign, label: "Total Cost", value: 38793, prefix: "₹", color: "text-emerald-400", change: "₹157 avg per run" },
    { icon: Gauge, label: "Quality Score", value: 96, suffix: "%", color: "text-cyan-400", change: "Above 95% threshold" },
    { icon: Languages, label: "Languages", value: 4, suffix: "", color: "text-amber-400", change: "Hi, Ta, Te, Mr" },
];

const costSegments = [
    { label: "Transcreation", value: 45, color: "#06b6d4" },
    { label: "Media Processing", value: 62, color: "#f59e0b" },
    { label: "Distribution", value: 35, color: "#10b981" },
    { label: "Orchestration", value: 15, color: "#8b5cf6" },
];

const pipelinePerformance = [18.5, 17.2, 19.1, 16.8, 18.0, 15.5, 17.0, 14.8, 16.2, 15.0, 14.5, 13.8];

const agentPerformance = [
    { label: "Supervisor", value: 99.1, color: "#8b5cf6" },
    { label: "Transcreation", value: 96.5, color: "#06b6d4" },
    { label: "Media Factory", value: 98.2, color: "#f59e0b" },
    { label: "Platform Strategy", value: 97.8, color: "#10b981" },
];

const qualityMetrics = [
    { label: "BLEU Score", value: 0.87, color: "#8b5cf6" },
    { label: "Semantic Similarity", value: 0.94, color: "#06b6d4" },
    { label: "Cultural Accuracy", value: 0.91, color: "#f59e0b" },
    { label: "Fluency", value: 0.96, color: "#10b981" },
    { label: "Grammar", value: 0.98, color: "#3b82f6" },
];

export default function AnalyticsPage() {
    return (
        <PageTransition>
            <div className="mx-auto max-w-7xl px-6 py-6">
                <StaggerContainer className="mb-6">
                    <motion.div variants={staggerItem}>
                        <h1 className="text-2xl font-bold text-white">Analytics & Monitoring</h1>
                        <p className="text-sm text-zinc-500">
                            Performance metrics and cost tracking
                        </p>
                    </motion.div>
                </StaggerContainer>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {metricCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <GlassCard className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <card.icon className={`h-4 w-4 ${card.color}`} />
                                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                                </div>
                                <AnimatedCounter
                                    target={card.value}
                                    prefix={card.prefix}
                                    suffix={card.suffix}
                                    className="text-2xl font-bold text-white block"
                                />
                                <p className="text-[10px] text-zinc-500 mt-1">{card.change}</p>
                                <p className="text-[11px] text-zinc-400 mt-0.5">{card.label}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Pipeline Performance Line Chart */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <GlassCard className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Pipeline Performance</h3>
                                    <p className="text-[10px] text-zinc-500">Avg. execution time (seconds) — last 12 runs</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                    <TrendingUp className="h-3 w-3" />
                                    25% faster
                                </div>
                            </div>
                            <AnimatedLineChart
                                points={pipelinePerformance}
                                width={600}
                                height={180}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-3 text-[10px] text-zinc-600">
                                {pipelinePerformance.map((_, i) => (
                                    <span key={i}>R{i + 1}</span>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Cost Breakdown Donut */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <GlassCard className="p-5 flex flex-col items-center">
                            <h3 className="text-sm font-semibold text-white self-start mb-4">Cost Breakdown</h3>
                            <DonutChart segments={costSegments} size={160} />
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full">
                                {costSegments.map((seg) => (
                                    <div key={seg.label} className="flex items-center gap-2">
                                        <span
                                            className="h-2 w-2 rounded-full shrink-0"
                                            style={{ backgroundColor: seg.color }}
                                        />
                                        <span className="text-[10px] text-zinc-400 truncate">{seg.label}</span>
                                        <span className="text-[10px] text-zinc-300 ml-auto">₹{seg.value}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Agent Accuracy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <GlassCard className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">Agent Accuracy</h3>
                            </div>
                            <AnimatedBarChart
                                data={agentPerformance}
                                maxValue={100}
                            />
                        </GlassCard>
                    </motion.div>

                    {/* Quality Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <GlassCard className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Gauge className="h-4 w-4 text-cyan-400" />
                                <h3 className="text-sm font-semibold text-white">Quality Metrics</h3>
                            </div>
                            {/* Radar-style display as labeled bars */}
                            <div className="space-y-3">
                                {qualityMetrics.map((metric, i) => (
                                    <div key={metric.label}>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-zinc-400">{metric.label}</span>
                                            <span className="text-zinc-200 font-medium">{(metric.value * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: metric.color }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${metric.value * 100}%` }}
                                                transition={{ duration: 1.2, delay: 0.6 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
