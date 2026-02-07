"use client";

import dynamic from "next/dynamic";

const ProductShowcase = dynamic(
  () => import("@/components/showcase/ProductShowcase"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #0a0a0a, #1a1a1a)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "1.5rem",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div>Loading DRK STUDIO...</div>
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
              width: "50%",
              height: "100%",
              background: "linear-gradient(90deg, #c9a961, #ff6b6b)",
              borderRadius: "2px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    ),
  },
);

export default function Home() {
  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: "#0a0a0a",
      }}
    >
      <ProductShowcase />
    </main>
  );
}
