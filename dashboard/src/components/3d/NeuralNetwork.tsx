"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface NeuralNetworkProps {
    activeAgent?: string | null;
    className?: string;
}

const nodePositions = [
    { id: "supervisor", pos: [0, 1.5, 0] as [number, number, number], color: "#8b5cf6" },
    { id: "transcreation", pos: [-2, -0.5, 0.5] as [number, number, number], color: "#06b6d4" },
    { id: "media-factory", pos: [0, -0.8, -1] as [number, number, number], color: "#f59e0b" },
    { id: "platform-strategy", pos: [2, -0.5, 0.5] as [number, number, number], color: "#10b981" },
    // Sub-nodes
    { id: "rag", pos: [-2.8, -1.8, 1] as [number, number, number], color: "#06b6d4" },
    { id: "mediaconvert", pos: [-0.5, -2, -1.5] as [number, number, number], color: "#f59e0b" },
    { id: "whatsapp", pos: [2.5, -1.8, 1.2] as [number, number, number], color: "#25d366" },
    { id: "instagram", pos: [3.2, -1.5, -0.3] as [number, number, number], color: "#e1306c" },
];

const connections = [
    [0, 1], [0, 2], [0, 3], // Supervisor to agents
    [1, 4], // Transcreation to RAG
    [2, 5], // Media Factory to MediaConvert
    [3, 6], [3, 7], // Platform Strategy to platforms
    [1, 2], [2, 3], // Inter-agent connections
];

function NetworkNode({ position, color, isActive }: { position: [number, number, number]; color: string; isActive: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            const scale = isActive ? 1 + Math.sin(clock.elapsedTime * 3) * 0.15 : 1;
            meshRef.current.scale.setScalar(scale);
        }
        if (glowRef.current) {
            const opacity = isActive ? 0.3 + Math.sin(clock.elapsedTime * 2) * 0.15 : 0.08;
            (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
        }
    });

    return (
        <group position={position}>
            {/* Glow sphere */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.08} />
            </mesh>
            {/* Core node */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isActive ? 0.8 : 0.3}
                />
            </mesh>
        </group>
    );
}

function NetworkConnections({ activeAgent }: { activeAgent?: string | null }) {
    const groupRef = useRef<THREE.Group>(null);

    const lines = useMemo(() => {
        return connections.map(([i, j]) => {
            const start = new THREE.Vector3(...nodePositions[i].pos);
            const end = new THREE.Vector3(...nodePositions[j].pos);
            const points = [start, end];
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            return { geo, sourceId: nodePositions[i].id, targetId: nodePositions[j].id };
        });
    }, []);

    return (
        <group ref={groupRef}>
            {lines.map((line, i) => {
                const isActive = activeAgent && (line.sourceId === activeAgent || line.targetId === activeAgent);
                return (
                    <line key={i} geometry={line.geo}>
                        <lineBasicMaterial
                            color={isActive ? "#8b5cf6" : "#ffffff"}
                            transparent
                            opacity={isActive ? 0.5 : 0.06}
                            linewidth={1}
                        />
                    </line>
                );
            })}
        </group>
    );
}

function DataFlowParticles() {
    const pointsRef = useRef<THREE.Points>(null);

    const { geometry, velocities } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions: number[] = [];
        const velocities: THREE.Vector3[] = [];
        const count = 40;
        for (let i = 0; i < count; i++) {
            const connIdx = Math.floor(Math.random() * connections.length);
            const [si, ei] = connections[connIdx];
            const start = new THREE.Vector3(...nodePositions[si].pos);
            const end = new THREE.Vector3(...nodePositions[ei].pos);
            const t = Math.random();
            const pos = new THREE.Vector3().lerpVectors(start, end, t);
            positions.push(pos.x, pos.y, pos.z);
            const dir = new THREE.Vector3().subVectors(end, start).normalize().multiplyScalar(0.02);
            velocities.push(dir);
        }
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return { geometry: geo, velocities };
    }, []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i) + velocities[i].x;
            const y = positions.getY(i) + velocities[i].y;
            const z = positions.getZ(i) + velocities[i].z;
            if (Math.abs(x) > 4 || Math.abs(y) > 3 || Math.abs(z) > 2) {
                const connIdx = Math.floor(Math.random() * connections.length);
                const [si] = connections[connIdx];
                positions.setXYZ(i, ...nodePositions[si].pos);
            } else {
                positions.setXYZ(i, x, y, z);
            }
        }
        positions.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial color="#a78bfa" size={0.04} transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

function Scene({ activeAgent }: { activeAgent?: string | null }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {nodePositions.map((node) => (
                <NetworkNode
                    key={node.id}
                    position={node.pos}
                    color={node.color}
                    isActive={activeAgent === node.id || !activeAgent}
                />
            ))}
            <NetworkConnections activeAgent={activeAgent} />
            <DataFlowParticles />
        </group>
    );
}

export function NeuralNetwork({ activeAgent, className }: NeuralNetworkProps) {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.6} />
                <pointLight position={[5, 5, 5]} intensity={0.8} />
                <Scene activeAgent={activeAgent} />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    maxPolarAngle={Math.PI * 0.7}
                    minPolarAngle={Math.PI * 0.3}
                />
            </Canvas>
        </div>
    );
}
