"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/site";

export default function CartPage() {
  const { items, ready, total, setQty, remove } = useCart();

  if (!ready) return <div className="py-24" />;

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-4"><Link href="/menu">Browse menu</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold">Your cart</h1>
      <div className="mt-6 divide-y rounded-xl border bg-card">
        {items.map((i) => (
          <div key={i.productId} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{i.name}</p>
              <p className="text-sm text-muted-foreground">{formatINR(i.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(i.productId, i.qty - 1)}>
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(i.productId, i.qty + 1)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <p className="w-20 text-right font-semibold">{formatINR(i.price * i.qty)}</p>
            <Button variant="ghost" size="icon" onClick={() => remove(i.productId)} aria-label="Remove">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg">Total: <span className="font-bold text-primary">{formatINR(total)}</span></p>
        <Button asChild size="lg"><Link href="/checkout">Checkout</Link></Button>
      </div>
    </div>
  );
}