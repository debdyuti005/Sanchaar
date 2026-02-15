"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FeedEntry, AgentName } from "@/types/pipeline";
import { Brain, Languages, Film, Share2 } from "lucide-react";

const agentMeta: Record<
    AgentName,
    { icon: React.ElementType; color: string; bgColor: string; initials: string }
> = {
    supervisor: { icon: Brain, color: "text-violet-400", bgColor: "bg-violet-500/20", initials: "SU" },
    transcreation: { icon: Languages, color: "text-cyan-400", bgColor: "bg-cyan-500/20", initials: "TC" },
    "media-factory": { icon: Film, color: "text-amber-400", bgColor: "bg-amber-500/20", initials: "MF" },
    "platform-strategy": { icon: Share2, color: "text-emerald-400", bgColor: "bg-emerald-500/20", initials: "PS" },
};

const typeColors: Record<string, string> = {
    thought: "border-l-zinc-500/40",
    action: "border-l-blue-500/40",
    result: "border-l-emerald-500/40",
    error: "border-l-red-500/40",
};

export function FeedEntryComponent({ entry }: { entry: FeedEntry }) {
    const meta = agentMeta[entry.agent];

    return (
        <motion.div
            className={cn(
                "flex gap-3 px-4 py-3 border-l-2 hover:bg-white/[0.02] transition-colors",
                typeColors[entry.type]
            )}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Agent avatar */}
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    meta.bgColor
                )}
            >
                <meta.icon className={cn("h-4 w-4", meta.color)} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn("text-xs font-medium", meta.color)}>
                        {entry.agent === "media-factory"
                            ? "Media Factory"
                            : entry.agent === "platform-strategy"
                                ? "Platform Strategy"
                                : entry.agent.charAt(0).toUpperCase() + entry.agent.slice(1)}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                        {entry.timestamp.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </span>
                </div>
                <motion.p
                    className="text-sm text-zinc-300 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {entry.message}
                </motion.p>
            </div>
        </motion.div>
    );
}
