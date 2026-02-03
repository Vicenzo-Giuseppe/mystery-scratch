"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Center, useGLTF } from "@react-three/drei";
import { Group, Vector3 } from "three";

interface DetailViewProps {
  product: {
    id: string;
    name: string;
    designer: string;
    price: string;
    description: string;
    model: string;
    color: string;
    category: string;
    badge?: string;
    trend?: string;
    details?: {
      material: string;
      origin: string;
      weight: string;
      technology: string;
    };
  };
  isActive: boolean;
  onClose: () => void;
}

// Enhanced 3D Model Viewer with Detail Mode
export function DetailedSneakerView({
  product,
  isActive,
  onClose,
}: DetailViewProps) {
  const groupRef = useRef<Group>(null);
  const [detailMode, setDetailMode] = useState(false);
  const { scene } = useGLTF(product.model);

  const clonedScene = scene.clone();

  useFrame((state) => {
    if (groupRef.current && isActive) {
      if (detailMode) {
        // Slower, more controlled rotation in detail mode
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        groupRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      } else {
        groupRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
      }
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      {/* Main model with detail mode scaling */}
      <Center>
        <primitive
          object={clonedScene}
          rotation={[0, -Math.PI / 4, 0]}
          scale={detailMode ? 2.2 : 1.8}
        />
      </Center>

      {/* Detail Mode UI */}
      {detailMode && (
        <Html position={[0, 2.5, 0]} center>
          <div
            style={{
              background: "rgba(0,0,0,0.95)",
              border: "2px solid #c9a961",
              padding: "20px",
              borderRadius: "8px",
              fontFamily: "Georgia, serif",
              color: "white",
              maxWidth: "300px",
              pointerEvents: "auto",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#c9a961" }}>
              {product.name}
            </h3>
            <p style={{ fontSize: "0.85rem", margin: "5px 0" }}>
              <strong>Material:</strong>{" "}
              {product.details?.material || "Premium Leather"}
            </p>
            <p style={{ fontSize: "0.85rem", margin: "5px 0" }}>
              <strong>Origin:</strong>{" "}
              {product.details?.origin || "Made in Italy"}
            </p>
            <p style={{ fontSize: "0.85rem", margin: "5px 0" }}>
              <strong>Weight:</strong> {product.details?.weight || "320g"}
            </p>
            <button
              type="button"
              onClick={() => setDetailMode(false)}
              style={{
                marginTop: "15px",
                padding: "8px 20px",
                background: "#c9a961",
                border: "none",
                color: "black",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              Close Detail View
            </button>
          </div>
        </Html>
      )}

      {!detailMode && (
        <Html position={[0, -2, 0]} center>
          <button
            type="button"
            onClick={() => setDetailMode(true)}
            style={{
              padding: "10px 24px",
              background: "rgba(201, 169, 97, 0.9)",
              border: "none",
              color: "black",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              fontSize: "0.8rem",
              letterSpacing: "2px",
              borderRadius: "4px",
              fontWeight: 600,
            }}
          >
            VIEW DETAILS
          </button>
        </Html>
      )}
    </group>
  );
}

// Zoom Controller Hook
export function useZoomToModel(targetPosition: Vector3, isActive: boolean) {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (isActive) {
      // Smooth zoom to model
      const interval = setInterval(() => {
        setZoomLevel((prev) => Math.min(prev + 0.05, 2.5));
      }, 50);

      return () => clearInterval(interval);
    } else {
      setZoomLevel(1);
    }
  }, [isActive]);

  return zoomLevel;
}
