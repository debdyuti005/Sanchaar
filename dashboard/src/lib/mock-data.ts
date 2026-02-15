import { AgentNode, AgentName, FeedEntry, SocialPreview } from "@/types/pipeline";

export const initialAgents: Record<AgentName, AgentNode> = {
    supervisor: {
        id: "supervisor",
        label: "Supervisor Agent",
        description: "Orchestration coordinator & quality gatekeeper",
        status: "idle",
        progress: 0,
    },
    transcreation: {
        id: "transcreation",
        label: "Transcreation Agent",
        description: "Indic RAG-powered language adaptation",
        status: "idle",
        progress: 0,
    },
    "media-factory": {
        id: "media-factory",
        label: "Media Factory Agent",
        description: "Multi-format video/image processing",
        status: "idle",
        progress: 0,
    },
    "platform-strategy": {
        id: "platform-strategy",
        label: "Platform Strategy Agent",
        description: "Distribution optimization",
        status: "idle",
        progress: 0,
    },
};

export const simulatedFeed: Omit<FeedEntry, "id" | "timestamp">[] = [
    { agent: "supervisor", message: "Parsing voice command intent…", type: "thought" },
    { agent: "supervisor", message: "Intent identified: product_launch for youth audience (18-35)", type: "result" },
    { agent: "supervisor", message: "Assigning transcreation task → Hindi, Tamil, Telugu, Bengali", type: "action" },
    { agent: "transcreation", message: "Loading Indic RAG knowledge base (cultural-references index)…", type: "thought" },
    { agent: "transcreation", message: "Adapting idioms: 'break the ice' → 'बातचीत की शुरुआत करें' (Hindi)", type: "action" },
    { agent: "transcreation", message: "Transcreation complete — BLEU: 0.87, Cultural Accuracy: 0.92", type: "result" },
    { agent: "supervisor", message: "Quality validation passed ✓ — assigning media processing", type: "action" },
    { agent: "media-factory", message: "Initiating MediaConvert job for 3 aspect ratios…", type: "thought" },
    { agent: "media-factory", message: "Generating 9:16 (720×1280) variant for Stories/Reels…", type: "action" },
    { agent: "media-factory", message: "Subtitle generation: WebVTT for hi, ta, te, bn — Noto Sans Unicode", type: "action" },
    { agent: "media-factory", message: "Media processing complete — 3 variants, 4 subtitle tracks", type: "result" },
    { agent: "supervisor", message: "Assigning platform distribution across WhatsApp, Instagram, ShareChat", type: "action" },
    { agent: "platform-strategy", message: "Scheduling optimal post times — 8:30 PM IST (WhatsApp), 8:00 PM (Instagram)", type: "thought" },
    { agent: "platform-strategy", message: "WhatsApp: Broadcasting to 1,250 recipients with 9:16 format", type: "action" },
    { agent: "platform-strategy", message: "Instagram: Publishing Reel with #नयाउत्पाद #TechForBharat", type: "action" },
    { agent: "platform-strategy", message: "ShareChat: Posted with regional hashtags — trending detection active", type: "action" },
    { agent: "supervisor", message: "Pipeline complete — Total cost: ₹157 ($1.85) across 4 languages", type: "result" },
];

export const sampleVoiceTranscript =
    "Create a product launch video for our new eco-friendly water bottle. Target youth audience in Hindi, Tamil, Telugu, and Bengali. Post it to WhatsApp, Instagram Reels, and ShareChat. Use a casual, energetic tone with regional festival references.";

export const socialPreviews: SocialPreview[] = [
    {
        platform: "whatsapp",
        caption: "🌿 पर्यावरण के लिए एक कदम! हमारी नई इको-फ्रेंडली बोतल के साथ अपने ग्रह को बचाएं। अभी ऑर्डर करें! 💧",
        language: "Hindi",
        mediaAspect: "9:16",
    },
    {
        platform: "instagram",
        caption: "🌍 Say hello to sustainability! Our eco-friendly bottle is here to make every sip count.",
        language: "English",
        hashtags: ["#EcoFriendly", "#नयाउत्पाद", "#TechForBharat", "#SustainableLiving", "#GoGreen"],
        mediaAspect: "9:16",
    },
    {
        platform: "sharechat",
        caption: "🔥 இயற்கையை காப்போம்! எங்கள் புதிய எகோ-ஃப்ரெண்ட்லி பாட்டில் இப்போது கிடைக்கிறது 💚",
        language: "Tamil",
        hashtags: ["#பசுமை", "#EcoBottle", "#ShareChat"],
        mediaAspect: "9:16",
    },
];
