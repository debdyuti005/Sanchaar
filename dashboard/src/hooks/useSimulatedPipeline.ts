"use client";

import { useState, useCallback, useRef } from "react";
import {
    PipelineState,
    PipelinePhase,
    AgentName,
    AgentStatus,
    FeedEntry,
} from "@/types/pipeline";
import {
    initialAgents,
    simulatedFeed,
    sampleVoiceTranscript,
} from "@/lib/mock-data";

const PHASE_DURATIONS: Record<PipelinePhase, number> = {
    idle: 0,
    listening: 3000,
    "intent-parsing": 2000,
    transcreation: 4000,
    "media-processing": 4000,
    "quality-validation": 2000,
    distribution: 3500,
    complete: 0,
};

const PHASE_SEQUENCE: PipelinePhase[] = [
    "listening",
    "intent-parsing",
    "transcreation",
    "media-processing",
    "quality-validation",
    "distribution",
    "complete",
];

function getAgentStatusForPhase(
    agent: AgentName,
    phase: PipelinePhase
): AgentStatus {
    const map: Record<PipelinePhase, Partial<Record<AgentName, AgentStatus>>> = {
        idle: {},
        listening: { supervisor: "processing" },
        "intent-parsing": { supervisor: "processing" },
        transcreation: { supervisor: "complete", transcreation: "processing" },
        "media-processing": {
            supervisor: "complete",
            transcreation: "complete",
            "media-factory": "processing",
        },
        "quality-validation": {
            supervisor: "processing",
            transcreation: "complete",
            "media-factory": "complete",
        },
        distribution: {
            supervisor: "complete",
            transcreation: "complete",
            "media-factory": "complete",
            "platform-strategy": "processing",
        },
        complete: {
            supervisor: "complete",
            transcreation: "complete",
            "media-factory": "complete",
            "platform-strategy": "complete",
        },
    };
    return map[phase]?.[agent] ?? "idle";
}

function getAgentProgressForPhase(
    agent: AgentName,
    phase: PipelinePhase
): number {
    const status = getAgentStatusForPhase(agent, phase);
    if (status === "complete") return 100;
    if (status === "processing") return 60;
    return 0;
}

function getFeedSlice(
    phaseIndex: number
): Omit<FeedEntry, "id" | "timestamp">[] {
    const entriesPerPhase = [0, 2, 3, 6, 7, 11, 14, 17];
    const end = entriesPerPhase[Math.min(phaseIndex + 1, entriesPerPhase.length - 1)] ?? simulatedFeed.length;
    return simulatedFeed.slice(0, end);
}

export function useSimulatedPipeline() {
    const [state, setState] = useState<PipelineState>({
        phase: "idle",
        agents: { ...initialAgents },
        feed: [],
        voiceTranscript: "",
        socialDelivery: {
            whatsapp: "pending",
            instagram: "pending",
            sharechat: "pending",
        },
    });

    const [isRunning, setIsRunning] = useState(false);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const feedCounterRef = useRef(0);

    const reset = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        feedCounterRef.current = 0;
        setIsRunning(false);
        setState({
            phase: "idle",
            agents: { ...initialAgents },
            feed: [],
            voiceTranscript: "",
            socialDelivery: {
                whatsapp: "pending",
                instagram: "pending",
                sharechat: "pending",
            },
        });
    }, []);

    const start = useCallback(() => {
        if (isRunning) return;
        reset();
        setIsRunning(true);

        let elapsed = 0;

        PHASE_SEQUENCE.forEach((phase, phaseIndex) => {
            const t = setTimeout(() => {
                const feedSlice = getFeedSlice(phaseIndex);
                const feedEntries: FeedEntry[] = feedSlice.map((entry, i) => ({
                    ...entry,
                    id: `feed-${i}`,
                    timestamp: new Date(Date.now() - (feedSlice.length - i) * 800),
                }));

                const agentNames: AgentName[] = [
                    "supervisor",
                    "transcreation",
                    "media-factory",
                    "platform-strategy",
                ];
                const agents = { ...initialAgents };
                agentNames.forEach((name) => {
                    agents[name] = {
                        ...agents[name],
                        status: getAgentStatusForPhase(name, phase),
                        progress: getAgentProgressForPhase(name, phase),
                    };
                });

                const socialDelivery = {
                    whatsapp:
                        phaseIndex >= 6
                            ? ("delivered" as const)
                            : phaseIndex >= 5
                                ? ("sent" as const)
                                : ("pending" as const),
                    instagram:
                        phaseIndex >= 6
                            ? ("live" as const)
                            : phaseIndex >= 5
                                ? ("posted" as const)
                                : ("pending" as const),
                    sharechat:
                        phaseIndex >= 6
                            ? ("trending" as const)
                            : phaseIndex >= 5
                                ? ("posted" as const)
                                : ("pending" as const),
                };

                setState({
                    phase,
                    agents,
                    feed: feedEntries,
                    voiceTranscript:
                        phaseIndex >= 1 ? sampleVoiceTranscript : "",
                    socialDelivery,
                });

                if (phase === "complete") {
                    setIsRunning(false);
                }
            }, elapsed);

            timeoutsRef.current.push(t);
            elapsed += PHASE_DURATIONS[phase];
        });
    }, [isRunning, reset]);

    return { state, isRunning, start, reset };
}
