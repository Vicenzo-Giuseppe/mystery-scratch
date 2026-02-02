"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import AnimatedCube from "./AnimatedCube";
import FloatingSpheres from "./FloatingSpheres";
import RotatingRings from "./RotatingRings";
import ParticleField from "./ParticleField";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(to bottom, #0a0a2e, #000000)",
      }}
    >
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />

      {/* Main directional light */}
      <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow />

      {/* Point lights for colorful effects */}
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff0066" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, 10, -10]} intensity={0.8} color="#ffff00" />

      {/* 3D Objects with animations */}
      <AnimatedCube position={[-3, 0, 0]} />
      <FloatingSpheres />
      <RotatingRings />
      <ParticleField count={200} />

      {/* Environment */}
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* Orbit controls for interaction */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
