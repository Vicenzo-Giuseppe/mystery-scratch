"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

interface DesignerJacketProps {
  variant: string;
}

export function DesignerJacket({ variant }: DesignerJacketProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const colors = {
    midnight: { main: "#0a0a0a", accent: "#c9a961", inner: "#1a1a1a" },
    crimson: { main: "#4a0000", accent: "#ffd700", inner: "#2a0000" },
    obsidian: { main: "#000000", accent: "#silver", inner: "#0a0a0a" },
  };

  const c = colors[variant as keyof typeof colors] || colors.midnight;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.8, 0.5]} />
        <meshStandardMaterial 
          color={c.main} 
          roughness={0.6} 
          metalness={0.3}
        />
      </mesh>

      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[1.6, 0.1, 0.5]} />
        <meshStandardMaterial color={c.accent} metalness={0.8} />
      </mesh>

      <mesh position={[0, 0, 0.26]} castShadow>
        <boxGeometry args={[0.05, 1.6, 0.02]} />
        <meshStandardMaterial color={c.accent} metalness={0.9} />
      </mesh>

      <mesh position={[-0.9, 0, 0]} castShadow>
        <capsuleGeometry args={[0.28, 1.6, 4, 32]} />
        <meshStandardMaterial color={c.main} roughness={0.6} />
      </mesh>

      <mesh position={[0.9, 0, 0]} castShadow>
        <capsuleGeometry args={[0.28, 1.6, 4, 32]} />
        <meshStandardMaterial color={c.main} roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.3, 0.26]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.02]} />
        <meshStandardMaterial color={c.inner} />
      </mesh>

      <mesh position={[0.3, 0.2, 0.28]} castShadow>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial color={c.accent} metalness={1} />
      </mesh>

      <mesh position={[-0.3, 0.2, 0.28]} castShadow>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial color={c.accent} metalness={1} />
      </mesh>

      <mesh position={[0, 0.5, 0.28]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color={c.accent} metalness={1} />
      </mesh>
    </group>
  );
}
