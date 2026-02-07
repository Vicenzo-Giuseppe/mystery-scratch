"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const chars = textRef.current.querySelectorAll(".char");
      gsap.fromTo(
        chars,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: "power3.out",
          delay: 0.5,
        },
      );
    }
  }, []);

  const title = "TÊNIS DE LUXO";
  const subtitle = "EXPERIÊNCIA 3D";

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 40px 80px",
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(201, 169, 97, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(201, 169, 97, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(201, 169, 97, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      {/* Floating Particles Effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: 0.3,
        }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: "#c9a961",
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "1200px",
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-block",
            padding: "8px 20px",
            background: "rgba(201, 169, 97, 0.1)",
            border: "1px solid rgba(201, 169, 97, 0.3)",
            borderRadius: "50px",
            marginBottom: "30px",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.7rem",
              color: "#c9a961",
              letterSpacing: "3px",
            }}
          >
            COLEÇÃO TRENDING 2024-2025
          </span>
        </motion.div>

        {/* Main Title with Character Animation */}
        <h1
          ref={textRef}
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: "8px",
            marginBottom: "20px",
            lineHeight: 1.1,
          }}
        >
          {title.split("").map((char, i) => (
            <span key={i} className="char" style={{ display: "inline-block" }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 300,
            color: "#c9a961",
            letterSpacing: "12px",
            marginBottom: "40px",
          }}
        >
          {subtitle}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "600px",
            margin: "0 auto 50px",
            lineHeight: 1.8,
          }}
        >
          Descubra os sneakers mais exclusivos do mundo em uma experiência
          imersiva em 3D. Do clássico Air Force 1 ao raro Off-White Jordan.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#products"
            style={{
              padding: "16px 40px",
              background: "#c9a961",
              color: "#0a0a0a",
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              letterSpacing: "2px",
              textDecoration: "none",
              fontWeight: 600,
              borderRadius: "4px",
              transition: "all 0.3s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#c9a961";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            VER COLEÇÃO
          </a>

          <a
            href="#viewer"
            style={{
              padding: "16px 40px",
              background: "transparent",
              color: "#c9a961",
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              letterSpacing: "2px",
              textDecoration: "none",
              fontWeight: 600,
              borderRadius: "4px",
              border: "1px solid #c9a961",
              transition: "all 0.3s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201, 169, 97, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            EXPERIÊNCIA 3D ↓
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "2px",
            }}
          >
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, #c9a961, transparent)",
            }}
          />
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: "absolute",
          left: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "Georgia, serif",
          fontSize: "15rem",
          color: "#c9a961",
          fontWeight: 700,
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      >
        DRK
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: "absolute",
          right: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "Georgia, serif",
          fontSize: "15rem",
          color: "#c9a961",
          fontWeight: 700,
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          opacity: 0.05,
          pointerEvents: "none",
          rotate: "180deg",
        }}
      >
        STUDIO
      </motion.div>
    </section>
  );
}
