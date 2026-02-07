import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "DRK STUDIO - Luxury Sneakers 3D",
  description:
    "Experience luxury sneakers in immersive 3D. Shop the latest collections from Nike, Balenciaga, Off-White, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0a0a0a",
              border: "1px solid #c9a961",
              color: "#ffffff",
              fontFamily: "Georgia, serif",
            },
          }}
        />
      </body>
    </html>
  );
}
