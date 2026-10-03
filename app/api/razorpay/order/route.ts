import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // amount comes from our database, never from the browser
    const order = await convex.query(api.orders.get, { id: orderId });
    if (!order || order.status !== "pending") {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const rzpOrder = await rzp.orders.create({
      amount: Math.round(order.total * 100), // paise
      currency: "INR",
      receipt: String(order._id),
    });

    await convex.mutation(api.orders.attachRazorpay, {
      adminKey: process.env.ADMIN_KEY!,
      orderId: order._id,
      razorpayOrderId: rzpOrder.id,
    });

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not start payment" }, { status: 500 });
  }
}