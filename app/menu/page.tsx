import { Suspense } from "react";
import type { Metadata } from "next";
import MenuClient from "./menu-client";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse cakes, pastries, sweets and cookies. Order online.",
};

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuClient />
    </Suspense>
  );
}