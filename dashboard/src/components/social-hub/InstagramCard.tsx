"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

interface InstagramCardProps {
    caption: string;
    hashtags?: string[];
    deliveryStatus: "pending" | "posted" | "live";
}

export function InstagramCard({
    caption,
    hashtags,
    deliveryStatus,
}: InstagramCardProps) {
    return (
        <GlassCard
            className="p-0 overflow-hidden"
            glowColor={
                deliveryStatus === "live" ? "rgba(225,48,108,0.12)" : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-medium text-white">Instagram Reels</p>
                    <p className="text-[10px] text-zinc-400">Reel · 9:16 Format</p>
                </div>
                {deliveryStatus === "live" && (
                    <motion.span
                        className="ml-auto text-[10px] font-semibold text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                    >
                        LIVE
                    </motion.span>
                )}
            </div>

            {/* 9:16 Preview with crop overlay */}
            <div className="mx-3 mt-3 rounded-lg overflow-hidden relative border border-white/5">
                <div className="aspect-[9/16] max-h-44 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-orange-900/20 flex items-center justify-center relative">
                    {/* Crop guide lines */}
                    <div className="absolute inset-0 border-2 border-dashed border-pink-500/20 m-2 rounded" />
                    <div className="absolute top-2 left-2 text-[8px] text-pink-400/60 font-mono bg-black/30 px-1 rounded">
                        9:16
                    </div>
                    <div className="absolute bottom-2 right-2 text-[8px] text-pink-400/60 font-mono bg-black/30 px-1 rounded">
                        1080×1920
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-1">🎬</div>
                        <p className="text-[10px] text-zinc-400">Reel Preview</p>
                    </div>
                </div>
            </div>

            {/* Interaction bar */}
            <div className="flex items-center gap-4 px-4 py-2.5">
                {[Heart, MessageCircle, Send].map((Icon, i) => (
                    <motion.button
                        key={i}
                        className="text-zinc-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Icon className="h-5 w-5" />
                    </motion.button>
                ))}
                <motion.button
                    className="ml-auto text-zinc-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Bookmark className="h-5 w-5" />
                </motion.button>
            </div>

            {/* Caption + hashtags */}
            <div className="px-4 pb-3">
                <p className="text-xs text-zinc-300 leading-relaxed">{caption}</p>
                {hashtags && (
                    <p className="text-xs text-blue-400/70 mt-1">
                        {hashtags.join(" ")}
                    </p>
                )}
            </div>
        </GlassCard>
    );
}
