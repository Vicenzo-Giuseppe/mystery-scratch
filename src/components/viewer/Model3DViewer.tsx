"use client";

import { useRef, useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useProgress,
  useGLTF,
  Center,
  Float,
  Plane,
} from "@react-three/drei";
import { Group, Vector3 } from "three";
import { Product } from "@/types/ecommerce";

interface Model3DViewerProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          color: "white",
          fontFamily: "Georgia, serif",
          textAlign: "center",
          letterSpacing: "3px",
        }}
      >
        <div
          style={{
            fontSize: "0.9rem",
            marginBottom: "2rem",
            fontWeight: 300,
            color: "#c9a961",
          }}
        >
          CARREGANDO MODELO 3D
        </div>
        <div
          style={{
            width: "150px",
            height: "2px",
            background: "rgba(255,255,255,0.2)",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#c9a961",
              transition: "width 0.3s",
            }}
          />
        </div>
        <div
          style={{
            fontSize: "0.7rem",
            marginTop: "1rem",
            opacity: 0.5,
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
}

function SneakerModel({
  product,
  autoRotate,
  exploded,
}: {
  product: Product;
  autoRotate: boolean;
  exploded: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(product.model);
  const clonedScene = scene.clone();

  useFrame((state) => {
    if (groupRef.current) {
      if (autoRotate) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      }

      if (exploded) {
        // Animate exploded view
        const children = groupRef.current.children;
        children.forEach((child, index) => {
          const offset = index * 0.5;
          child.position.y =
            Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + offset * 0.3;
        });
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <Center>
          <primitive
            object={clonedScene}
            scale={1.8}
            rotation={[0, -Math.PI / 4, 0]}
          />
        </Center>
      </Float>

      {/* Ground plane for shadows */}
      <Plane
        args={[5, 5]}
        position={[0, -1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.5} />
      </Plane>
    </group>
  );
}

function Scene({
  product,
  autoRotate,
  exploded,
}: {
  product: Product;
  autoRotate: boolean;
  exploded: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.5}
        color="#fff8f0"
        castShadow
      />
      <directionalLight
        position={[-8, 8, -5]}
        intensity={0.8}
        color="#c9a961"
      />
      <directionalLight
        position={[0, 5, -10]}
        intensity={0.5}
        color="#e6e6fa"
      />
      <spotLight
        position={[0, 15, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={1}
        castShadow
      />

      <Environment preset="studio" />

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      <Suspense fallback={<Loader />}>
        <SneakerModel
          product={product}
          autoRotate={autoRotate}
          exploded={exploded}
        />
      </Suspense>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={2}
        maxDistance={10}
        autoRotate={false}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  );
}

export function Model3DViewer({
  product,
  isOpen,
  onClose,
}: Model3DViewerProps) {
  const [windowState, setWindowState] = useState<WindowState>({
    x: window.innerWidth - 520,
    y: 100,
    width: 500,
    height: 500,
    isMinimized: false,
    isMaximized: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".viewer-controls")) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setWindowState((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleMaximize = () => {
    setWindowState((prev) => ({
      ...prev,
      isMaximized: !prev.isMaximized,
      x: !prev.isMaximized ? 0 : window.innerWidth - 520,
      y: !prev.isMaximized ? 0 : 100,
      width: !prev.isMaximized ? window.innerWidth : 500,
      height: !prev.isMaximized ? window.innerHeight : 500,
    }));
  };

  const toggleMinimize = () => {
    setWindowState((prev) => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={windowRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: windowState.x,
            y: windowState.y,
            width: windowState.isMinimized ? 300 : windowState.width,
            height: windowState.isMinimized ? 60 : windowState.height,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{
            position: "fixed",
            backgroundColor: "#0a0a0a",
            border: "1px solid rgba(201, 169, 97, 0.4)",
            borderRadius: "8px",
            zIndex: 3000,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Window Header / Title Bar */}
          <div
            role="button"
            tabIndex={0}
            onMouseDown={handleMouseDown}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleMouseDown(e as unknown as React.MouseEvent);
              }
            }}
            style={{
              height: "44px",
              background: "linear-gradient(90deg, #1a1a1a 0%, #0a0a0a 100%)",
              borderBottom: "1px solid rgba(201, 169, 97, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#ff5f57",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
                <button
                  type="button"
                  onClick={toggleMinimize}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#febc2e",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
                <button
                  type="button"
                  onClick={toggleMaximize}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#28c840",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  letterSpacing: "1px",
                }}
              >
                {product.name}
              </span>
            </div>

            <div
              className="viewer-controls"
              style={{ display: "flex", gap: "8px" }}
            >
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                style={{
                  padding: "4px 8px",
                  background: autoRotate
                    ? "rgba(201, 169, 97, 0.3)"
                    : "transparent",
                  border: "1px solid rgba(201, 169, 97, 0.3)",
                  borderRadius: "4px",
                  color: "#c9a961",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                }}
                title="Auto Rotate"
              >
                ↻
              </button>
              <button
                type="button"
                onClick={() => setExploded(!exploded)}
                style={{
                  padding: "4px 8px",
                  background: exploded
                    ? "rgba(201, 169, 97, 0.3)"
                    : "transparent",
                  border: "1px solid rgba(201, 169, 97, 0.3)",
                  borderRadius: "4px",
                  color: "#c9a961",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                }}
                title="Exploded View"
              >
                ⚡
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          {!windowState.isMinimized && (
            <div style={{ flex: 1, position: "relative" }}>
              <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <Scene
                  product={product}
                  autoRotate={autoRotate}
                  exploded={exploded}
                />
              </Canvas>

              {/* Overlay Controls */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "8px",
                  background: "rgba(0, 0, 0, 0.8)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "1px solid rgba(201, 169, 97, 0.3)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  style={{
                    padding: "6px 12px",
                    background: "transparent",
                    border: "none",
                    color: "#c9a961",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  Grid
                </button>
                <button
                  type="button"
                  style={{
                    padding: "6px 12px",
                    background: "transparent",
                    border: "none",
                    color: "#c9a961",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  style={{
                    padding: "6px 12px",
                    background: "transparent",
                    border: "none",
                    color: "#c9a961",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  AR View
                </button>
              </div>

              {/* Instructions */}
              <div
                style={{
                  position: "absolute",
                  bottom: "60px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.65rem",
                  color: "rgba(255, 255, 255, 0.4)",
                  letterSpacing: "1px",
                  pointerEvents: "none",
                }}
              >
                Arraste para rotacionar • Scroll para zoom
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
