"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Mini3DViewer } from "@/components/showcase/Mini3DViewer";
import { ProductCard } from "@/components/showcase/ProductCard";
import { HeroSection } from "@/components/showcase/HeroSection";
import { FilterBar } from "@/components/showcase/FilterBar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [filter, setFilter] = useState("all");
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter(
          (p) =>
            p.category === filter || p.trend?.toLowerCase().includes(filter),
        );

  const handleProductClick = (index: number) => {
    setActiveProduct(index);
    // Smooth scroll to 3D viewer
    viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Sticky Header */}
      <motion.header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "20px 40px",
          background: "rgba(10, 10, 10, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201, 169, 97, 0.1)",
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.5rem",
              color: "#c9a961",
              letterSpacing: "4px",
              fontWeight: 400,
            }}
          >
            DRK STUDIO
          </motion.div>

          <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
            {["COLEÇÃO", "SOBRE", "CONTATO"].map((item, i) => (
              <motion.button
                key={item}
                type="button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  letterSpacing: "2px",
                  cursor: "pointer",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#c9a961";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                {item}
              </motion.button>
            ))}

            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={toggleCart}
              style={{
                background: "transparent",
                border: "1px solid rgba(201, 169, 97, 0.3)",
                color: "#c9a961",
                fontFamily: "Georgia, serif",
                fontSize: "0.75rem",
                letterSpacing: "2px",
                cursor: "pointer",
                padding: "10px 16px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                position: "relative",
              }}
            >
              <span>🛒</span>
              <span>CARRINHO</span>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
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
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.div style={{ scale: heroScale }}>
        <HeroSection />
      </motion.div>

      {/* Filter Bar */}
      <FilterBar filter={filter} setFilter={setFilter} />

      {/* Product Grid Section */}
      <section
        style={{
          padding: "80px 40px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "2.5rem",
              color: "#ffffff",
              marginBottom: "16px",
              letterSpacing: "2px",
            }}
          >
            COLEÇÃO EXCLUSIVA
          </h2>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "1rem",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Os sneakers mais desejados do mundo, disponíveis em experiência 3D
            imersiva
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            gridAutoRows: "400px",
          }}
        >
          {filteredProducts.map((product, index) => {
            // Create bento grid pattern
            const isLarge = index === 0 || index === 3 || index === 6;
            const span = isLarge ? 2 : 1;

            return (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isActive={index === activeProduct}
                onClick={() => handleProductClick(index)}
                gridSpan={span}
              />
            );
          })}
        </div>
      </section>

      {/* 3D Viewer Section */}
      <section
        ref={viewerRef}
        style={{
          minHeight: "60vh",
          background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
          borderTop: "1px solid rgba(201, 169, 97, 0.2)",
          position: "relative",
          padding: "60px 40px",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "2rem",
                color: "#c9a961",
                marginBottom: "12px",
                letterSpacing: "2px",
              }}
            >
              EXPERIÊNCIA 3D
            </h2>
            <p
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {products[activeProduct].name} • Arraste para rotacionar • Scroll
              para zoom
            </p>
          </div>

          <Mini3DViewer
            product={products[activeProduct]}
            activeProduct={activeProduct}
            setActiveProduct={setActiveProduct}
            products={products}
          />

          {/* Product Quick Nav */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >
            {products.map((product, index) => (
              <button
                type="button"
                key={product.id}
                onClick={() => setActiveProduct(index)}
                style={{
                  padding: "8px 16px",
                  background:
                    index === activeProduct
                      ? "rgba(201, 169, 97, 0.2)"
                      : "rgba(255,255,255,0.05)",
                  border:
                    index === activeProduct
                      ? "1px solid #c9a961"
                      : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color:
                    index === activeProduct
                      ? "#c9a961"
                      : "rgba(255,255,255,0.6)",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                {product.name.split(" ").slice(0, 2).join(" ")}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "60px 40px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.2rem",
            color: "#c9a961",
            letterSpacing: "4px",
            marginBottom: "20px",
          }}
        >
          DRK STUDIO
        </div>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "2px",
          }}
        >
          SÃO PAULO • XANGAI • PEQUIM • TOQUIO
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
