"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Html,
  useProgress,
  useGLTF,
  Center,
  Float,
} from "@react-three/drei";
import { Group } from "three";
import { Product } from "@/types/ecommerce";
import { motion } from "framer-motion";

interface Mini3DViewerProps {
  product: Product;
  activeProduct: number;
  setActiveProduct: (index: number) => void;
  products: Product[];
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          color: "#c9a961",
          fontFamily: "Georgia, serif",
          fontSize: "0.8rem",
          letterSpacing: "2px",
        }}
      >
        {Math.round(progress)}%
      </div>
    </Html>
  );
}

function SneakerModel({ product }: { product: Product }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(product.model);
  const clonedScene = scene.clone();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Center>
          <primitive
            object={clonedScene}
            scale={1.2}
            rotation={[0, -Math.PI / 4, 0]}
          />
        </Center>
      </Float>
    </group>
  );
}

function Scene({ product }: { product: Product }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#fff8f0" />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.8}
        color="#c9a961"
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={1}
        color="#ffffff"
      />

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      <Suspense fallback={<Loader />}>
        <SneakerModel product={product} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  );
}

export function Mini3DViewer({
  product,
  activeProduct,
  setActiveProduct,
  products,
}: Mini3DViewerProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: "40px",
        alignItems: "center",
      }}
    >
      {/* 3D Canvas */}
      <div
        style={{
          height: "400px",
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: "16px",
          border: "1px solid rgba(201, 169, 97, 0.2)",
          overflow: "hidden",
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Scene product={product} />
        </Canvas>
      </div>

      {/* Product Info Panel */}
      <motion.div
        key={product.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          padding: "30px",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.75rem",
            color: "#c9a961",
            letterSpacing: "2px",
            marginBottom: "8px",
          }}
        >
          {product.designer.toUpperCase()}
        </div>

        <h3
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.8rem",
            color: "#ffffff",
            marginBottom: "12px",
            lineHeight: 1.2,
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.6)",
            marginBottom: "20px",
            lineHeight: 1.6,
          }}
        >
          {product.description}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          {product.badge && (
            <span
              style={{
                padding: "4px 12px",
                background: "rgba(201, 169, 97, 0.2)",
                border: "1px solid rgba(201, 169, 97, 0.4)",
                borderRadius: "4px",
                fontSize: "0.7rem",
                color: "#c9a961",
                letterSpacing: "1px",
              }}
            >
              {product.badge}
            </span>
          )}
          {product.trend && (
            <span
              style={{
                padding: "4px 12px",
                background: "rgba(255, 107, 107, 0.2)",
                border: "1px solid rgba(255, 107, 107, 0.4)",
                borderRadius: "4px",
                fontSize: "0.7rem",
                color: "#ff6b6b",
                letterSpacing: "1px",
              }}
            >
              {product.trend}
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "2rem",
            color: "#c9a961",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          {product.priceFormatted}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "14px 24px",
              background: "#c9a961",
              border: "none",
              color: "#0a0a0a",
              fontFamily: "Georgia, serif",
              fontSize: "0.8rem",
              letterSpacing: "2px",
              cursor: "pointer",
              borderRadius: "4px",
              fontWeight: 600,
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#c9a961";
            }}
          >
            ADICIONAR AO CARRINHO
          </button>
        </div>
      </motion.div>
    </div>
  );
}
