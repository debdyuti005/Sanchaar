export type AgentStatus = "idle" | "processing" | "complete" | "error";

export type AgentName =
  | "supervisor"
  | "transcreation"
  | "media-factory"
  | "platform-strategy";

export interface AgentNode {
  id: AgentName;
  label: string;
  description: string;
  status: AgentStatus;
  progress: number; // 0-100
}

export interface FeedEntry {
  id: string;
  agent: AgentName;
  message: string;
  timestamp: Date;
  type: "thought" | "action" | "result" | "error";
}

export type PipelinePhase =
  | "idle"
  | "listening"
  | "intent-parsing"
  | "transcreation"
  | "media-processing"
  | "quality-validation"
  | "distribution"
  | "complete";

export interface PipelineState {
  phase: PipelinePhase;
  agents: Record<AgentName, AgentNode>;
  feed: FeedEntry[];
  voiceTranscript: string;
  socialDelivery: {
    whatsapp: "pending" | "sent" | "delivered" | "read";
    instagram: "pending" | "posted" | "live";
    sharechat: "pending" | "posted" | "trending";
  };
}

export interface SocialPreview {
  platform: "whatsapp" | "instagram" | "sharechat";
  caption: string;
  language: string;
  hashtags?: string[];
  mediaAspect: "9:16" | "1:1" | "16:9";
}
