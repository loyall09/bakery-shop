"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categories, formatINR } from "@/lib/site";

const STATUSES = ["pending", "paid", "preparing", "delivered", "cancelled"] as const;
const statusStyle: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  preparing: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [input, setInput] = useState("");
  const [tried, setTried] = useState(false);

  useEffect(() => {
    try {
      const k = sessionStorage.getItem("admin-key");
      if (k) setKey(k);
    } catch {}
  }, []);

  const ok = useQuery(api.orders.checkAdmin, key ? { adminKey: key } : "skip");

  useEffect(() => {
    if (ok === true) {
      try { sessionStorage.setItem("admin-key", key); } catch {}
    }
  }, [ok, key]);

  function logout() {
    try { sessionStorage.removeItem("admin-key"); } catch {}
    setKey(""); setInput(""); setTried(false);
  }

  if (ok === true) return <Dashboard adminKey={key} onLogout={logout} />;

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-serif text-3xl font-bold">Admin login</h1>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => { e.preventDefault(); setKey(input); setTried(true); }}
      >
        <Input type="password" placeholder="Admin key" value={input} onChange={(e) => setInput(e.target.value)} />
        <Button type="submit" className="w-full">Login</Button>
        {tried && ok === false && <p className="text-sm text-red-500">Wrong key.</p>}
      </form>
    </div>
  );
}

function Dashboard({ adminKey, onLogout }: { adminKey: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"orders" | "products">("orders");
  const orders = useQuery(api.orders.listAll, { adminKey });
  const products = useQuery(api.products.list, {});

  const revenue =
    orders
      ?.filter((o) => ["paid", "preparing", "delivered"].includes(o.status))
      .reduce((s, o) => s + o.total, 0) ?? 0;
  const pending = orders?.filter((o) => o.status === "pending").length ?? 0;

  const stats = [
    { l: "Total orders", v: orders?.length ?? "-" },
    { l: "Revenue (paid)", v: formatINR(revenue) },
    { l: "Pending", v: pending },
    { l: "Products", v: products?.length ?? "-" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.l}</p>
            <p className="mt-1 text-xl font-bold">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-2 border-b">
        {(["orders", "products"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium capitalize ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" ? (
        <OrdersTab adminKey={adminKey} orders={orders} />
      ) : (
        <ProductsTab adminKey={adminKey} products={products} />
      )}
    </div>
  );
}

function OrdersTab({ adminKey, orders }: { adminKey: string; orders: Doc<"orders">[] | undefined }) {
  const updateStatus = useMutation(api.orders.updateStatus);

  if (orders === undefined) return <p className="py-10 text-muted-foreground">Loading...</p>;
  if (orders.length === 0) return <p className="py-10 text-muted-foreground">No orders yet. Place a test order from the menu.</p>;

  return (
    <div className="mt-6 space-y-4">
      {orders.map((o) => (
        <div key={o._id} className="rounded-xl border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{o.customerName} <span className="font-normal text-muted-foreground">· {o.phone}</span></p>
              <p className="mt-1 text-sm text-muted-foreground">{o.address}</p>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(o._creationTime).toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{formatINR(o.total)}</p>
              <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle[o.status]}`}>
                {o.status}
              </span>
            </div>
          </div>
          <ul className="mt-3 text-sm text-muted-foreground">
            {o.items.map((i, idx) => (
              <li key={idx}>{i.name} × {i.qty}</li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Update status</label>
            <select
              value={o.status}
              onChange={(e) =>
                updateStatus({ adminKey, orderId: o._id, status: e.target.value as (typeof STATUSES)[number] })
              }
              className="rounded-md border bg-background px-2 py-1 text-sm capitalize"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsTab({ adminKey, products }: { adminKey: string; products: Doc<"products">[] | undefined }) {
  const create = useMutation(api.products.create);
  const setStock = useMutation(api.products.setStock);
  const remove = useMutation(api.products.remove);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await create({
      adminKey,
      name,
      description,
      price: Number(price),
      category,
      image: image || undefined,
      featured,
    });
    setName(""); setDescription(""); setPrice(""); setImage(""); setFeatured(false);
  }

  return (
    <div className="mt-6 grid gap-8 md:grid-cols-5">
      <div className="space-y-3 md:col-span-3">
        {products === undefined ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.category} · {formatINR(p.price)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant={p.inStock ? "outline" : "default"}
                  onClick={() => setStock({ adminKey, id: p._id, inStock: !p.inStock })}
                >
                  {p.inStock ? "Mark sold out" : "Back in stock"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => confirm(`Delete ${p.name}?`) && remove({ adminKey, id: p._id })}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={add} className="h-fit space-y-3 rounded-xl border bg-card p-5 md:col-span-2">
        <p className="font-semibold">Add product</p>
        <Input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea required placeholder="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input required type="number" min={1} placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <Input placeholder="Image path (optional) e.g. /products/cake.jpg" value={image} onChange={(e) => setImage(e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Show on home page
        </label>
        <Button type="submit" className="w-full">Add product</Button>
      </form>
    </div>
  );
}