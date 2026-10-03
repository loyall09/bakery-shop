"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { Minus, Plus } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/product-card";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/site";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = useQuery(api.products.get, { id });
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (product === undefined) {
    return <div className="mx-auto max-w-5xl px-4 py-16"><div className="h-80 animate-pulse rounded-xl bg-muted" /></div>;
  }
  if (product === null) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button asChild className="mt-4"><Link href="/menu">Back to menu</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
      <ProductImage product={product} className="h-80 w-full rounded-xl md:h-96" />
      <div>
        <Badge variant="secondary">{product.category}</Badge>
        <h1 className="mt-3 font-serif text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-2xl font-bold text-primary">{formatINR(product.price)}</p>
        <p className="mt-4 text-muted-foreground">{product.description}</p>

        {product.inStock ? (
          <>
            <div className="mt-6 flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <Button variant="outline" size="icon" onClick={() => setQty(Math.min(20, qty + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                size="lg"
                onClick={() => {
                  add(
                    { productId: product._id, name: product.name, price: product.price, image: product.image },
                    qty
                  );
                  setAdded(true);
                }}
              >
                Add to cart
              </Button>
              {added && (
                <Button asChild size="lg" variant="outline"><Link href="/cart">Go to cart</Link></Button>
              )}
            </div>
          </>
        ) : (
          <Badge variant="outline" className="mt-6">Currently sold out</Badge>
        )}
      </div>
    </div>
  );
}