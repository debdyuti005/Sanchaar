"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import {
  PageTransition,
  StaggerContainer,
  staggerItem,
} from "@/components/layout/PageTransition";
import {
  ArrowRight,
  Mic,
  Globe2,
  Zap,
  Languages,
  Smartphone,
  Shield,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

const Globe = dynamic(
  () => import("@/components/3d/Globe").then((m) => m.Globe),
  { ssr: false }
);
const FloatingParticles = dynamic(
  () =>
    import("@/components/3d/FloatingParticles").then(
      (m) => m.FloatingParticles
    ),
  { ssr: false }
);

const features = [
  {
    icon: Mic,
    title: "Voice-First Ingestion",
    description:
      "Speak your content brief in any Indic language. The Supervisor Agent interprets intent, audience, and tone instantly.",
    color: "from-violet-500 to-blue-500",
    glowColor: "rgba(139,92,246,0.15)",
  },
  {
    icon: Languages,
    title: "AI Transcreation",
    description:
      "Not just translation — cultural adaptation with RAG-powered knowledge bases for Hindi, Tamil, Telugu, and Marathi.",
    color: "from-cyan-500 to-teal-500",
    glowColor: "rgba(6,182,212,0.15)",
  },
  {
    icon: Smartphone,
    title: "Multi-Platform Distribution",
    description:
      "Simultaneous delivery to WhatsApp, Instagram Reels, and ShareChat with platform-specific optimizations.",
    color: "from-emerald-500 to-green-500",
    glowColor: "rgba(16,185,129,0.15)",
  },
  {
    icon: Shield,
    title: "Quality Gatekeeper",
    description:
      "Automated BLEU scoring, semantic similarity checks, and cultural accuracy validation before distribution.",
    color: "from-amber-500 to-orange-500",
    glowColor: "rgba(245,158,11,0.15)",
  },
];

const stats = [
  { value: 4, suffix: "+", label: "Languages Supported" },
  { value: 3, label: "Platforms" },
  { value: 18, suffix: "s", label: "Avg. Pipeline Time" },
  { value: 157, prefix: "₹", label: "Avg. Cost per Run" },
];

export default function LandingPage() {
  return (
    <PageTransition>
      {/* Floating particles background */}
      <FloatingParticles className="fixed inset-0 z-0 pointer-events-none opacity-50" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="mx-auto max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Text column */}
          <StaggerContainer className="space-y-6 z-10">
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1">
                <Zap className="h-3 w-3" />
                Powered by Amazon Bedrock
              </span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              <span className="text-white">Content</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Without Borders
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-lg text-zinc-400 max-w-lg leading-relaxed"
            >
              The autonomous media orchestrator for Bharat. Speak your brief,
              and watch AI agents transcreate, produce, and distribute content
              across India&apos;s diverse platforms — in seconds.
            </motion.p>

            <motion.div variants={staggerItem} className="flex items-center gap-4 pt-2">
              <Link href="/dashboard">
                <motion.button
                  className="relative group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-violet-600/25"
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Launch Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/agents">
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-zinc-300 font-medium text-sm hover:bg-white/5 hover:border-white/20 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Meet the Agents
                </motion.button>
              </Link>
            </motion.div>
          </StaggerContainer>

          {/* 3D Globe */}
          <motion.div
            className="relative h-[400px] lg:h-[500px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Globe />
            {/* Globe glow */}
            <div className="absolute inset-0 bg-gradient-radial from-violet-600/10 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="relative z-10 -mt-8 mb-16">
        <div className="mx-auto max-w-4xl px-6">
          <GlassCard className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="text-3xl font-bold text-white"
                  />
                  <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              An Agentic Approach
            </motion.h2>
            <motion.p
              className="text-zinc-400 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Four specialized AI agents collaborate autonomously to transform
              your voice brief into platform-ready content.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 h-full group" glowColor={feature.glowColor}>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <feature.icon className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-violet-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 pb-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <GlassCard className="p-10" glowColor="rgba(139,92,246,0.08)">
            <Globe2 className="h-10 w-10 text-violet-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Ready to Transform Your Content Pipeline?
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Experience the power of agentic AI. Watch your content come alive
              across India&apos;s diverse digital landscape.
            </p>
            <Link href="/dashboard">
              <motion.button
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-lg shadow-violet-600/25"
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(139,92,246,0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <BarChart3 className="h-4 w-4" />
                Open Command Center
              </motion.button>
            </Link>
          </GlassCard>
        </div>
      </section>
    </PageTransition>
  );
}
