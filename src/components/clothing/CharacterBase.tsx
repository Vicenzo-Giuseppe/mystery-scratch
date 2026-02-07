"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Html } from "@react-three/drei";

import type { ClothingItem } from "@/types/clothing";

interface CharacterBaseProps {
  outfit: "casual" | "street" | "formal" | "sporty";
  selectedItem: ClothingItem | null;
  onItemClick: (item: ClothingItem) => void;
}

export function CharacterBase({
  outfit,
  selectedItem,
  onItemClick,
}: CharacterBaseProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.y =
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.01;
    }
  });

  const getShirtColor = () => {
    switch (outfit) {
      case "casual":
        return "#ffffff";
      case "street":
        return "#1a1a2e";
      case "formal":
        return "#636e72";
      case "sporty":
        return "#fdcb6e";
      default:
        return "#ffffff";
    }
  };

  const getPantsColor = () => {
    switch (outfit) {
      case "casual":
        return "#0984e3";
      case "street":
        return "#000000";
      case "formal":
        return "#2d3436";
      case "sporty":
        return "#e17055";
      default:
        return "#0984e3";
    }
  };

  const getShoeColor = () => {
    switch (outfit) {
      case "casual":
        return "#ffffff";
      case "street":
        return "#ff0066";
      case "formal":
        return "#2d3436";
      case "sporty":
        return "#00b894";
      default:
        return "#ffffff";
    }
  };

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <capsuleGeometry args={[0.4, 1.5, 4, 16]} />
        <meshStandardMaterial color="#ffdbac" roughness={0.3} metalness={0.1} />
      </mesh>

      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" roughness={0.3} />
      </mesh>

      <mesh position={[-0.12, 1.25, 0.28]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.12, 1.25, 0.28]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      <mesh
        position={[0, 0.3, 0]}
        castShadow
        onClick={() => onItemClick("shirt")}
      >
        <boxGeometry args={[0.85, 0.7, 0.45]} />
        <meshStandardMaterial color={getShirtColor()} roughness={0.6} />
      </mesh>

      <mesh position={[-0.55, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.8, 4, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0.55, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.8, 4, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      <mesh
        position={[-0.2, -0.8, 0]}
        castShadow
        onClick={() => onItemClick("pants")}
      >
        <capsuleGeometry args={[0.18, 0.9, 4, 16]} />
        <meshStandardMaterial color={getPantsColor()} roughness={0.7} />
      </mesh>
      <mesh
        position={[0.2, -0.8, 0]}
        castShadow
        onClick={() => onItemClick("pants")}
      >
        <capsuleGeometry args={[0.18, 0.9, 4, 16]} />
        <meshStandardMaterial color={getPantsColor()} roughness={0.7} />
      </mesh>

      <mesh position={[-0.2, -1.35, 0.1]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.5]} />
        <meshStandardMaterial color={getShoeColor()} />
      </mesh>
      <mesh position={[0.2, -1.35, 0.1]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.5]} />
        <meshStandardMaterial color={getShoeColor()} />
      </mesh>

      {selectedItem && (
        <Html position={[0, 2, 0]} center>
          <div
            style={{
              background: "rgba(255, 51, 102, 0.9)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontFamily: "system-ui",
              fontSize: "14px",
              fontWeight: "bold",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1)}{" "}
            Selected
          </div>
        </Html>
      )}
    </group>
  );
}
