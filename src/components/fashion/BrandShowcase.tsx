"use client";

import { useState } from "react";

interface BrandShowcaseProps {
  currentItem: "sneaker" | "jacket" | "accessory";
  setCurrentItem: (item: "sneaker" | "jacket" | "accessory") => void;
  selectedVariant: string;
  setSelectedVariant: (variant: string) => void;
}

export function BrandShowcase({
  currentItem,
  setCurrentItem,
  selectedVariant,
  setSelectedVariant,
}: BrandShowcaseProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const products = {
    sneaker: {
      name: "Sneaker Tech-Lux",
      designer: "Maison Shenzhen",
      price: "R$ 4.890",
      description: "Edição limitada com tecnologia de amortecimento aeroespacial",
      variants: ["classic", "limited", "stealth"],
    },
    jacket: {
      name: "Jaqueta Neo-Tokyo",
      designer: "Studio Shanghai",
      price: "R$ 8.290",
      description: "Couro sintético premium com aquecimento inteligente",
      variants: ["midnight", "crimson", "obsidian"],
    },
    accessory: {
      name: "Mochila Matrix",
      designer: "Atelier Beijing",
      price: "R$ 2.490",
      description: "Fibra de carbono com carregamento solar integrado",
      variants: ["tactical", "urban", "minimal"],
    },
  };

  const currentProduct = products[currentItem];

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 100,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.9rem",
            letterSpacing: "8px",
            color: "#c9a961",
            marginBottom: "8px",
            fontWeight: 400,
          }}
        >
          IMPORTAÇÃO EXCLUSIVA
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2.5rem",
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: "12px",
            margin: 0,
            textShadow: "0 2px 20px rgba(201, 169, 97, 0.3)",
          }}
        >
          DRK STUDIO
        </h1>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.75rem",
            letterSpacing: "4px",
            color: "rgba(255,255,255,0.4)",
            marginTop: "8px",
          }}
        >
          SÃO PAULO • XANGAI • PEQUIM
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          top: "40px",
          right: "40px",
          zIndex: 100,
          display: "flex",
          gap: "30px",
        }}
      >
        {["COLEÇÃO", "SOBRE", "CONTATO"].map((item) => (
          <button
            key={item}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.75rem",
              letterSpacing: "3px",
              cursor: "pointer",
              transition: "color 0.3s",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a961")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "60px",
          left: "60px",
          zIndex: 100,
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.65rem",
            letterSpacing: "3px",
            color: "#c9a961",
            marginBottom: "12px",
          }}
        >
          {currentProduct.designer.toUpperCase()}
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            fontWeight: 400,
            color: "#ffffff",
            margin: "0 0 16px 0",
            lineHeight: 1.2,
          }}
        >
          {currentProduct.name}
        </h2>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
            margin: "0 0 24px 0",
            fontWeight: 300,
          }}
        >
          {currentProduct.description}
        </p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          {currentProduct.variants.map((variant) => (
            <button
              key={variant}
              onClick={() => setSelectedVariant(variant)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border:
                  selectedVariant === variant
                    ? "2px solid #c9a961"
                    : "1px solid rgba(255,255,255,0.2)",
                background:
                  variant === "classic" || variant === "midnight" || variant === "tactical"
                    ? "#1a1a1a"
                    : variant === "limited" || variant === "crimson"
                    ? "#8b0000"
                    : variant === "stealth" || variant === "obsidian"
                    ? "#000000"
                    : variant === "urban"
                    ? "#4a4a4a"
                    : "#f5f5f5",
                cursor: "pointer",
                transition: "all 0.3s",
                position: "relative",
              }}
            >
              {selectedVariant === variant && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "8px",
                    height: "8px",
                    background: "#c9a961",
                    borderRadius: "50%",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              color: "#ffffff",
            }}
          >
            {currentProduct.price}
          </div>

          <button
            style={{
              background: "#c9a961",
              border: "none",
              padding: "16px 40px",
              color: "#0a0a0a",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.8rem",
              letterSpacing: "3px",
              cursor: "pointer",
              transition: "all 0.3s",
              fontWeight: 600,
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
          right: "60px",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {[
          { id: "sneaker", label: "01", name: "Sneakers" },
          { id: "jacket", label: "02", name: "Jaquetas" },
          { id: "accessory", label: "03", name: "Acessórios" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentItem(item.id as any);
              setSelectedVariant("classic");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "10px 0",
              opacity: currentItem === item.id ? 1 : 0.4,
              transition: "opacity 0.3s",
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.75rem",
                color: "#c9a961",
                letterSpacing: "2px",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                color: "#ffffff",
                letterSpacing: "2px",
              }}
            >
              {item.name}
            </span>
            {currentItem === item.id && (
              <div
                style={{
                  width: "30px",
                  height: "1px",
                  background: "#c9a961",
                  marginLeft: "10px",
                }}
              />
            )}
          </button>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "0.65rem",
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.3)",
          zIndex: 100,
        }}
      >
        ARRASTE PARA ROTACIONAR • SCROLL PARA ZOOM
      </div>
    </>
  );
}
