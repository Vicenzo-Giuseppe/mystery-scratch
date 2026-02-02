"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

interface FashionAccessoryProps {
  variant: string;
}

export function FashionAccessory({ variant }: FashionAccessoryProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const colors = {
    tactical: { main: "#1a1a1a", accent: "#c9a961", detail: "#333" },
    urban: { main: "#2a2a2a", accent: "#silver", detail: "#1a1a1a" },
    minimal: { main: "#f5f5f5", accent: "#000", detail: "#e0e0e0" },
  };

  const c = colors[variant as keyof typeof colors] || colors.tactical;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 0.4]} />
        <meshStandardMaterial 
          color={c.main} 
          roughness={0.4} 
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshStandardMaterial color={c.accent} metalness={0.6} />
      </mesh>

      <mesh position={[0, -0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshStandardMaterial color={c.accent} metalness={0.6} />
      </mesh>

      <mesh position={[0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 0.7, 0.35]} />
        <meshStandardMaterial color={c.accent} metalness={0.8} />
      </mesh>

      <mesh position={[-0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 0.7, 0.35]} />
        <meshStandardMaterial color={c.accent} metalness={0.8} />
      </mesh>

      <mesh position={[0, 0, 0.21]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.02]} />
        <meshStandardMaterial color={c.detail} />
      </mesh>

      <mesh position={[0, 0.6, 0]} castShadow>
        <torusGeometry args={[0.15, 0.05, 16, 32]} />
        <meshStandardMaterial color={c.accent} metalness={1} />
      </mesh>
    </group>
  );
}
