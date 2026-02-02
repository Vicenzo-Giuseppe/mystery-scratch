"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

interface RingData {
  radius: number;
  tube: number;
  color: string;
  speed: number;
  axis: "x" | "y" | "z";
}

export default function RotatingRings() {
  const groupRef = useRef<Group>(null);

  const rings = useMemo<RingData[]>(
    () => [
      { radius: 2, tube: 0.05, color: "#ff0066", speed: 0.5, axis: "x" },
      { radius: 2.5, tube: 0.05, color: "#00ffff", speed: -0.3, axis: "y" },
      { radius: 3, tube: 0.05, color: "#ffff00", speed: 0.2, axis: "z" },
      { radius: 3.5, tube: 0.05, color: "#9900ff", speed: -0.4, axis: "x" },
    ],
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, index) => {
      const ring = rings[index];
      if (!ring) return;

      // Rotate around different axes
      if (ring.axis === "x") {
        child.rotation.x = time * ring.speed;
        child.rotation.y = time * ring.speed * 0.5;
      } else if (ring.axis === "y") {
        child.rotation.y = time * ring.speed;
        child.rotation.z = time * ring.speed * 0.5;
      } else {
        child.rotation.z = time * ring.speed;
        child.rotation.x = time * ring.speed * 0.5;
      }
    });
  });

  return (
    <group ref={groupRef} position={[3, 0, -2]}>
      {rings.map((ring, index) => (
        <mesh key={index}>
          <torusGeometry args={[ring.radius, ring.tube, 16, 100]} />
          <meshStandardMaterial
            color={ring.color}
            metalness={0.8}
            roughness={0.2}
            emissive={ring.color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
