"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

interface LuxurySneakerProps {
  variant: string;
}

export function LuxurySneaker({ variant }: LuxurySneakerProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const colors = {
    classic: { main: "#1a1a1a", accent: "#c9a961", sole: "#f5f5f5" },
    limited: { main: "#8b0000", accent: "#ffd700", sole: "#1a1a1a" },
    stealth: { main: "#000000", accent: "#333333", sole: "#111111" },
  };

  const c = colors[variant as keyof typeof colors] || colors.classic;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.35, 2.8]} />
        <meshStandardMaterial 
          color={c.main} 
          roughness={0.3} 
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.2, 0.3]} castShadow>
        <boxGeometry args={[1.3, 0.5, 1.4]} />
        <meshStandardMaterial color={c.main} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.45, 0.5]} castShadow>
        <cylinderGeometry args={[0.55, 0.45, 0.9, 64, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={c.main} roughness={0.3} />
      </mesh>

      <mesh position={[0, -0.1, 1.4]} castShadow>
        <boxGeometry args={[1.45, 0.15, 0.4]} />
        <meshStandardMaterial color={c.sole} roughness={0.1} />
      </mesh>

      <mesh position={[0, 0.25, 0.3]} castShadow>
        <boxGeometry args={[1.35, 0.05, 1]} />
        <meshStandardMaterial 
          color={c.accent} 
          emissive={c.accent}
          emissiveIntensity={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh position={[0, 0.15, -0.8]} castShadow>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color={c.accent} metalness={1} />
      </mesh>

      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.42, 0.05, 2.82]} />
        <meshStandardMaterial color={c.sole} roughness={0.8} />
      </mesh>
    </group>
  );
}
