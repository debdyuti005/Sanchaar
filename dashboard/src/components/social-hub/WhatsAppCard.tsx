"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { Check, CheckCheck } from "lucide-react";

interface WhatsAppCardProps {
    caption: string;
    language: string;
    deliveryStatus: "pending" | "sent" | "delivered" | "read";
}

export function WhatsAppCard({
    caption,
    language,
    deliveryStatus,
}: WhatsAppCardProps) {
    return (
        <GlassCard
            className="p-0 overflow-hidden"
            glowColor={
                deliveryStatus === "delivered" || deliveryStatus === "read"
                    ? "rgba(37,211,102,0.12)"
                    : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5 bg-[#075E54]/20">
                <div className="h-8 w-8 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#25D366]" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-medium text-white">WhatsApp</p>
                    <p className="text-[10px] text-zinc-400">{language} · 1,250 recipients</p>
                </div>
            </div>

            {/* Media placeholder */}
            <div className="mx-3 mt-3 rounded-lg overflow-hidden bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-white/5">
                <div className="aspect-[9/16] max-h-40 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-3xl mb-1">🌿</div>
                        <p className="text-[10px] text-zinc-400">9:16 Preview</p>
                    </div>
                </div>
            </div>

            {/* Message bubble */}
            <div className="px-3 py-2">
                <div className="bg-[#075E54]/30 rounded-lg rounded-tr-none px-3 py-2 border border-[#25D366]/10">
                    <p className="text-xs text-zinc-300 leading-relaxed">{caption}</p>
                    <div className="flex items-center justify-end gap-1 mt-1.5">
                        <span className="text-[10px] text-zinc-500">8:30 PM</span>
                        {/* Animated ticks */}
                        <motion.div className="flex items-center">
                            {deliveryStatus === "pending" ? (
                                <Check className="h-3 w-3 text-zinc-600" />
                            ) : deliveryStatus === "sent" ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <CheckCheck className="h-3 w-3 text-zinc-400" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                >
                                    <CheckCheck className="h-3 w-3 text-[#53BDEB]" />
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
