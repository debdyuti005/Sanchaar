"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { Flame, TrendingUp, ThumbsUp, Share2 } from "lucide-react";

interface ShareChatCardProps {
    caption: string;
    language: string;
    hashtags?: string[];
    deliveryStatus: "pending" | "posted" | "trending";
}

export function ShareChatCard({
    caption,
    language,
    hashtags,
    deliveryStatus,
}: ShareChatCardProps) {
    return (
        <GlassCard
            className="p-0 overflow-hidden"
            glowColor={
                deliveryStatus === "trending" ? "rgba(245,158,11,0.12)" : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5 bg-red-900/10">
                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-red-400">SC</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-white">ShareChat</p>
                    <p className="text-[10px] text-zinc-400">{language} · Regional Feed</p>
                </div>
                {/* Trending Badge */}
                {deliveryStatus === "trending" && (
                    <motion.div
                        className="ml-auto flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full"
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                            delay: 0.2,
                        }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                        >
                            <Flame className="h-3 w-3 text-amber-400" />
                        </motion.div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                            Trending
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Media placeholder */}
            <div className="mx-3 mt-3 rounded-lg overflow-hidden bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-white/5">
                <div className="aspect-[9/16] max-h-40 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-3xl mb-1">📱</div>
                        <p className="text-[10px] text-zinc-400">Regional Content</p>
                    </div>
                </div>
            </div>

            {/* Caption */}
            <div className="px-4 py-3">
                <p className="text-xs text-zinc-300 leading-relaxed">{caption}</p>
                {hashtags && (
                    <p className="text-xs text-red-400/70 mt-1.5">
                        {hashtags.join(" ")}
                    </p>
                )}
            </div>

            {/* Language tag + actions */}
            <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-zinc-400">
                    🌐 {language}
                </span>
                <div className="flex items-center gap-3">
                    {[ThumbsUp, Share2, TrendingUp].map((Icon, i) => (
                        <motion.button
                            key={i}
                            className="text-zinc-500 hover:text-white transition-colors"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Icon className="h-4 w-4" />
                        </motion.button>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
}
