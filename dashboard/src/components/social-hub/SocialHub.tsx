"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { WhatsAppCard } from "./WhatsAppCard";
import { InstagramCard } from "./InstagramCard";
import { ShareChatCard } from "./ShareChatCard";
import { socialPreviews } from "@/lib/mock-data";
import type { PipelineState } from "@/types/pipeline";
import { Smartphone } from "lucide-react";

interface SocialHubProps {
    socialDelivery: PipelineState["socialDelivery"];
}

export function SocialHub({ socialDelivery }: SocialHubProps) {
    const waPreview = socialPreviews.find((p) => p.platform === "whatsapp")!;
    const igPreview = socialPreviews.find((p) => p.platform === "instagram")!;
    const scPreview = socialPreviews.find((p) => p.platform === "sharechat")!;

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Smartphone className="h-4 w-4 text-zinc-400" />
                <h2 className="text-lg font-semibold text-white">Social Media Hub</h2>
                <span className="text-xs text-zinc-500 ml-auto">Live Previews</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                >
                    <WhatsAppCard
                        caption={waPreview.caption}
                        language={waPreview.language}
                        deliveryStatus={socialDelivery.whatsapp}
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <InstagramCard
                        caption={igPreview.caption}
                        hashtags={igPreview.hashtags}
                        deliveryStatus={socialDelivery.instagram}
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <ShareChatCard
                        caption={scPreview.caption}
                        language={scPreview.language}
                        hashtags={scPreview.hashtags}
                        deliveryStatus={socialDelivery.sharechat}
                    />
                </motion.div>
            </div>
        </div>
    );
}
