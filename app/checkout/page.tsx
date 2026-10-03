"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { formatINR, site } from "@/lib/site";

type RzpSuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};
type RzpCtor = new (options: Record<string, unknown>) => { open(): void };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, ready, total, clear } = useCart();
  const createOrder = useMutation(api.orders.create);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!ready) return <div className="py-24" />;
  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-4"><Link href="/menu">Browse menu</Link></Button>
      </div>
    );
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    const Razorpay = (window as unknown as { Razorpay?: RzpCtor }).Razorpay;
    if (!Razorpay) {
      setError("Payment is still loading. Try again in a moment.");
      return;
    }

    setLoading(true);
    try {
      // 1. save the order (total is calculated on the server)
      const orderId = await createOrder({
        customerName: name,
        phone,
        address,
        items: items.map((i) => ({ productId: i.productId as Id<"products">, qty: i.qty })),
      });

      // 2. create the Razorpay order
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");

      // 3. open the payment popup
      const rzp = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: site.name,
        description: "Online order",
        order_id: data.razorpayOrderId,
        prefill: { name, contact: phone },
        theme: { color: "#c2570c" },
        handler: async (response: RzpSuccess) => {
          const v = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, ...response }),
          });
          if (v.ok) {
            clear();
            router.push(`/order/${orderId}`);
          } else {
            setError("Payment could not be verified. Please contact us on WhatsApp.");
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-5">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <form onSubmit={pay} className="space-y-4 md:col-span-3">
        <h1 className="font-serif text-3xl font-bold">Checkout</h1>
        <Input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input required placeholder="Mobile number" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
        <Textarea required placeholder="Delivery address (house no., area, landmark)" rows={4} value={address} onChange={(e) => setAddress(e.target.value)} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Please wait..." : `Pay ${formatINR(total)}`}
        </Button>
        <p className="text-center text-xs text-muted-foreground">Secure payment by Razorpay (UPI, cards, netbanking)</p>
      </form>

      <aside className="h-fit rounded-xl border bg-card p-5 md:col-span-2">
        <p className="font-semibold">Order summary</p>
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-2">
              <span className="text-muted-foreground">{i.name} × {i.qty}</span>
              <span>{formatINR(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-3 font-bold">
          <span>Total</span><span className="text-primary">{formatINR(total)}</span>
        </div>
      </aside>
    </div>
  );
}