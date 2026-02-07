"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { Product, SIZE_CONVERSION } from "@/types/ecommerce";
import toast from "react-hot-toast";

interface AddToCartButtonProps {
  product: Product;
  variant?: "default" | "large" | "minimal";
}

export function AddToCartButton({
  product,
  variant = "default",
}: AddToCartButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isInCart, getItemQuantity } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedSize) {
      setIsModalOpen(true);
      return;
    }

    addItem(product, selectedSize, quantity);
    toast.success(
      `${product.name} (Tam. ${selectedSize}) adicionado ao carrinho!`,
      {
        duration: 3000,
        icon: "🛒",
        style: {
          background: "#0a0a0a",
          border: "1px solid #c9a961",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
        },
      },
    );
    setIsModalOpen(false);
    setSelectedSize(null);
    setQuantity(1);
  };

  const getButtonStyle = () => {
    const baseStyle: React.CSSProperties = {
      background: "#c9a961",
      border: "none",
      color: "#0a0a0a",
      fontFamily: "Georgia, serif",
      letterSpacing: "2px",
      cursor: "pointer",
      fontWeight: 600,
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    };

    switch (variant) {
      case "large":
        return {
          ...baseStyle,
          padding: "18px 48px",
          fontSize: "0.85rem",
        };
      case "minimal":
        return {
          ...baseStyle,
          padding: "10px 20px",
          fontSize: "0.7rem",
        };
      default:
        return {
          ...baseStyle,
          padding: "14px 36px",
          fontSize: "0.75rem",
        };
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        style={getButtonStyle()}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ffffff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#c9a961";
        }}
      >
        <span>{selectedSize ? "ADICIONAR" : "SELECIONAR TAMANHO"}</span>
        {isInCart(product.id, selectedSize || 0) && (
          <span
            style={{
              background: "rgba(0,0,0,0.2)",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
            }}
          >
            {getItemQuantity(product.id, selectedSize || 0)}
          </span>
        )}
      </button>

      {/* Size Selector Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                zIndex: 2000,
                backdropFilter: "blur(8px)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(201, 169, 97, 0.3)",
                borderRadius: "8px",
                padding: "32px",
                zIndex: 2001,
                maxWidth: "500px",
                width: "90%",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "8px",
                }}
              >
                ×
              </button>

              {/* Product Info */}
              <div style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "1.3rem",
                    color: "#ffffff",
                    margin: "0 0 8px 0",
                  }}
                >
                  {product.name}
                </h2>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    margin: 0,
                  }}
                >
                  {product.designer} • {product.priceFormatted}
                </p>
              </div>

              {/* Size Grid */}
              <div style={{ marginBottom: "24px" }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.75rem",
                    color: "#c9a961",
                    letterSpacing: "2px",
                    marginBottom: "12px",
                  }}
                >
                  SELECIONE O TAMANHO (BR)
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  {product.sizes.map((size) => {
                    const stock = product.stock[size] || 0;
                    const isSelected = selectedSize === size;
                    const isOutOfStock = stock === 0;

                    return (
                      <button
                        type="button"
                        key={size}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: "12px",
                          background: isSelected
                            ? "#c9a961"
                            : isOutOfStock
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(255, 255, 255, 0.1)",
                          border: `1px solid ${
                            isSelected
                              ? "#c9a961"
                              : isOutOfStock
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(255, 255, 255, 0.2)"
                          }`,
                          borderRadius: "4px",
                          color: isSelected
                            ? "#0a0a0a"
                            : isOutOfStock
                              ? "rgba(255, 255, 255, 0.3)"
                              : "#ffffff",
                          fontFamily: "system-ui, sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: isSelected ? 600 : 400,
                          cursor: isOutOfStock ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          position: "relative",
                        }}
                      >
                        {size}
                        {isOutOfStock && (
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "100%",
                              height: "1px",
                              background: "rgba(255, 255, 255, 0.3)",
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Size Conversion */}
                {selectedSize && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      background: "rgba(201, 169, 97, 0.1)",
                      borderRadius: "4px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "0.75rem",
                        color: "#c9a961",
                        margin: 0,
                      }}
                    >
                      Tamanho {selectedSize} BR = US{" "}
                      {SIZE_CONVERSION[selectedSize]?.us} / UK{" "}
                      {SIZE_CONVERSION[selectedSize]?.uk} /{" "}
                      {SIZE_CONVERSION[selectedSize]?.cm}cm
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Quantity Selector */}
              <div style={{ marginBottom: "24px" }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.75rem",
                    color: "#c9a961",
                    letterSpacing: "2px",
                    marginBottom: "12px",
                  }}
                >
                  QUANTIDADE
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "4px",
                      color: "#ffffff",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "1.1rem",
                      color: "#ffffff",
                      minWidth: "40px",
                      textAlign: "center",
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const maxStock = selectedSize
                        ? product.stock[selectedSize] || 0
                        : 0;
                      setQuantity(Math.min(maxStock, quantity + 1));
                    }}
                    disabled={
                      !selectedSize ||
                      quantity >= (product.stock[selectedSize] || 0)
                    }
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "4px",
                      color: "#ffffff",
                      fontSize: "1.2rem",
                      cursor:
                        !selectedSize ||
                        quantity >= (product.stock[selectedSize] || 0)
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        !selectedSize ||
                        quantity >= (product.stock[selectedSize] || 0)
                          ? 0.5
                          : 1,
                    }}
                  >
                    +
                  </button>
                </div>
                {selectedSize && (
                  <p
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "0.7rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      margin: "8px 0 0 0",
                    }}
                  >
                    {product.stock[selectedSize] || 0} unidades disponíveis
                  </p>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => {
                  if (selectedSize) {
                    addItem(product, selectedSize, quantity);
                    toast.success(
                      `${product.name} (Tam. ${selectedSize}) adicionado!`,
                      {
                        duration: 3000,
                        icon: "✓",
                        style: {
                          background: "#0a0a0a",
                          border: "1px solid #c9a961",
                          color: "#ffffff",
                          fontFamily: "Georgia, serif",
                        },
                      },
                    );
                    setIsModalOpen(false);
                    setSelectedSize(null);
                    setQuantity(1);
                  }
                }}
                disabled={!selectedSize}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: selectedSize
                    ? "#c9a961"
                    : "rgba(201, 169, 97, 0.3)",
                  border: "none",
                  borderRadius: "4px",
                  color: selectedSize ? "#0a0a0a" : "rgba(255, 255, 255, 0.5)",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.85rem",
                  letterSpacing: "2px",
                  fontWeight: 600,
                  cursor: selectedSize ? "pointer" : "not-allowed",
                  transition: "all 0.3s",
                }}
              >
                ADICIONAR AO CARRINHO • R${" "}
                {selectedSize
                  ? (product.price * quantity).toLocaleString("pt-BR")
                  : "--"}
              </button>

              {/* Size Guide Link */}
              <button
                type="button"
                style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "12px",
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Guia de Tamanhos
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
