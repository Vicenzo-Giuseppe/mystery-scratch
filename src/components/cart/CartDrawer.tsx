"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { SIZE_CONVERSION } from "@/types/ecommerce";
import { useState } from "react";
import Link from "next/link";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCartStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shipping = totalPrice > 1500 ? 0 : 25;
  const finalTotal = totalPrice + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              zIndex: 1000,
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "100%",
              maxWidth: "480px",
              height: "100vh",
              backgroundColor: "#0a0a0a",
              borderLeft: "1px solid rgba(201, 169, 97, 0.3)",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "24px 28px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "1.3rem",
                    color: "#ffffff",
                    margin: 0,
                    letterSpacing: "2px",
                  }}
                >
                  SEU CARRINHO
                </h2>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.5)",
                    margin: "4px 0 0 0",
                  }}
                >
                  {totalItems} {totalItems === 1 ? "item" : "itens"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "8px",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#c9a961";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                }}
              >
                ×
              </button>
            </div>

            {/* Cart Items */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px 28px",
              }}
            >
              {items.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "3rem",
                      marginBottom: "20px",
                      opacity: 0.3,
                    }}
                  >
                    🛒
                  </div>
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "1rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      margin: 0,
                    }}
                  >
                    Seu carrinho está vazio
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    style={{
                      marginTop: "20px",
                      padding: "12px 24px",
                      background: "transparent",
                      border: "1px solid #c9a961",
                      color: "#c9a961",
                      fontFamily: "Georgia, serif",
                      fontSize: "0.75rem",
                      letterSpacing: "2px",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#c9a961";
                      e.currentTarget.style.color = "#0a0a0a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#c9a961";
                    }}
                  >
                    CONTINUAR COMPRANDO
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "4px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {/* Product Image Placeholder */}
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          backgroundColor: "rgba(201, 169, 97, 0.1)",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontSize: "1.5rem" }}>👟</span>
                      </div>

                      {/* Product Info */}
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "0.9rem",
                            color: "#ffffff",
                            margin: "0 0 4px 0",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.product.name}
                        </h3>
                        <p
                          style={{
                            fontFamily: "system-ui, sans-serif",
                            fontSize: "0.7rem",
                            color: "rgba(255, 255, 255, 0.5)",
                            margin: "0 0 8px 0",
                          }}
                        >
                          {item.product.designer} • Tamanho {item.size} (US{" "}
                          {SIZE_CONVERSION[item.size]?.us})
                        </p>

                        {/* Quantity Controls */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.quantity - 1,
                                )
                              }
                              style={{
                                width: "28px",
                                height: "28px",
                                background: "transparent",
                                border: "none",
                                color: "rgba(255, 255, 255, 0.7)",
                                cursor: "pointer",
                                fontSize: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{
                                width: "32px",
                                textAlign: "center",
                                fontFamily: "system-ui, sans-serif",
                                fontSize: "0.8rem",
                                color: "#ffffff",
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.quantity + 1,
                                )
                              }
                              style={{
                                width: "28px",
                                height: "28px",
                                background: "transparent",
                                border: "none",
                                color: "rgba(255, 255, 255, 0.7)",
                                cursor: "pointer",
                                fontSize: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.product.id, item.size)
                            }
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "rgba(255, 255, 255, 0.4)",
                              fontSize: "0.7rem",
                              cursor: "pointer",
                              textDecoration: "underline",
                              padding: 0,
                            }}
                          >
                            Remover
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "0.95rem",
                            color: "#c9a961",
                            fontWeight: 600,
                          }}
                        >
                          R${" "}
                          {(item.product.price * item.quantity).toLocaleString(
                            "pt-BR",
                          )}
                        </span>
                        {item.quantity > 1 && (
                          <span
                            style={{
                              fontFamily: "system-ui, sans-serif",
                              fontSize: "0.65rem",
                              color: "rgba(255, 255, 255, 0.4)",
                            }}
                          >
                            R$ {item.product.price.toLocaleString("pt-BR")} cada
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                style={{
                  padding: "24px 28px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Free shipping banner */}
                {totalPrice < 1500 && (
                  <div
                    style={{
                      backgroundColor: "rgba(201, 169, 97, 0.1)",
                      border: "1px solid rgba(201, 169, 97, 0.3)",
                      padding: "12px 16px",
                      borderRadius: "4px",
                      marginBottom: "20px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "0.75rem",
                        color: "#c9a961",
                      }}
                    >
                      🚚 Faltam R$ {(1500 - totalPrice).toLocaleString("pt-BR")}{" "}
                      para frete grátis!
                    </span>
                  </div>
                )}

                {/* Price Breakdown */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <span>Subtotal</span>
                    <span>R$ {totalPrice.toLocaleString("pt-BR")}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <span>Frete</span>
                    <span>
                      {shipping === 0
                        ? "GRÁTIS"
                        : `R$ ${shipping.toLocaleString("pt-BR")}`}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "Georgia, serif",
                      fontSize: "1.1rem",
                      color: "#ffffff",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      marginTop: "4px",
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: "#c9a961", fontWeight: 600 }}>
                      R$ {finalTotal.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "0.7rem",
                      color: "rgba(255, 255, 255, 0.4)",
                      margin: "4px 0 0 0",
                      textAlign: "right",
                    }}
                  >
                    ou em até 12x de R${" "}
                    {(finalTotal / 12).toFixed(2).replace(".", ",")}
                  </p>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "#c9a961",
                      border: "none",
                      color: "#0a0a0a",
                      fontFamily: "Georgia, serif",
                      fontSize: "0.8rem",
                      letterSpacing: "2px",
                      cursor: "pointer",
                      textAlign: "center",
                      textDecoration: "none",
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
                    FINALIZAR COMPRA
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontFamily: "Georgia, serif",
                      fontSize: "0.75rem",
                      letterSpacing: "2px",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#c9a961";
                      e.currentTarget.style.color = "#c9a961";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.3)";
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    CONTINUAR COMPRANDO
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
