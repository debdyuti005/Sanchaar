"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    glowColor?: string;
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({
    glowColor,
    children,
    className,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                "relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden",
                className
            )}
            style={
                glowColor
                    ? {
                        boxShadow: `0 0 30px -5px ${glowColor}, inset 0 1px 0 0 rgba(255,255,255,0.05)`,
                    }
                    : {
                        boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)`,
                    }
            }
            {...props}
        >
            {/* Top highlight edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {children}
        </motion.div>
    );
}
