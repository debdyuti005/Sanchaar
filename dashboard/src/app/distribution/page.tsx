"use client";

import { motion } from "framer-motion";
import { useSimulatedPipeline } from "@/hooks/useSimulatedPipeline";
import { SocialHub } from "@/components/social-hub/SocialHub";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedBarChart } from "@/components/charts/AnimatedChart";
import {
    PageTransition,
    StaggerContainer,
    staggerItem,
} from "@/components/layout/PageTransition";
import { Play, RotateCcw, TrendingUp, Users, Eye, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const platformStats = [
    { label: "WhatsApp", value: 12500, color: "#25D366" },
    { label: "Instagram", value: 8700, color: "#E1306C" },
    { label: "ShareChat", value: 15200, color: "#EF4444" },
];

const reachStats = [
    { icon: Users, label: "Total Reach", value: "36.4K", color: "text-blue-400" },
    { icon: Eye, label: "Impressions", value: "98.7K", color: "text-violet-400" },
    { icon: Share2, label: "Shares", value: "4.2K", color: "text-emerald-400" },
    { icon: TrendingUp, label: "Engagement", value: "8.3%", color: "text-amber-400" },
];

const deliveryTimeline = [
    { time: "0s", event: "Pipeline triggered", platform: "all" },
    { time: "12s", event: "Content ready for distribution", platform: "all" },
    { time: "14s", event: "WhatsApp broadcast initiated", platform: "whatsapp" },
    { time: "15s", event: "Instagram Reel uploaded", platform: "instagram" },
    { time: "16s", event: "ShareChat post published", platform: "sharechat" },
    { time: "18s", event: "WhatsApp delivered (blue ticks)", platform: "whatsapp" },
    { time: "22s", event: "ShareChat trending in regional feed", platform: "sharechat" },
];

export default function DistributionPage() {
    const { state, isRunning, start, reset } = useSimulatedPipeline();

    return (
        <PageTransition>
            <div className="mx-auto max-w-7xl px-6 py-6">
                <StaggerContainer className="flex items-center justify-between mb-6">
                    <motion.div variants={staggerItem}>
                        <h1 className="text-2xl font-bold text-white">Distribution Hub</h1>
                        <p className="text-sm text-zinc-500">
                            Multi-platform content delivery & analytics
                        </p>
                    </motion.div>
                    <motion.div variants={staggerItem} className="flex gap-2">
                        <Button
                            onClick={start}
                            disabled={isRunning}
                            size="sm"
                            className="gap-1.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                        >
                            <Play className="h-3.5 w-3.5" />
                            Simulate Delivery
                        </Button>
                        {state.phase !== "idle" && (
                            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5 border-white/10 text-zinc-400">
                                <RotateCcw className="h-3 w-3" />
                            </Button>
                        )}
                    </motion.div>
                </StaggerContainer>

                {/* Reach Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {reachStats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <GlassCard className="p-4">
                                <stat.icon className={`h-4 w-4 ${stat.color} mb-2`} />
                                <p className="text-xl font-bold text-white">{stat.value}</p>
                                <p className="text-[11px] text-zinc-500">{stat.label}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Social Hub cards */}
                <div className="mb-6">
                    <SocialHub socialDelivery={state.socialDelivery} />
                </div>

                {/* Platform Reach + Delivery Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Platform Reach Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <GlassCard className="p-5">
                            <h3 className="text-sm font-semibold text-white mb-4">Platform Reach</h3>
                            <AnimatedBarChart data={platformStats} />
                        </GlassCard>
                    </motion.div>

                    {/* Delivery Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <GlassCard className="p-5">
                            <h3 className="text-sm font-semibold text-white mb-4">Delivery Timeline</h3>
                            <div className="space-y-0">
                                {deliveryTimeline.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex gap-3"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.08 }}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="h-2 w-2 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                            {i < deliveryTimeline.length - 1 && (
                                                <div className="w-px flex-1 bg-white/5" />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-zinc-500 font-mono">{item.time}</span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${item.platform === "whatsapp" ? "bg-green-500/10 text-green-400" :
                                                        item.platform === "instagram" ? "bg-pink-500/10 text-pink-400" :
                                                            item.platform === "sharechat" ? "bg-red-500/10 text-red-400" :
                                                                "bg-zinc-500/10 text-zinc-400"
                                                    }`}>
                                                    {item.platform}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-300 mt-0.5">{item.event}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
