"use client";

import { useRef, useEffect, useCallback, useState } from "react";

export function useAudioVisualizer(isActive: boolean) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const [fallback, setFallback] = useState(false);
    const phaseRef = useRef(0);

    const drawSimulatedWave = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const barCount = 48;
        const barWidth = width / barCount - 2;
        const centerY = height / 2;

        phaseRef.current += 0.06;

        for (let i = 0; i < barCount; i++) {
            const normalizedI = i / barCount;
            const amplitude = isActive
                ? 0.3 +
                0.7 *
                Math.abs(
                    Math.sin(normalizedI * Math.PI * 3 + phaseRef.current) *
                    Math.cos(normalizedI * Math.PI * 1.5 + phaseRef.current * 0.7)
                )
                : 0.05 + 0.08 * Math.sin(normalizedI * Math.PI * 2 + phaseRef.current * 0.3);

            const barHeight = amplitude * height * 0.8;

            const gradient = ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2);
            gradient.addColorStop(0, isActive ? "rgba(139, 92, 246, 0.9)" : "rgba(139, 92, 246, 0.2)");
            gradient.addColorStop(0.5, isActive ? "rgba(59, 130, 246, 0.95)" : "rgba(59, 130, 246, 0.15)");
            gradient.addColorStop(1, isActive ? "rgba(6, 182, 212, 0.9)" : "rgba(6, 182, 212, 0.2)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            const x = i * (barWidth + 2);
            const radius = barWidth / 2;
            ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, radius);
            ctx.fill();
        }

        animFrameRef.current = requestAnimationFrame(drawSimulatedWave);
    }, [isActive]);

    useEffect(() => {
        setFallback(true); // Always use simulated for demo
    }, []);

    useEffect(() => {
        if (fallback) {
            animFrameRef.current = requestAnimationFrame(drawSimulatedWave);
        }
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [fallback, drawSimulatedWave]);

    return { canvasRef };
}
