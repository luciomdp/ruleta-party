// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ruleta Party",
  description: "Juego de ruleta para fiestas",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          containerClassName="!top-4"
          toastOptions={{
            duration: 2000,
            icon: null,
            // estilos base (pisan los inline por defecto)
            style: {
              background: "rgba(244,63,94,0.90)",      // rose-600/90
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.20)",
              boxShadow: "0 12px 30px rgba(20, 10, 25, 0.35)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              padding: "12px 16px",
              borderRadius: "12px",
            },
            className: "rounded-xl px-4 py-3",          // utilidades extra
            success: {
              style: {
                background: "rgba(16,185,129,0.90)",   // emerald-500/90
                border: "1px solid rgba(255,255,255,0.20)",
              },
            },
            error: {
              style: {
                background: "rgba(244,63,94,0.90)",    // rose-600/90
                border: "1px solid rgba(255,255,255,0.20)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
