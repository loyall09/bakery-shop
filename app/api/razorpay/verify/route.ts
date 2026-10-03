import { NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const order = await convex.query(api.orders.get, { id: orderId });

    if (!order || order.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await convex.mutation(api.orders.markPaid, {
      adminKey: process.env.ADMIN_KEY!,
      orderId: order._id,
      razorpayPaymentId: razorpay_payment_id,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}