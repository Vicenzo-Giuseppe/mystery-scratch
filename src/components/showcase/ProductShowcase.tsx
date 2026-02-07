"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Mini3DViewer } from "@/components/showcase/Mini3DViewer";
import { ProductCard } from "@/components/showcase/ProductCard";
import { HeroSection } from "@/components/showcase/HeroSection";
import { FilterBar } from "@/components/showcase/FilterBar";

export default function ProductShowcase() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [filter, setFilter] = useState("all");
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const viewerRef = useRef<HTMLDivElement>(null);

  // Simple scroll handler for header visibility
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsHeaderVisible(scrollTop > 100);
  };

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter(
          (p) =>
            p.category === filter || p.trend?.toLowerCase().includes(filter),
        );

  const handleProductClick = (index: number) => {
    setActiveProduct(index);
    viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      onScroll={handleScroll}
      style={{
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
      }}
    >
      {/* Header - Always visible on scroll */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "20px 40px",
          background: "rgba(10, 10, 10, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201, 169, 97, 0.2)",
          pointerEvents: isHeaderVisible ? "auto" : "none",
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
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.5rem",
              color: "#c9a961",
              letterSpacing: "4px",
              fontWeight: 400,
            }}
          >
            DRK STUDIO
          </div>

          <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
            {["COLEÇÃO", "SOBRE", "CONTATO"].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => {
                  if (item === "COLEÇÃO") {
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.75rem",
                  letterSpacing: "2px",
                  cursor: "pointer",
                  transition: "color 0.3s",
                  padding: "8px 12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#c9a961";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                {item}
              </button>
            ))}

            <button
              type="button"
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
                <span
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
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <HeroSection />

      {/* Filter Bar */}
      <FilterBar filter={filter} setFilter={setFilter} />

      {/* Product Grid Section */}
      <section
        id="products"
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

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isActive={index === activeProduct}
              onClick={() => handleProductClick(index)}
            />
          ))}
        </div>
      </section>

      {/* 3D Viewer Section */}
      <section
        ref={viewerRef}
        id="viewer"
        style={{
          minHeight: "80vh",
          background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
          borderTop: "1px solid rgba(201, 169, 97, 0.2)",
          padding: "80px 40px",
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
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "2.5rem",
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
                fontSize: "1rem",
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
              marginTop: "40px",
              flexWrap: "wrap",
            }}
          >
            {products.map((product, index) => (
              <button
                type="button"
                key={product.id}
                onClick={() => setActiveProduct(index)}
                style={{
                  padding: "10px 20px",
                  background:
                    index === activeProduct
                      ? "#c9a961"
                      : "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: "4px",
                  color:
                    index === activeProduct
                      ? "#0a0a0a"
                      : "rgba(255,255,255,0.7)",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  fontWeight: index === activeProduct ? 600 : 400,
                }}
              >
                {product.name}
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
          background: "#050505",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.5rem",
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
            fontSize: "0.85rem",
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
