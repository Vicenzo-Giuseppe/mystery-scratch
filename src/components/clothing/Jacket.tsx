"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group } from "three";

interface JacketProps {
  color: string;
  accentColor: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  isSelected?: boolean;
  onClick?: () => void;
}

export function Jacket({ 
  color, 
  accentColor, 
  position, 
  rotation = [0, 0, 0],
  isSelected = false,
  onClick
}: JacketProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      if (hovered) {
        groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }
    }
  });

  return (
    <group 
      ref={groupRef}
      position={position} 
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 1.4, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.6, 0.1, 0.6]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      <mesh position={[0, 0, 0.31]} castShadow>
        <boxGeometry args={[0.1, 1.2, 0.05]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      <mesh position={[-0.9, 0, 0]} castShadow>
        <capsuleGeometry args={[0.25, 1.2, 4, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      <mesh position={[0.9, 0, 0]} castShadow>
        <capsuleGeometry args={[0.25, 1.2, 4, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      <mesh position={[-0.9, -0.6, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      <mesh position={[0.9, -0.6, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      <mesh position={[0, 0.5, 0.31]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>

      <mesh position={[0.3, 0.4, 0.35]} castShadow>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial color="#636e72" metalness={0.8} />
      </mesh>

      <mesh position={[-0.3, 0.4, 0.35]} castShadow>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial color="#636e72" metalness={0.8} />
      </mesh>

      <mesh position={[0, 0.2, 0.35]} castShadow>
        <boxGeometry args={[0.4, 0.05, 0.02]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
      </mesh>

      {hovered && (
        <Html position={[0, 1.2, 0]} center>
          <div style={{
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontFamily: "system-ui"
          }}>
            Urban Jacket
          </div>
        </Html>
      )}
    </group>
  );
}
