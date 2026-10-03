"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { CheckCircle2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/site";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const order = useQuery(api.orders.get, { id });

  if (order === undefined) return <div className="py-24" />;
  if (order === null) return <p className="py-24 text-center text-muted-foreground">Order not found.</p>;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
      <h1 className="mt-4 font-serif text-3xl font-bold">
        {order.status === "pending" ? "Order received" : "Thank you!"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Hi {order.customerName}, your order is <span className="font-semibold capitalize text-foreground">{order.status}</span>.
      </p>
      <div className="mt-6 rounded-xl border bg-card p-5 text-left text-sm">
        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between py-1">
            <span>{i.name} × {i.qty}</span><span>{formatINR(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t pt-2 font-bold">
          <span>Total</span><span>{formatINR(order.total)}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Order ID: {order._id}</p>
      </div>
      <Button asChild className="mt-6"><Link href="/menu">Order more</Link></Button>
    </div>
  );
}