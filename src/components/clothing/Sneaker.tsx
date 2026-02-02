"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group } from "three";

interface SneakerProps {
  color: string;
  accentColor: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Sneaker({ 
  color, 
  accentColor, 
  position, 
  rotation = [0, 0, 0], 
  scale = 1,
  isSelected = false,
  onClick
}: SneakerProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group 
      ref={groupRef}
      position={position} 
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 2.5]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>

        <mesh position={[0, 0.25, 0.5]} castShadow>
          <boxGeometry args={[1.1, 0.5, 1.2]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>

        <mesh position={[0, 0.5, 0.7]} castShadow>
          <cylinderGeometry args={[0.5, 0.4, 0.8, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>

        <mesh position={[0, 0, 1.3]} castShadow>
          <boxGeometry args={[1.25, 0.15, 0.3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>

        <mesh position={[0, 0.3, 0.5]} castShadow>
          <boxGeometry args={[1.05, 0.05, 1]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.2} />
        </mesh>

        <mesh position={[0, 0.15, -0.5]} castShadow>
          <circleGeometry args={[0.3, 32]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>

        {hovered && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontFamily: "system-ui"
            }}>
              Street Sneaker
            </div>
          </Html>
        )}

        {isSelected && (
          <mesh position={[0, 0, 0]} scale={[1.3, 1.3, 1.3]} visible={false}>
            <sphereGeometry args={[2, 32, 32]} />
          </mesh>
        )}
      </group>
    </group>
  );
}
