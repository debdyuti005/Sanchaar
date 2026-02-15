"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
    const pointsRef = useRef<THREE.Points>(null);

    const { geometry, speeds } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions: number[] = [];
        const speeds: number[] = [];
        const count = 300;
        for (let i = 0; i < count; i++) {
            positions.push(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            speeds.push(0.002 + Math.random() * 0.005);
        }
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return { geometry: geo, speeds };
    }, []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            positions.setY(i, y + speeds[i]);
            if (y > 10) positions.setY(i, -10);
        }
        positions.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial
                color="#8b5cf6"
                size={0.03}
                transparent
                opacity={0.2}
                sizeAttenuation
            />
        </points>
    );
}

export function FloatingParticles({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true }}
            >
                <Particles />
            </Canvas>
        </div>
    );
}
