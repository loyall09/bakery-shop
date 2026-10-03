"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { categoryEmoji, formatINR } from "@/lib/site";

export function ProductImage({
  product,
  className = "",
}: {
  product: Doc<"products">;
  className?: string;
}) {
  if (product.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.image} alt={product.name} className={`object-cover ${className}`} />;
  }
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-amber-100 to-rose-100 text-6xl dark:from-amber-950 dark:to-rose-950 ${className}`}
    >
      {categoryEmoji[product.category] ?? "🍰"}
    </div>
  );
}

export function ProductCard({ product }: { product: Doc<"products"> }) {
  const { add } = useCart();
  return (
    <div className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
      <Link href={`/product/${product._id}`}>
        <ProductImage product={product} className="h-44 w-full" />
      </Link>
      <div className="space-y-2 p-4">
        <Badge variant="secondary">{product.category}</Badge>
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold leading-snug hover:text-primary">{product.name}</h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-primary">{formatINR(product.price)}</span>
          {product.inStock ? (
            <Button
              size="sm"
              onClick={() =>
                add({
                  productId: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          ) : (
            <Badge variant="outline">Sold out</Badge>
          )}
        </div>
      </div>
    </div>
  );
}