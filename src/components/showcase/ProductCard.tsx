"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/ecommerce";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

interface ProductCardProps {
  product: Product;
  index: number;
  isActive: boolean;
  onClick: () => void;
  gridSpan?: number;
}

export function ProductCard({
  product,
  index,
  isActive,
  onClick,
  gridSpan,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ transform: "" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({ transform: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        gridColumn: `span ${gridSpan}`,
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.03)",
        border: isActive
          ? "1px solid #c9a961"
          : "1px solid rgba(255, 255, 255, 0.1)",
        cursor: "pointer",
        transition: "border-color 0.3s",
        ...tiltStyle,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Glassmorphism Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isHovered
            ? "linear-gradient(135deg, rgba(201, 169, 97, 0.1) 0%, rgba(255,255,255,0.05) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
          backdropFilter: "blur(10px)",
          zIndex: 0,
        }}
      />

      {/* Product Image Placeholder */}
      <div
        style={{
          position: "relative",
          height: gridSpan === 2 ? "300px" : "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{
            y: isHovered ? -10 : 0,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: "120px",
            height: "120px",
            background: "rgba(201, 169, 97, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            border: "2px solid rgba(201, 169, 97, 0.3)",
          }}
        >
          👟
        </motion.div>

        {/* Badge */}
        {product.badge && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              padding: "6px 12px",
              background: "rgba(201, 169, 97, 0.2)",
              border: "1px solid rgba(201, 169, 97, 0.4)",
              borderRadius: "4px",
              fontFamily: "Georgia, serif",
              fontSize: "0.65rem",
              color: "#c9a961",
              letterSpacing: "2px",
              zIndex: 2,
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Trend Badge */}
        {product.trend && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              padding: "4px 10px",
              background: "rgba(255, 107, 107, 0.2)",
              border: "1px solid rgba(255, 107, 107, 0.4)",
              borderRadius: "4px",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.6rem",
              color: "#ff6b6b",
              letterSpacing: "1px",
              fontWeight: 600,
              zIndex: 2,
            }}
          >
            {product.trend}
          </div>
        )}

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            zIndex: 3,
            padding: "20px",
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            style={{
              padding: "12px 24px",
              background: "#c9a961",
              border: "none",
              color: "#0a0a0a",
              fontFamily: "Georgia, serif",
              fontSize: "0.75rem",
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
            VER EM 3D
          </button>

          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
            }}
          >
            <AddToCartButton product={product} variant="minimal" />
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div
        style={{
          padding: "24px",
          position: "relative",
          zIndex: 1,
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
            fontSize: gridSpan === 2 ? "1.4rem" : "1.1rem",
            color: "#ffffff",
            marginBottom: "12px",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "16px",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.2rem",
              color: "#c9a961",
              fontWeight: 600,
            }}
          >
            {product.priceFormatted}
          </div>

          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {product.sizes.length} tamanhos
          </div>
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "#c9a961",
          }}
        />
      )}
    </motion.div>
  );
}
