"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

interface AnimatedCubeProps {
  position?: [number, number, number];
}

export default function AnimatedCube({
  position = [0, 0, 0],
}: AnimatedCubeProps) {
  const meshRef = useRef<Mesh>(null);
  const scaleRef = useRef(1);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Rotation animation
    meshRef.current.rotation.x = time * 0.5;
    meshRef.current.rotation.y = time * 0.3;
    meshRef.current.rotation.z = time * 0.1;

    // Floating/bobbing animation
    meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.3;

    // Pulsing scale animation
    scaleRef.current = 1 + Math.sin(time * 3) * 0.2;
    meshRef.current.scale.setScalar(scaleRef.current);
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial
        color="#ff3366"
        metalness={0.6}
        roughness={0.2}
        emissive="#440022"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}
