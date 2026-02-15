"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import {
    PageTransition,
    StaggerContainer,
    staggerItem,
} from "@/components/layout/PageTransition";
import { Brain, Languages, Film, Share2, Sparkles, Cpu, Database, Gauge } from "lucide-react";

const NeuralNetwork = dynamic(
    () => import("@/components/3d/NeuralNetwork").then((m) => m.NeuralNetwork),
    { ssr: false }
);

const agents = [
    {
        id: "supervisor",
        label: "Supervisor Agent",
        icon: Brain,
        color: "from-violet-500 to-purple-600",
        glowColor: "rgba(139,92,246,0.12)",
        textColor: "text-violet-400",
        description: "Central orchestration and quality gatekeeper for the entire content pipeline.",
        capabilities: ["Intent parsing", "Task delegation", "Quality validation", "Error recovery"],
        model: "Claude 3.5 Sonnet",
        metrics: { latency: "1.2s", accuracy: "99.1%", cost: "₹3.00/call" },
    },
    {
        id: "transcreation",
        label: "Transcreation Agent",
        icon: Languages,
        color: "from-cyan-500 to-teal-600",
        glowColor: "rgba(6,182,212,0.12)",
        textColor: "text-cyan-400",
        description: "Context-aware cultural adaptation across Hindi, Tamil, Telugu, and Marathi.",
        capabilities: ["RAG knowledge base", "Semantic analysis", "Cultural adaptation", "BLEU scoring"],
        model: "Claude 3.5 Sonnet + RAG",
        metrics: { latency: "3.8s", accuracy: "96.5%", cost: "₹45.00/batch" },
    },
    {
        id: "media-factory",
        label: "Media Factory Agent",
        icon: Film,
        color: "from-amber-500 to-orange-600",
        glowColor: "rgba(245,158,11,0.12)",
        textColor: "text-amber-400",
        description: "Multi-format media production: 9:16, 1:1, 16:9 with subtitles and thumbnails.",
        capabilities: ["Aspect ratio conversion", "Subtitle generation", "Thumbnail creation", "Content analysis"],
        model: "MediaConvert + Rekognition",
        metrics: { latency: "4.5s", accuracy: "98.2%", cost: "₹62.00/batch" },
    },
    {
        id: "platform-strategy",
        label: "Platform Strategy Agent",
        icon: Share2,
        color: "from-emerald-500 to-green-600",
        glowColor: "rgba(16,185,129,0.12)",
        textColor: "text-emerald-400",
        description: "Platform-aware distribution across WhatsApp, Instagram, and ShareChat.",
        capabilities: ["Optimal scheduling", "Hashtag strategy", "A/B testing", "Rate limit handling"],
        model: "Claude 3.5 Sonnet",
        metrics: { latency: "1.8s", accuracy: "97.8%", cost: "₹35.00/batch" },
    },
];

export default function AgentsPage() {
    const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

    return (
        <PageTransition>
            <div className="mx-auto max-w-7xl px-6 py-6">
                <StaggerContainer className="mb-8">
                    <motion.div variants={staggerItem}>
                        <h1 className="text-2xl font-bold text-white">Agent Intelligence</h1>
                        <p className="text-sm text-zinc-500">
                            Four specialized AI agents collaborating autonomously
                        </p>
                    </motion.div>
                </StaggerContainer>

                {/* 3D Neural Network */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <GlassCard className="p-0 overflow-hidden" glowColor="rgba(139,92,246,0.06)">
                        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-violet-400" />
                                <span className="text-sm font-medium text-white">Neural Network Visualization</span>
                            </div>
                            <span className="text-[10px] text-zinc-500">Interactive · Hover agents below</span>
                        </div>
                        <NeuralNetwork
                            activeAgent={hoveredAgent}
                            className="h-[300px] w-full"
                        />
                    </GlassCard>
                </motion.div>

                {/* Agent Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agents.map((agent, i) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            onMouseEnter={() => setHoveredAgent(agent.id)}
                            onMouseLeave={() => setHoveredAgent(null)}
                        >
                            <GlassCard
                                className="p-5 h-full group cursor-default"
                                glowColor={hoveredAgent === agent.id ? agent.glowColor : undefined}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <motion.div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${agent.color} text-white shadow-lg`}
                                        whileHover={{ rotate: 5, scale: 1.1 }}
                                    >
                                        <agent.icon className="h-6 w-6" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white group-hover:text-violet-300 transition-colors">
                                            {agent.label}
                                        </h3>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            {agent.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Capabilities */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {agent.capabilities.map((cap) => (
                                        <span
                                            key={cap}
                                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-400"
                                        >
                                            {cap}
                                        </span>
                                    ))}
                                </div>

                                {/* Model + Metrics */}
                                <div className="border-t border-white/5 pt-3">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <Cpu className="h-3 w-3 text-zinc-500" />
                                        <span className="text-[10px] text-zinc-500">{agent.model}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-200">{agent.metrics.latency}</p>
                                            <p className="text-[10px] text-zinc-600">Latency</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-emerald-400">{agent.metrics.accuracy}</p>
                                            <p className="text-[10px] text-zinc-600">Accuracy</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-200">{agent.metrics.cost}</p>
                                            <p className="text-[10px] text-zinc-600">Cost</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageTransition>
    );
}
