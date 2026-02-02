"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
  Html,
  useProgress,
} from "@react-three/drei";
import { Group } from "three";
import { Sneaker } from "./clothing/Sneaker";
import { Jacket } from "./clothing/Jacket";
import { CharacterBase } from "./clothing/CharacterBase";
import { ClothingControls } from "./clothing/ClothingControls";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          color: "white",
          fontFamily: "system-ui",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Loading 3D Assets...
        </div>
        <div
          style={{
            width: "200px",
            height: "4px",
            background: "#333",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#ff3366",
              borderRadius: "2px",
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>
    </Html>
  );
}

function Scene({
  currentOutfit,
  setCurrentOutfit,
  selectedItem,
  setSelectedItem,
  rotationSpeed,
}: {
  currentOutfit: "casual" | "street" | "formal" | "sporty";
  setCurrentOutfit: (outfit: "casual" | "street" | "formal" | "sporty") => void;
  selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
  rotationSpeed: number;
}) {
  const groupRef = useRef<Group>(null);

  const outfits: Record<
    string,
    {
      sneakerColor: string;
      jacketColor: string;
      pantsColor: string;
      accentColor: string;
    }
  > = {
    casual: {
      sneakerColor: "#ffffff",
      jacketColor: "#2d3436",
      pantsColor: "#0984e3",
      accentColor: "#fdcb6e",
    },
    street: {
      sneakerColor: "#ff0066",
      jacketColor: "#1a1a2e",
      pantsColor: "#000000",
      accentColor: "#00ffff",
    },
    formal: {
      sneakerColor: "#2d3436",
      jacketColor: "#636e72",
      pantsColor: "#2d3436",
      accentColor: "#b2bec3",
    },
    sporty: {
      sneakerColor: "#00b894",
      jacketColor: "#fdcb6e",
      pantsColor: "#e17055",
      accentColor: "#6c5ce7",
    },
  };

  const currentStyle = outfits[currentOutfit];

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#ff99cc" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />

      <Environment preset="city" />

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={20}
        blur={2.5}
        far={4}
      />

      <group ref={groupRef} position={[0, -0.5, 0]}>
        <CharacterBase
          outfit={currentOutfit}
          selectedItem={selectedItem}
          onItemClick={setSelectedItem}
        />

        <Float
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.5}
          floatingRange={[-0.1, 0.1]}
        >
          <Jacket
            color={currentStyle.jacketColor}
            accentColor={currentStyle.accentColor}
            position={[-2, 0, 0]}
            rotation={[0, 0.5, 0]}
            isSelected={selectedItem === "jacket"}
            onClick={() => setSelectedItem("jacket")}
          />
        </Float>

        <Float
          speed={1.5}
          rotationIntensity={0.3}
          floatIntensity={0.3}
          floatingRange={[-0.05, 0.05]}
        >
          <Sneaker
            color={currentStyle.sneakerColor}
            accentColor={currentStyle.accentColor}
            position={[2, -0.5, 0.5]}
            rotation={[0, -0.5, 0]}
            scale={0.8}
            isSelected={selectedItem === "sneakers"}
            onClick={() => setSelectedItem("sneakers")}
          />
        </Float>

        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
          <mesh
            position={[0, 1.5, 2]}
            rotation={[0, Math.PI, 0]}
            onClick={() => setSelectedItem("pants")}
          >
            <cylinderGeometry args={[0.35, 0.3, 1.2, 32]} />
            <meshStandardMaterial
              color={currentStyle.pantsColor}
              roughness={0.7}
            />
          </mesh>
        </Float>
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default function ClothingDisplay() {
  const [currentOutfit, setCurrentOutfit] = useState<
    "casual" | "street" | "formal" | "sporty"
  >("casual");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);

  return (
    <div style={{ width: "100%", height: "100vh", background: "#0a0a0a", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 1, 6], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<Loader />}>
          <Scene
            currentOutfit={currentOutfit}
            setCurrentOutfit={setCurrentOutfit}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            rotationSpeed={rotationSpeed}
          />
        </Suspense>
      </Canvas>
      
      <ClothingControls
        currentOutfit={currentOutfit}
        onOutfitChange={setCurrentOutfit}
        rotationSpeed={rotationSpeed}
        onRotationSpeedChange={setRotationSpeed}
        selectedItem={selectedItem}
        onItemSelect={setSelectedItem}
      />
    </div>
  );
}
