"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, BufferGeometry, Float32BufferAttribute, Group } from "three";

interface ParticleFieldProps {
  count?: number;
}

export default function ParticleField({ count = 200 }: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);
  const groupRef = useRef<Group>(null);

  // Generate random particle positions
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current || !pointsRef.current) return;

    const time = state.clock.elapsedTime;

    // Gentle rotation of the entire particle field
    groupRef.current.rotation.y = time * 0.05;
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

    // Pulsing effect
    const scale = 1 + Math.sin(time * 0.5) * 0.1;
    pointsRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
