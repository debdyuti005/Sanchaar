"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Indian city coordinates (lat, lng) converted to 3D positions
const cities = [
    { name: "Mumbai", lat: 19.076, lng: 72.877 },
    { name: "Delhi", lat: 28.613, lng: 77.209 },
    { name: "Chennai", lat: 13.083, lng: 80.27 },
    { name: "Kolkata", lat: 22.572, lng: 88.364 },
    { name: "Bangalore", lat: 12.972, lng: 77.594 },
    { name: "Hyderabad", lat: 17.385, lng: 78.487 },
    { name: "Pune", lat: 18.52, lng: 73.856 },
    { name: "Ahmedabad", lat: 23.023, lng: 72.571 },
];

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

function createArcCurve(
    start: THREE.Vector3,
    end: THREE.Vector3,
    altitude: number
): THREE.CubicBezierCurve3 {
    const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(altitude);
    const cp1 = new THREE.Vector3().lerpVectors(start, mid, 0.33).normalize().multiplyScalar(altitude * 0.95);
    const cp2 = new THREE.Vector3().lerpVectors(start, mid, 0.67).normalize().multiplyScalar(altitude * 0.95);
    return new THREE.CubicBezierCurve3(start, cp1, cp2, end);
}

function GlobeWireframe() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.08;
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[2, 36, 36]} />
            <meshBasicMaterial
                color="#8b5cf6"
                wireframe
                transparent
                opacity={0.08}
            />
        </mesh>
    );
}

function DottedSphere() {
    const pointsRef = useRef<THREE.Points>(null);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions: number[] = [];
        const count = 2000;
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            const r = 2.01;
            positions.push(
                r * Math.cos(theta) * Math.sin(phi),
                r * Math.sin(theta) * Math.sin(phi),
                r * Math.cos(phi)
            );
        }
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.08;
        }
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial color="#6366f1" size={0.015} transparent opacity={0.4} sizeAttenuation />
        </points>
    );
}

function ConnectionArcs() {
    const groupRef = useRef<THREE.Group>(null);

    const arcs = useMemo(() => {
        const result: { curve: THREE.CubicBezierCurve3; color: string }[] = [];
        const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"];
        const connections = [
            [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4], [3, 7], [4, 5], [5, 6], [6, 7],
        ];
        connections.forEach(([i, j], idx) => {
            const start = latLngToVec3(cities[i].lat, cities[i].lng, 2.02);
            const end = latLngToVec3(cities[j].lat, cities[j].lng, 2.02);
            const curve = createArcCurve(start, end, 2.5);
            result.push({ curve, color: colors[idx % colors.length] });
        });
        return result;
    }, []);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.08;
        }
    });

    return (
        <group ref={groupRef}>
            {arcs.map((arc, i) => {
                const points = arc.curve.getPoints(50);
                const geo = new THREE.BufferGeometry().setFromPoints(points);
                return (
                    <line key={i} geometry={geo}>
                        <lineBasicMaterial
                            color={arc.color}
                            transparent
                            opacity={0.5}
                            linewidth={1}
                        />
                    </line>
                );
            })}
            {/* City dots */}
            {cities.map((city, i) => {
                const pos = latLngToVec3(city.lat, city.lng, 2.03);
                return (
                    <mesh key={i} position={pos}>
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshBasicMaterial color="#f59e0b" />
                    </mesh>
                );
            })}
        </group>
    );
}

function AmbientParticles() {
    const pointsRef = useRef<THREE.Points>(null);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions: number[] = [];
        for (let i = 0; i < 500; i++) {
            positions.push(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12
            );
        }
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.02;
            pointsRef.current.rotation.x += delta * 0.01;
        }
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial color="#8b5cf6" size={0.02} transparent opacity={0.3} sizeAttenuation />
        </points>
    );
}

export function Globe() {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 5.5], fov: 45 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.5} />
                <GlobeWireframe />
                <DottedSphere />
                <ConnectionArcs />
                <AmbientParticles />
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
