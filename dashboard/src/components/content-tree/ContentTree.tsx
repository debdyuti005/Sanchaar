"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { TreeNode } from "./TreeNode";
import type { AgentNode, AgentName } from "@/types/pipeline";

interface ContentTreeProps {
    agents: Record<AgentName, AgentNode>;
}

export function ContentTree({ agents }: ContentTreeProps) {
    const supervisor = agents.supervisor;
    const children: AgentNode[] = [
        agents.transcreation,
        agents["media-factory"],
        agents["platform-strategy"],
    ];

    const anyActive = Object.values(agents).some(
        (a) => a.status === "processing" || a.status === "complete"
    );

    return (
        <GlassCard className="p-6" glowColor={anyActive ? "rgba(59,130,246,0.1)" : undefined}>
            <h2 className="text-lg font-semibold text-white mb-1">Content Pipeline</h2>
            <p className="text-sm text-zinc-400 mb-6">Agent Orchestration Flow</p>

            <div className="flex flex-col items-center">
                {/* Supervisor node */}
                <TreeNode node={supervisor} />

                {/* Connection lines from supervisor to children */}
                <svg
                    width="320"
                    height="50"
                    viewBox="0 0 320 50"
                    className="my-1"
                    fill="none"
                >
                    {/* Center vertical line from supervisor */}
                    <motion.line
                        x1="160"
                        y1="0"
                        x2="160"
                        y2="20"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        animate={
                            anyActive
                                ? { strokeDashoffset: [0, -16], stroke: "rgba(139,92,246,0.5)" }
                                : {}
                        }
                        transition={anyActive ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                    />
                    {/* Horizontal bus */}
                    <motion.line
                        x1="50"
                        y1="20"
                        x2="270"
                        y2="20"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        animate={
                            anyActive
                                ? { strokeDashoffset: [0, -16], stroke: "rgba(139,92,246,0.4)" }
                                : {}
                        }
                        transition={anyActive ? { duration: 1.5, repeat: Infinity, ease: "linear" } : {}}
                    />
                    {/* Arms down to children */}
                    {[50, 160, 270].map((x, i) => (
                        <motion.line
                            key={i}
                            x1={x}
                            y1="20"
                            x2={x}
                            y2="50"
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            animate={
                                anyActive
                                    ? { strokeDashoffset: [0, -16], stroke: "rgba(139,92,246,0.4)" }
                                    : {}
                            }
                            transition={
                                anyActive
                                    ? { duration: 1, repeat: Infinity, ease: "linear", delay: i * 0.15 }
                                    : {}
                            }
                        />
                    ))}

                    {/* Animated flowing dots */}
                    {anyActive &&
                        [50, 160, 270].map((x, i) => (
                            <motion.circle
                                key={`dot-${i}`}
                                r="3"
                                fill="rgba(139,92,246,0.8)"
                                animate={{ cy: [20, 50], opacity: [1, 0] }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                    ease: "easeIn",
                                }}
                                cx={x}
                            />
                        ))}
                </svg>

                {/* Child nodes */}
                <div className="flex items-start justify-center gap-8 w-full">
                    {children.map((node) => (
                        <TreeNode key={node.id} node={node} />
                    ))}
                </div>
            </div>
        </GlassCard>
    );
}
