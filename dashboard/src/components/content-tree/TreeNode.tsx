"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { AgentNode } from "@/types/pipeline";
import {
    Brain,
    Languages,
    Film,
    Share2,
    type LucideIcon,
} from "lucide-react";

const agentIcons: Record<string, LucideIcon> = {
    supervisor: Brain,
    transcreation: Languages,
    "media-factory": Film,
    "platform-strategy": Share2,
};

const agentColors: Record<string, { ring: string; glow: string }> = {
    supervisor: { ring: "border-violet-500", glow: "rgba(139,92,246,0.5)" },
    transcreation: { ring: "border-cyan-500", glow: "rgba(6,182,212,0.5)" },
    "media-factory": { ring: "border-amber-500", glow: "rgba(245,158,11,0.5)" },
    "platform-strategy": { ring: "border-emerald-500", glow: "rgba(16,185,129,0.5)" },
};

export function TreeNode({ node }: { node: AgentNode }) {
    const Icon = agentIcons[node.id] ?? Brain;
    const colors = agentColors[node.id];
    const isProcessing = node.status === "processing";
    const isComplete = node.status === "complete";
    const isError = node.status === "error";

    return (
        <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            {/* Outer glow ring */}
            <div className="relative">
                {isProcessing && (
                    <motion.div
                        className={cn(
                            "absolute -inset-2 rounded-full border-2",
                            colors.ring
                        )}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.15, 0.6] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}
                {isComplete && (
                    <motion.div
                        className="absolute -inset-2 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ boxShadow: `0 0 20px ${colors.glow}` }}
                    />
                )}
                {isError && (
                    <motion.div
                        className="absolute -inset-2 rounded-full border-2 border-red-500"
                        animate={{ x: [-2, 2, -2, 2, 0] }}
                        transition={{ duration: 0.4, repeat: 2 }}
                        style={{ boxShadow: "0 0 20px rgba(239,68,68,0.5)" }}
                    />
                )}

                {/* Node circle */}
                <motion.div
                    className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-full border bg-white/[0.05] backdrop-blur-lg",
                        isComplete
                            ? "border-emerald-500/50"
                            : isProcessing
                                ? colors.ring + "/50"
                                : isError
                                    ? "border-red-500/50"
                                    : "border-white/10"
                    )}
                    animate={
                        isProcessing
                            ? { borderColor: ["rgba(255,255,255,0.1)", colors.glow, "rgba(255,255,255,0.1)"] }
                            : {}
                    }
                    transition={isProcessing ? { duration: 2, repeat: Infinity } : {}}
                >
                    <Icon
                        className={cn(
                            "h-6 w-6",
                            isComplete
                                ? "text-emerald-400"
                                : isProcessing
                                    ? "text-white"
                                    : isError
                                        ? "text-red-400"
                                        : "text-zinc-500"
                        )}
                    />
                </motion.div>
            </div>

            {/* Label */}
            <div className="mt-3 text-center max-w-[120px]">
                <p className="text-xs font-medium text-zinc-200 leading-tight">
                    {node.label}
                </p>
                <StatusBadge status={node.status} className="mt-1.5" />
            </div>
        </motion.div>
    );
}
