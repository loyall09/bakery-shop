"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type CartContextType = {
  items: CartItem[];
  ready: boolean;
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const KEY = "bakery-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // load once on the client
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  // save on every change (after the first load)
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add: CartContextType["add"] = (item, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.productId === item.productId);
      if (found) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, qty: Math.min(20, i.qty + qty) } : i
        );
      }
      return [...prev, { ...item, qty }];
    });

  const setQty = (productId: string, qty: number) =>
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: Math.min(20, qty) } : i))
        .filter((i) => i.qty > 0)
    );

  const remove = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, ready, count, total, add, setQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}