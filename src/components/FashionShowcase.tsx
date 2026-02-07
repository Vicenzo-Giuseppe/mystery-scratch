"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useProgress,
  useGLTF,
  Float,
  Plane,
  Center,
} from "@react-three/drei";
import { Group } from "three";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Model3DViewer } from "@/components/viewer/Model3DViewer";
import Link from "next/link";

function Loader() {
  const { progress, errors } = useProgress();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setLoadingTimeout(true);
      }
    }, 30000); // 30 second timeout
    return () => clearTimeout(timer);
  }, [progress]);

  if (loadingTimeout && progress < 100) {
    return (
      <Html center>
        <div
          style={{
            color: "white",
            fontFamily: "Georgia, serif",
            textAlign: "center",
            letterSpacing: "3px",
            maxWidth: "300px",
          }}
        >
          <div
            style={{
              fontSize: "1.1rem",
              marginBottom: "2rem",
              fontWeight: 300,
              color: "#c9a961",
            }}
          >
            DRK STUDIO
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              marginBottom: "2rem",
              fontWeight: 300,
              color: "#ff6b6b",
            }}
          >
            Erro ao carregar modelos
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              marginBottom: "1rem",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Alguns modelos 3D não puderam ser carregados.
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              background: "#c9a961",
              border: "none",
              color: "#0a0a0a",
              fontFamily: "Georgia, serif",
              fontSize: "0.75rem",
              letterSpacing: "2px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            TENTAR NOVAMENTE
          </button>
        </div>
      </Html>
    );
  }

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
            fontSize: "1.1rem",
            marginBottom: "2rem",
            fontWeight: 300,
            color: "#c9a961",
          }}
        >
          DRK STUDIO
        </div>
        <div
          style={{
            fontSize: "0.9rem",
            marginBottom: "2rem",
            fontWeight: 300,
          }}
        >
          CARREGANDO MODELOS 3D
        </div>
        <div
          style={{
            width: "150px",
            height: "1px",
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
            letterSpacing: "2px",
          }}
        >
          {Math.round(progress)}%
        </div>
        {errors.length > 0 && (
          <div
            style={{
              fontSize: "0.6rem",
              marginTop: "0.5rem",
              color: "#ff6b6b",
              opacity: 0.7,
            }}
          >
            {errors.length} erro(s) de carregamento
          </div>
        )}
      </div>
    </Html>
  );
}

function SneakerModel({
  product,
  position,
  isActive,
}: {
  product: (typeof products)[0];
  position: [number, number, number];
  isActive: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(product.model);

  const clonedScene = scene.clone();

  useFrame((state) => {
    if (groupRef.current) {
      if (isActive) {
        groupRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
        groupRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
      } else {
        groupRef.current.rotation.y = position[0] * 0.05;
        groupRef.current.position.y = position[1];
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Float
        speed={isActive ? 0.4 : 1.2}
        rotationIntensity={isActive ? 0.08 : 0.2}
        floatIntensity={isActive ? 0.15 : 0.4}
      >
        <group scale={isActive ? 1.5 : 0.55}>
          <Center>
            <primitive object={clonedScene} rotation={[0, -Math.PI / 4, 0]} />
          </Center>

          {isActive && (
            <Plane args={[3, 3]} position={[0, 0, -1]} rotation={[0, 0, 0]}>
              <meshBasicMaterial color="#c9a961" transparent opacity={0.08} />
            </Plane>
          )}

          {isActive && (
            <Html position={[0, -1.8, 0]} center distanceFactor={8}>
              <div
                style={{
                  background: "rgba(0,0,0,0.95)",
                  border: "1px solid #c9a961",
                  padding: "12px 28px",
                  borderRadius: "2px",
                  fontFamily: "Georgia, serif",
                  fontSize: "1.1rem",
                  color: "#c9a961",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  letterSpacing: "1px",
                }}
              >
                {product.priceFormatted}
              </div>
            </Html>
          )}
        </group>
      </Float>
    </group>
  );
}

function Scene({
  activeProduct,
  setActiveProduct,
}: {
  activeProduct: number;
  setActiveProduct: (index: number) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
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
        color="#ffffff"
        castShadow
      />
      <Environment preset="studio" />
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.6}
        scale={25}
        blur={4}
        far={6}
      />

      <group position={[0, 0.5, 0]}>
        {products.map((product, index) => {
          const offset = (index - activeProduct) * 5.5;
          const zOffset = index === activeProduct ? 0 : -1.5;
          return (
            <SneakerModel
              key={product.id}
              product={product}
              position={[offset, 0, zOffset]}
              isActive={index === activeProduct}
            />
          );
        })}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={25}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.15}
        zoomSpeed={0.8}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  );
}

export default function FashionShowcase() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const currentProduct = products[activeProduct];
  const totalItems = getTotalItems();

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          <Scene
            activeProduct={activeProduct}
            setActiveProduct={setActiveProduct}
          />
        </Suspense>
      </Canvas>

      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 100,
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.65rem",
            letterSpacing: "10px",
            color: "#c9a961",
            marginBottom: "6px",
          }}
        >
          COLEÇÃO TRENDING 2024-2025
        </div>
        <Link
          href="/"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "2.8rem",
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: "14px",
            margin: 0,
            textShadow: "0 2px 20px rgba(201, 169, 97, 0.2)",
            textDecoration: "none",
          }}
        >
          DRK STUDIO
        </Link>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.6rem",
            letterSpacing: "5px",
            color: "rgba(255,255,255,0.35)",
            marginTop: "6px",
          }}
        >
          SÃO PAULO • XANGAI • PEQUIM • TOQUIO
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          position: "fixed",
          top: "30px",
          right: "40px",
          zIndex: 100,
          display: "flex",
          gap: "25px",
          alignItems: "center",
        }}
      >
        {["COLEÇÃO", "SOBRE", "CONTATO"].map((item) => (
          <button
            type="button"
            key={item}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "Georgia, serif",
              fontSize: "0.7rem",
              letterSpacing: "2px",
              cursor: "pointer",
              padding: "8px 0",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#c9a961";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
          >
            {item}
          </button>
        ))}

        {/* Cart Button */}
        <button
          type="button"
          onClick={toggleCart}
          style={{
            background: "transparent",
            border: "1px solid rgba(201, 169, 97, 0.3)",
            color: "#c9a961",
            fontFamily: "Georgia, serif",
            fontSize: "0.7rem",
            letterSpacing: "2px",
            cursor: "pointer",
            padding: "10px 16px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(201, 169, 97, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span>🛒</span>
          <span>CARRINHO</span>
          {totalItems > 0 && (
            <span
              style={{
                background: "#c9a961",
                color: "#0a0a0a",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* 3D Badge */}
      <button
        type="button"
        style={{
          position: "fixed",
          top: "100px",
          right: "40px",
          zIndex: 100,
          background: "rgba(201, 169, 97, 0.1)",
          border: "1px solid rgba(201, 169, 97, 0.3)",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onClick={() => setIsViewerOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(201, 169, 97, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(201, 169, 97, 0.1)";
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.65rem",
            letterSpacing: "3px",
            color: "#c9a961",
          }}
        >
          EXPERIÊNCIA 3D ↗
        </div>
      </button>

      {/* Product Info */}
      <div
        style={{
          position: "fixed",
          bottom: "60px",
          left: "50px",
          zIndex: 100,
          maxWidth: "420px",
        }}
      >
        {currentProduct.badge && (
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.6rem",
              letterSpacing: "3px",
              color: "#c9a961",
              marginBottom: "10px",
              border: "1px solid rgba(201, 169, 97, 0.4)",
              display: "inline-block",
              padding: "4px 10px",
            }}
          >
            {currentProduct.badge}
          </div>
        )}

        {(currentProduct as (typeof products)[0] & { trend?: string })
          .trend && (
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.5rem",
              letterSpacing: "4px",
              color: "#ff6b6b",
              marginBottom: "15px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {
              (currentProduct as (typeof products)[0] & { trend?: string })
                .trend
            }
          </div>
        )}

        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.6rem",
            letterSpacing: "3px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "10px",
          }}
        >
          {currentProduct.designer.toUpperCase()}
        </div>

        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "2.2rem",
            fontWeight: 400,
            color: "#ffffff",
            margin: "0 0 14px 0",
            lineHeight: 1.1,
          }}
        >
          {currentProduct.name}
        </h2>

        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.7,
            margin: "0 0 20px 0",
            fontWeight: 300,
          }}
        >
          {currentProduct.description}
        </p>

        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "1px",
            marginBottom: "24px",
          }}
        >
          Cor: {currentProduct.color}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.6rem",
              color: "#ffffff",
              letterSpacing: "1px",
            }}
          >
            {currentProduct.priceFormatted}
          </div>

          <AddToCartButton product={currentProduct} />
        </div>
      </div>

      {/* Product Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: "60px",
          right: "50px",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {products.map((product, index) => (
          <button
            type="button"
            key={product.id}
            onClick={() => setActiveProduct(index)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "right",
              padding: "10px 0",
              opacity: index === activeProduct ? 1 : 0.35,
              transition: "opacity 0.3s",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.65rem",
                color: "#c9a961",
                letterSpacing: "2px",
                minWidth: "25px",
              }}
            >
              0{index + 1}
            </span>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.85rem",
                color: "#ffffff",
                letterSpacing: "1px",
              }}
            >
              {product.name}
            </span>
            {index === activeProduct && (
              <div
                style={{
                  width: "25px",
                  height: "1px",
                  background: "#c9a961",
                  marginLeft: "8px",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div
        style={{
          position: "fixed",
          bottom: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "Georgia, serif",
          fontSize: "0.6rem",
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.2)",
          zIndex: 100,
          textAlign: "center",
        }}
      >
        CLIQUE NA LISTA PARA NAVEGAR • SCROLL PARA ZOOM • ARRASTE PARA
        ROTACIONAR
      </div>

      {/* Zoom indicator */}
      <div
        style={{
          position: "fixed",
          bottom: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.5rem",
          letterSpacing: "3px",
          color: "#c9a961",
          zIndex: 100,
          opacity: 0.6,
          padding: "4px 12px",
          border: "1px solid rgba(201, 169, 97, 0.3)",
          borderRadius: "2px",
        }}
      >
        2x ZOOM ATIVADO
      </div>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* 3D Model Viewer Modal */}
      <Model3DViewer
        product={currentProduct}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
}
