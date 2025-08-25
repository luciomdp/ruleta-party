'use client';

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { useGameStore } from "@/store/useGameStore";

export default function ClientGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const alive = useGameStore(s => s.alive);

  useEffect(() => {
    if (pathname !== "/" && alive.length === 0) router.replace("/");
  }, [alive.length, pathname, router]);

  return (
    <>
      {children}
      <Toaster
        position="top-center"
        containerClassName="!top-4"
        toastOptions={{
          duration: 2000,
          icon: null,
          style: {
            background: "rgba(244,63,94,0.90)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.20)",
            boxShadow: "0 12px 30px rgba(20, 10, 25, 0.35)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            padding: "12px 16px",
            borderRadius: "12px",
          },
          className: "rounded-xl px-4 py-3",
          success: { style: { background: "rgba(16,185,129,0.90)", border: "1px solid rgba(255,255,255,0.20)" } },
          error: { style: { background: "rgba(244,63,94,0.90)", border: "1px solid rgba(255,255,255,0.20)" } },
        }}
      />
    </>
  );
}
