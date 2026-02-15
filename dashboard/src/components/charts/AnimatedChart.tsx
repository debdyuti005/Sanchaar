"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedChartProps {
    data: { label: string; value: number; color: string }[];
    maxValue?: number;
    className?: string;
}

export function AnimatedBarChart({ data, maxValue, className }: AnimatedChartProps) {
    const max = maxValue ?? Math.max(...data.map((d) => d.value));

    return (
        <div className={cn("space-y-3", className)}>
            {data.map((item, i) => (
                <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">{item.label}</span>
                        <span className="text-zinc-300 font-medium">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / max) * 100}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

interface DonutChartProps {
    segments: { label: string; value: number; color: string }[];
    size?: number;
    className?: string;
}

export function DonutChart({ segments, size = 180, className }: DonutChartProps) {
    const total = segments.reduce((acc, s) => acc + s.value, 0);
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulated = 0;

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth={strokeWidth}
                />
                {segments.map((seg, i) => {
                    const segmentLength = (seg.value / total) * circumference;
                    const offset = accumulated;
                    accumulated += segmentLength;
                    return (
                        <motion.circle
                            key={seg.label}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={`${segmentLength} ${circumference}`}
                            strokeDashoffset={-offset}
                            initial={{ strokeDasharray: `0 ${circumference}` }}
                            animate={{ strokeDasharray: `${segmentLength} ${circumference}` }}
                            transition={{ duration: 1.2, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ filter: `drop-shadow(0 0 4px ${seg.color}40)` }}
                        />
                    );
                })}
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="text-2xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    ${(total / 100).toFixed(0)}
                </motion.span>
                <span className="text-[10px] text-zinc-500">Total Cost</span>
            </div>
        </div>
    );
}

interface LineChartProps {
    points: number[];
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

export function AnimatedLineChart({
    points,
    width = 400,
    height = 120,
    color = "#8b5cf6",
    className,
}: LineChartProps) {
    const padding = 20;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;

    const pathD = points
        .map((p, i) => {
            const x = padding + (i / (points.length - 1)) * chartW;
            const y = padding + chartH - ((p - min) / range) * chartH;
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");

    const areaD =
        pathD +
        ` L ${padding + chartW} ${padding + chartH} L ${padding} ${padding + chartH} Z`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
            <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Area fill */}
            <motion.path
                d={areaD}
                fill="url(#lineGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
            {/* Line */}
            <motion.path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
            />
            {/* Dots */}
            {points.map((p, i) => {
                const x = padding + (i / (points.length - 1)) * chartW;
                const y = padding + chartH - ((p - min) / range) * chartH;
                return (
                    <motion.circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={3}
                        fill={color}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                    />
                );
            })}
        </svg>
    );
}
