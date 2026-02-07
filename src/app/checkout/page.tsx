"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { SIZE_CONVERSION, PaymentMethod } from "@/types/ecommerce";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const steps = [
  { id: 1, name: "Carrinho", icon: "🛒" },
  { id: 2, name: "Entrega", icon: "📦" },
  { id: 3, name: "Pagamento", icon: "💳" },
  { id: 4, name: "Confirmação", icon: "✓" },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [installments, setInstallments] = useState(1);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const { items, getTotalPrice, clearCart } = useCartStore();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1500 ? 0 : 25;
  const discount = discountApplied;
  const total = subtotal + shipping - discount;

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "DRK10") {
      setDiscountApplied(subtotal * 0.1);
    }
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderNum = `DRK${Date.now().toString().slice(-8)}`;
      setOrderNumber(orderNum);
      setOrderComplete(true);
      setIsProcessing(false);
      clearCart();
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            maxWidth: "600px",
            width: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(201, 169, 97, 0.3)",
            borderRadius: "8px",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "24px" }}>🎉</div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "2rem",
              color: "#ffffff",
              marginBottom: "16px",
            }}
          >
            Pedido Confirmado!
          </h1>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "1rem",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "24px",
            }}
          >
            Seu pedido #{orderNumber} foi recebido com sucesso.
          </p>
          <div
            style={{
              background: "rgba(201, 169, 97, 0.1)",
              border: "1px solid rgba(201, 169, 97, 0.3)",
              borderRadius: "4px",
              padding: "20px",
              marginBottom: "32px",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.9rem",
                color: "#c9a961",
                margin: 0,
              }}
            >
              Você receberá um e-mail de confirmação em breve.
            </p>
          </div>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              background: "#c9a961",
              color: "#0a0a0a",
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              letterSpacing: "2px",
              textDecoration: "none",
              fontWeight: 600,
              borderRadius: "4px",
            }}
          >
            VOLTAR À LOJA
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%)",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "48px",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.5rem",
              color: "#c9a961",
              textDecoration: "none",
              letterSpacing: "4px",
            }}
          >
            DRK STUDIO
          </Link>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.5)",
              letterSpacing: "2px",
            }}
          >
            CHECKOUT SEGURO
          </div>
        </div>

        {/* Progress Steps */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background:
                      currentStep >= step.id
                        ? "#c9a961"
                        : "rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  {step.icon}
                </div>
                <span
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.7rem",
                    color:
                      currentStep >= step.id
                        ? "#c9a961"
                        : "rgba(255, 255, 255, 0.5)",
                    letterSpacing: "1px",
                  }}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  style={{
                    width: "60px",
                    height: "2px",
                    background:
                      currentStep > step.id
                        ? "#c9a961"
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "48px",
          }}
        >
          {/* Main Content */}
          <div>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <Step1Cart
                  key="step1"
                  items={items}
                  discountCode={discountCode}
                  setDiscountCode={setDiscountCode}
                  onApplyDiscount={handleApplyDiscount}
                  discountApplied={discountApplied}
                />
              )}
              {currentStep === 2 && <Step2Shipping key="step2" />}
              {currentStep === 3 && (
                <Step3Payment
                  key="step3"
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  installments={installments}
                  setInstallments={setInstallments}
                  total={total}
                />
              )}
              {currentStep === 4 && (
                <Step4Confirmation
                  key="step4"
                  items={items}
                  total={total}
                  shipping={shipping}
                  discount={discount}
                  paymentMethod={paymentMethod}
                  installments={installments}
                />
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "32px",
              }}
            >
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  style={{
                    padding: "14px 28px",
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "2px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  VOLTAR
                </button>
              ) : (
                <Link
                  href="/"
                  style={{
                    padding: "14px 28px",
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "2px",
                    textDecoration: "none",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  CONTINUAR COMPRANDO
                </Link>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  style={{
                    padding: "14px 28px",
                    background: "#c9a961",
                    border: "none",
                    color: "#0a0a0a",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "2px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontWeight: 600,
                  }}
                >
                  PRÓXIMO
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  style={{
                    padding: "14px 28px",
                    background: "#c9a961",
                    border: "none",
                    color: "#0a0a0a",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "2px",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    borderRadius: "4px",
                    fontWeight: 600,
                    opacity: isProcessing ? 0.7 : 1,
                  }}
                >
                  {isProcessing ? "PROCESSANDO..." : "CONFIRMAR PEDIDO"}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}

// Step Components
function Step1Cart({
  items,
  discountCode,
  setDiscountCode,
  onApplyDiscount,
  discountApplied,
}: {
  items: ReturnType<typeof useCartStore.getState>["items"];
  discountCode: string;
  setDiscountCode: (code: string) => void;
  onApplyDiscount: () => void;
  discountApplied: number;
}) {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1.3rem",
          color: "#ffffff",
          marginBottom: "24px",
        }}
      >
        Revisar Carrinho
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {items.map((item) => (
          <div
            key={`${item.product.id}-${item.size}`}
            style={{
              display: "flex",
              gap: "16px",
              padding: "20px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(201, 169, 97, 0.1)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "2rem" }}>👟</span>
            </div>

            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "1rem",
                  color: "#ffffff",
                  margin: "0 0 4px 0",
                }}
              >
                {item.product.name}
              </h3>
              <p
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  margin: "0 0 8px 0",
                }}
              >
                {item.product.designer} • Tamanho {item.size} (US{" "}
                {SIZE_CONVERSION[item.size]?.us})
              </p>

              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "4px",
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
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>
                  <span
                    style={{
                      width: "32px",
                      textAlign: "center",
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
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.product.id, item.size)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Remover
                </button>
              </div>
            </div>

            <div
              style={{
                textAlign: "right",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "1rem",
                  color: "#c9a961",
                  fontWeight: 600,
                }}
              >
                R${" "}
                {(item.product.price * item.quantity).toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Discount Code */}
      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "4px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
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
          CÓDIGO DE DESCONTO
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Digite o código"
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />
          <button
            type="button"
            onClick={onApplyDiscount}
            style={{
              padding: "12px 24px",
              background: "rgba(201, 169, 97, 0.2)",
              border: "1px solid #c9a961",
              borderRadius: "4px",
              color: "#c9a961",
              fontFamily: "Georgia, serif",
              fontSize: "0.75rem",
              letterSpacing: "2px",
              cursor: "pointer",
            }}
          >
            APLICAR
          </button>
        </div>
        {discountApplied > 0 && (
          <p
            style={{
              marginTop: "8px",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.8rem",
              color: "#4ade80",
            }}
          >
            ✓ Desconto de R$ {discountApplied.toLocaleString("pt-BR")} aplicado!
          </p>
        )}
      </div>
    </motion.div>
  );
}

function Step2Shipping() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1.3rem",
          color: "#ffffff",
          marginBottom: "24px",
        }}
      >
        Endereço de Entrega
      </h2>

      <div style={{ display: "grid", gap: "16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Nome completo"
            style={{
              padding: "14px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />
          <input
            type="tel"
            placeholder="Telefone"
            style={{
              padding: "14px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <input
            type="text"
            placeholder="CEP"
            style={{
              width: "150px",
              padding: "14px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />
          <button
            type="button"
            style={{
              padding: "14px 24px",
              background: "rgba(201, 169, 97, 0.2)",
              border: "1px solid #c9a961",
              borderRadius: "4px",
              color: "#c9a961",
              fontFamily: "Georgia, serif",
              fontSize: "0.75rem",
              letterSpacing: "2px",
              cursor: "pointer",
            }}
          >
            BUSCAR
          </button>
        </div>

        <input
          type="text"
          placeholder="Endereço"
          style={{
            padding: "14px 16px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "4px",
            color: "#ffffff",
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.9rem",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Número"
            style={{
              padding: "14px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />
          <input
            type="text"
            placeholder="Complemento (opcional)"
            style={{
              padding: "14px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <input
          type="text"
          placeholder="Bairro"
          style={{
            padding: "14px 16px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "4px",
            color: "#ffffff",
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.9rem",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Cidade"
            style={{
              padding: "14px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />
          <input
            type="text"
            placeholder="UF"
            style={{
              padding: "14px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />
        </div>
      </div>

      {/* Shipping Options */}
      <div style={{ marginTop: "32px" }}>
        <span
          style={{
            display: "block",
            fontFamily: "Georgia, serif",
            fontSize: "0.75rem",
            color: "#c9a961",
            letterSpacing: "2px",
            marginBottom: "16px",
          }}
        >
          OPÇÕES DE ENTREGA
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              id: "standard",
              name: "Padrão",
              time: "5-7 dias úteis",
              price: 25,
            },
            {
              id: "express",
              name: "Expresso",
              time: "2-3 dias úteis",
              price: 45,
            },
          ].map((option) => (
            <label
              key={option.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <input type="radio" name="shipping" value={option.id} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.9rem",
                    color: "#ffffff",
                  }}
                >
                  {option.name}
                </div>
                <div
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {option.time}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "1rem",
                  color: "#c9a961",
                  fontWeight: 600,
                }}
              >
                R$ {option.price.toLocaleString("pt-BR")}
              </div>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Step3Payment({
  paymentMethod,
  setPaymentMethod,
  installments,
  setInstallments,
  total,
}: {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  installments: number;
  setInstallments: (n: number) => void;
  total: number;
}) {
  const [pixCode] = useState(
    `00020126580014BR.GOV.BCB.PIX0136drkstudio@email.com520400005303986540${total.toFixed(2).replace(".", "")}5802BR5925DRK STUDIO6009SAO PAULO62070503***6304`,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1.3rem",
          color: "#ffffff",
          marginBottom: "24px",
        }}
      >
        Forma de Pagamento
      </h2>

      {/* Payment Method Selection */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {[
          { id: "credit_card", name: "Cartão de Crédito", icon: "💳" },
          { id: "pix", name: "PIX", icon: "⚡" },
          { id: "boleto", name: "Boleto Bancário", icon: "📄" },
        ].map((method) => (
          <button
            type="button"
            key={method.id}
            onClick={() => setPaymentMethod(method.id as PaymentMethod)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "20px",
              background:
                paymentMethod === method.id
                  ? "rgba(201, 169, 97, 0.1)"
                  : "rgba(255, 255, 255, 0.03)",
              border:
                paymentMethod === method.id
                  ? "1px solid #c9a961"
                  : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{method.icon}</span>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1rem",
                color: "#ffffff",
                flex: 1,
              }}
            >
              {method.name}
            </span>
            {paymentMethod === method.id && (
              <span style={{ color: "#c9a961" }}>✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Credit Card Form */}
      {paymentMethod === "credit_card" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <input
            type="text"
            placeholder="Número do cartão"
            style={{
              padding: "14px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />

          <input
            type="text"
            placeholder="Nome no cartão"
            style={{
              padding: "14px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <input
              type="text"
              placeholder="Validade (MM/AA)"
              style={{
                padding: "14px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "#ffffff",
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.9rem",
              }}
            />
            <input
              type="text"
              placeholder="CVV"
              style={{
                padding: "14px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "#ffffff",
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {/* Installments */}
          <div style={{ marginTop: "16px" }}>
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
              PARCELAMENTO
            </span>
            <select
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "#ffffff",
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.9rem",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                <option key={n} value={n}>
                  {n}x de R$ {(total / n).toFixed(2).replace(".", ",")}
                  {n === 1 ? " (à vista)" : " sem juros"}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {/* PIX */}
      {paymentMethod === "pix" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "32px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <QRCodeSVG value={pixCode} size={200} level="M" />
          </div>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "12px",
            }}
          >
            Escaneie o QR Code com seu app bancário
          </p>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            O código expira em 30 minutos
          </p>
        </motion.div>
      )}

      {/* Boleto */}
      {paymentMethod === "boleto" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "24px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
          }}
        >
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "12px",
            }}
          >
            O boleto será gerado após a confirmação do pedido.
          </p>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            Vencimento em 3 dias úteis
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function Step4Confirmation({
  items,
  total,
  shipping,
  discount,
  paymentMethod,
  installments,
}: {
  items: ReturnType<typeof useCartStore.getState>["items"];
  total: number;
  shipping: number;
  discount: number;
  paymentMethod: PaymentMethod;
  installments: number;
}) {
  const paymentMethodNames: Record<PaymentMethod, string> = {
    credit_card: "Cartão de Crédito",
    pix: "PIX",
    boleto: "Boleto Bancário",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1.3rem",
          color: "#ffffff",
          marginBottom: "24px",
        }}
      >
        Confirmar Pedido
      </h2>

      <div
        style={{
          padding: "24px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.9rem",
              color: "#c9a961",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            ITENS
          </h3>
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <span
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {item.quantity}x {item.product.name} (Tam. {item.size})
              </span>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.85rem",
                  color: "#ffffff",
                }}
              >
                R${" "}
                {(item.product.price * item.quantity).toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.9rem",
              color: "#c9a961",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            ENTREGA
          </h3>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.7)",
              margin: 0,
            }}
          >
            Rua Example, 123 - São Paulo, SP
          </p>
        </div>

        <div>
          <h3
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.9rem",
              color: "#c9a961",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            PAGAMENTO
          </h3>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.7)",
              margin: 0,
            }}
          >
            {paymentMethodNames[paymentMethod]}
            {paymentMethod === "credit_card" &&
              ` - ${installments}x de R$ ${(total / installments).toFixed(2).replace(".", ",")}`}
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          background: "rgba(201, 169, 97, 0.1)",
          border: "1px solid rgba(201, 169, 97, 0.3)",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Subtotal
          </span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              color: "#ffffff",
            }}
          >
            R$ {total.toLocaleString("pt-BR")}
          </span>
        </div>
        {discount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.85rem",
                color: "#4ade80",
              }}
            >
              Desconto
            </span>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.85rem",
                color: "#4ade80",
              }}
            >
              -R$ {discount.toLocaleString("pt-BR")}
            </span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid rgba(201, 169, 97, 0.3)",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.1rem",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.3rem",
              color: "#c9a961",
              fontWeight: 600,
            }}
          >
            R$ {total.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function OrderSummary({
  items,
  subtotal,
  shipping,
  discount,
  total,
}: {
  items: ReturnType<typeof useCartStore.getState>["items"];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        padding: "24px",
        height: "fit-content",
      }}
    >
      <h3
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1rem",
          color: "#ffffff",
          letterSpacing: "2px",
          marginBottom: "20px",
        }}
      >
        RESUMO DO PEDIDO
      </h3>

      <div style={{ marginBottom: "20px" }}>
        {items.slice(0, 3).map((item) => (
          <div
            key={`${item.product.id}-${item.size}`}
            style={{
              display: "flex",
              gap: "12px",
              padding: "12px 0",
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                background: "rgba(201, 169, 97, 0.1)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>👟</span>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.8rem",
                  color: "#ffffff",
                }}
              >
                {item.product.name}
              </div>
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.7rem",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                Tam. {item.size} • Qtd: {item.quantity}
              </div>
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.85rem",
                color: "#c9a961",
              }}
            >
              R$ {(item.product.price * item.quantity).toLocaleString("pt-BR")}
            </div>
          </div>
        ))}
        {items.length > 3 && (
          <div
            style={{
              textAlign: "center",
              padding: "12px",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            +{items.length - 3} itens
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
          <span>R$ {subtotal.toLocaleString("pt-BR")}</span>
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
        {discount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.85rem",
              color: "#4ade80",
            }}
          >
            <span>Desconto</span>
            <span>-R$ {discount.toLocaleString("pt-BR")}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            marginTop: "4px",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.2rem",
              color: "#c9a961",
              fontWeight: 600,
            }}
          >
            R$ {total.toLocaleString("pt-BR")}
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
          ou em até 12x de R$ {(total / 12).toFixed(2).replace(".", ",")}
        </p>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          background: "rgba(201, 169, 97, 0.1)",
          borderRadius: "4px",
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
          🔒 Checkout 100% seguro
        </span>
      </div>
    </div>
  );
}
