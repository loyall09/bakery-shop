"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </ConvexProvider>
  );
}