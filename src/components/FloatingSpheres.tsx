"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3, Color, Group } from "three";

interface SphereData {
  position: Vector3;
  color: Color;
  speed: number;
  offset: number;
}

export default function FloatingSpheres() {
  const groupRef = useRef<Group>(null);

  const spheres = useMemo(() => {
    const data: SphereData[] = [];
    const colors = ["#ff0066", "#00ffff", "#ffff00", "#ff6600", "#9900ff"];

    for (let i = 0; i < 5; i++) {
      data.push({
        position: new Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
        ),
        color: new Color(colors[i % colors.length]),
        speed: 0.5 + Math.random() * 1,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, index) => {
      const sphere = spheres[index];
      if (!sphere) return;

      // Floating motion
      child.position.y =
        sphere.position.y + Math.sin(time * sphere.speed + sphere.offset) * 0.5;

      // Rotation
      child.rotation.x = time * 0.5;
      child.rotation.y = time * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, index) => (
        <mesh key={index} position={sphere.position}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color={sphere.color}
            metalness={0.4}
            roughness={0.3}
            emissive={sphere.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
