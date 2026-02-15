"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { AgentStatus } from "@/types/pipeline";

const statusConfig: Record<
    AgentStatus,
    { label: string; color: string; bgColor: string; dotColor: string }
> = {
    idle: {
        label: "Idle",
        color: "text-zinc-400",
        bgColor: "bg-zinc-400/10",
        dotColor: "bg-zinc-500",
    },
    processing: {
        label: "Thinking…",
        color: "text-amber-400",
        bgColor: "bg-amber-400/10",
        dotColor: "bg-amber-400",
    },
    complete: {
        label: "✓ Complete",
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
        dotColor: "bg-emerald-400",
    },
    error: {
        label: "✗ Error",
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        dotColor: "bg-red-400",
    },
};

export function StatusBadge({
    status,
    className,
}: {
    status: AgentStatus;
    className?: string;
}) {
    const config = statusConfig[status];
    return (
        <motion.span
            layout
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                config.bgColor,
                config.color,
                className
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
            <motion.span
                className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)}
                animate={
                    status === "processing"
                        ? { opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }
                        : {}
                }
                transition={
                    status === "processing"
                        ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                        : {}
                }
            />
            {config.label}
        </motion.span>
    );
}
