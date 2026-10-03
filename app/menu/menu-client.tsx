"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { categories } from "@/lib/site";

export default function MenuClient() {
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("cat") ?? "");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const products = useQuery(api.products.list, {
    category: category || undefined,
    search: debounced || undefined,
  });

  const pills = ["", ...categories];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-4xl font-bold">Our Menu</h1>

      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cakes, sweets..."
          className="pl-9"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {pills.map((c) => (
          <button
            key={c || "all"}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {c || "All"}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products === undefined ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
          ))
        ) : products.length === 0 ? (
          <p className="col-span-full py-16 text-center text-muted-foreground">
            Nothing found. Try a different search.
          </p>
        ) : (
          products.map((p) => <ProductCard key={p._id} product={p} />)
        )}
      </div>
    </div>
  );
}