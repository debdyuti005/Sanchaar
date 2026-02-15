"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { FeedEntryComponent } from "./FeedEntry";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FeedEntry } from "@/types/pipeline";
import { Activity } from "lucide-react";

interface ProgressFeedProps {
    entries: FeedEntry[];
    isActive: boolean;
}

export function ProgressFeed({ entries, isActive }: ProgressFeedProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [entries.length]);

    return (
        <GlassCard
            className="flex flex-col h-full"
            glowColor={isActive ? "rgba(139,92,246,0.08)" : undefined}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-violet-400" />
                    <h2 className="text-sm font-semibold text-white">Agent Thought Process</h2>
                </div>
                <div className="flex items-center gap-1.5">
                    <motion.div
                        className={`h-2 w-2 rounded-full ${isActive ? "bg-violet-400" : "bg-zinc-600"
                            }`}
                        animate={isActive ? { opacity: [1, 0.3, 1] } : {}}
                        transition={isActive ? { duration: 1.2, repeat: Infinity } : {}}
                    />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        {isActive ? "Live" : entries.length > 0 ? "Done" : "Waiting"}
                    </span>
                </div>
            </div>

            {/* Feed */}
            <ScrollArea className="flex-1 max-h-[500px]">
                <div className="py-2">
                    <AnimatePresence mode="popLayout">
                        {entries.length === 0 ? (
                            <motion.div
                                className="flex flex-col items-center justify-center py-12 text-zinc-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Activity className="h-8 w-8 mb-3 opacity-30" />
                                <p className="text-sm">Awaiting pipeline activation…</p>
                            </motion.div>
                        ) : (
                            entries.map((entry) => (
                                <FeedEntryComponent key={entry.id} entry={entry} />
                            ))
                        )}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Footer stats */}
            {entries.length > 0 && (
                <motion.div
                    className="border-t border-white/5 px-5 py-3 flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        {entries.length} events
                    </span>
                    <span className="text-[10px] text-zinc-500">
                        Bedrock · Claude 3.5 Sonnet
                    </span>
                </motion.div>
            )}
        </GlassCard>
    );
}
