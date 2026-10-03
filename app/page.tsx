"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Cake, Clock, Truck } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Testimonials } from "@/components/testimonials";
import { categories, categoryEmoji, site } from "@/lib/site";

export default function HomePage() {
  const featured = useQuery(api.products.featured);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-background to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {site.city}
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight md:text-6xl">
            Fresh cakes & sweets, baked every morning
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{site.tagline}. Order online and pay securely.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg"><Link href="/menu">Order now</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/contact">Contact us</Link></Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center font-serif text-3xl font-bold">Shop by category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/menu?cat=${encodeURIComponent(c)}`}
              className="rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-lg"
            >
              <div className="text-4xl">{categoryEmoji[c]}</div>
              <p className="mt-3 font-semibold">{c}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-center font-serif text-3xl font-bold">Our favourites</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured === undefined
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
              ))
            : featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3">
          {[
            { icon: Cake, title: "Baked fresh daily", text: "No stock sitting around. Everything is made the same day." },
            { icon: Truck, title: "Local delivery", text: "Delivered across Haldwani, or pick up from the shop." },
            { icon: Clock, title: "Order in minutes", text: "Pick, pay online and we start baking." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <Icon className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />
    </>
  );
}