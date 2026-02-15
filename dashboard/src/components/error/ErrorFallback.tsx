"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { AlertTriangle, RefreshCcw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
    errorType?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorFallback({
    errorType = "Connection Error",
    message = "Unable to reach AWS AppSync endpoint. The pipeline will resume once connectivity is restored.",
    onRetry,
}: ErrorFallbackProps) {
    return (
        <GlassCard className="p-6" glowColor="rgba(239,68,68,0.15)">
            <div className="flex flex-col items-center text-center">
                <motion.div
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <AlertTriangle className="h-7 w-7 text-red-400" />
                </motion.div>

                <h3 className="text-sm font-semibold text-red-400 mb-1">
                    {errorType}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mb-4">
                    {message}
                </p>

                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        <WifiOff className="h-3 w-3" />
                        Endpoint unreachable
                    </div>
                    <div className="text-[10px] text-zinc-600">
                        ap-south-1 · Mumbai
                    </div>
                </div>

                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="gap-1.5 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                        <RefreshCcw className="h-3.5 w-3.5" />
                        Retry Connection
                    </Button>
                )}
            </div>
        </GlassCard>
    );
}
