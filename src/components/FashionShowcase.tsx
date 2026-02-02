"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useProgress,
  Image,
  Float,
  Plane,
} from "@react-three/drei";
import { Group } from "three";

// MOCK DATA - Coleção DRK Studio 2025
// Substitua estas URLs pelas suas imagens reais em /public/images/
const products = [
  {
    id: "bape-shark-runner",
    name: "BAPE Shark Runner",
    designer: "A Bathing Ape",
    price: "R$ 3.890",
    description: "Edição limitada com design icônico de tubarão. Amortecimento aeroespacial.",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    color: "Black/Camo",
    category: "sneaker",
    badge: "EDIÇÃO LIMITADA",
  },
  {
    id: "rick-geobasket",
    name: "Rick Owens Geo Basket",
    designer: "Rick Owens",
    price: "R$ 8.490",
    description: "Couro italiano premium com solado de borracha vulcanizada. Handmade in Italy.",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80",
    color: "Milk/White",
    category: "sneaker",
    badge: "IMPORTADO",
  },
  {
    id: "balenciaga-track",
    name: "Balenciaga Track 2.0",
    designer: "Balenciaga",
    price: "R$ 6.290",
    description: "Tecnologia de amortecimento avançada. 176 componentes independentes.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    color: "Triple Black",
    category: "sneaker",
    badge: "NOVA COLEÇÃO",
  },
  {
    id: "nike-sacai",
    name: "Nike x Sacai VaporWaffle",
    designer: "Sacai",
    price: "R$ 2.490",
    description: "Colaboração exclusiva Japão. Design de camadas duplas.",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
    color: "Villain Red",
    category: "sneaker",
    badge: "COLLAB",
  },
  {
    id: "new-balance-550",
    name: "New Balance 550",
    designer: "Aimé Leon Dore",
    price: "R$ 1.890",
    description: "Silhueta retrô anos 80. Couro premium com detalhes em camurça.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    color: "Natural Green",
    category: "sneaker",
    badge: "BESTSELLER",
  },
  {
    id: "off-white-jordan",
    name: "Air Jordan 1 x Off-White",
    designer: "Virgil Abloh",
    price: "R$ 12.900",
    description: "A collab mais icônica da década. Autenticidade garantida.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
    color: "Chicago",
    category: "sneaker",
    badge: "RARIDADE",
  },
];

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
          CARREGANDO COLEÇÃO
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
      </div>
    </Html>
  );
}

function ProductImage({
  product,
  position,
  isActive,
}: {
  product: (typeof products)[0];
  position: [number, number, number];
  isActive: boolean;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      if (isActive) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
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
        <group scale={isActive ? 2.4 : 0.85}>
          <Image
            url={product.image}
            scale={[2.2, 2.2]}
            position={[0, 0, 0]}
            transparent
            opacity={0.98}
            side={2}
          />

          {isActive && (
            <Plane
              args={[2.3, 2.3]}
              position={[0, 0, -0.02]}
            >
              <meshBasicMaterial
                color="#c9a961"
                transparent
                opacity={0.12}
              />
            </Plane>
          )}

          {isActive && (
            <Html position={[0, -1.6, 0]} center distanceFactor={8}>
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
                {product.price}
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
      <ambientLight intensity={0.3} />
      <directionalLight position={[8, 12, 8]} intensity={1.2} color="#fff8f0" />
      <directionalLight position={[-8, 8, -5]} intensity={0.6} color="#c9a961" />
      <directionalLight position={[0, 5, -10]} intensity={0.4} color="#e6e6fa" />
      <Environment preset="studio" />

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.5}
        scale={25}
        blur={3}
        far={5}
      />

      <group position={[0, 0.3, 0]}>
        {products.map((product, index) => {
          const offset = (index - activeProduct) * 5.5;
          const zOffset = index === activeProduct ? 0 : -1.5;
          return (
            <ProductImage
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
        minDistance={5}
        maxDistance={12}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.15}
      />
    </>
  );
}

export default function FashionShowcase() {
  const [activeProduct, setActiveProduct] = useState(0);
  const currentProduct = products[activeProduct];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<Loader />}>
          <Scene
            activeProduct={activeProduct}
            setActiveProduct={setActiveProduct}
          />
        </Suspense>
      </Canvas>

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
          IMPORTAÇÃO EXCLUSIVA
        </div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "2.8rem",
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: "14px",
            margin: 0,
            textShadow: "0 2px 20px rgba(201, 169, 97, 0.2)",
          }}
        >
          DRK STUDIO
        </h1>
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

      <div
        style={{
          position: "fixed",
          top: "30px",
          right: "40px",
          zIndex: 100,
          display: "flex",
          gap: "25px",
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
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a961")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          >
            {item}
          </button>
        ))}
      </div>

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
            {currentProduct.price}
          </div>

          <button
            type="button"
            style={{
              background: "#c9a961",
              border: "none",
              padding: "14px 36px",
              color: "#0a0a0a",
              fontFamily: "Georgia, serif",
              fontSize: "0.75rem",
              letterSpacing: "3px",
              cursor: "pointer",
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
            RESERVAR
          </button>
        </div>
      </div>

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
        }}
      >
        CLIQUE NA LISTA PARA NAVEGAR • ARRASTE PARA ROTACIONAR
      </div>
    </div>
  );
}
