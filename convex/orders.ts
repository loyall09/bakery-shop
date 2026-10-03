import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./helpers";
import { orderStatus } from "./schema";

// Total is computed here from DB prices, so the browser can't change it.
export const create = mutation({
  args: {
    customerName: v.string(),
    phone: v.string(),
    address: v.string(),
    items: v.array(v.object({ productId: v.id("products"), qty: v.number() })),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) throw new Error("Cart is empty");

    let total = 0;
    const lines = [];
    for (const item of args.items) {
      const p = await ctx.db.get(item.productId);
      if (!p || !p.inStock) throw new Error("An item is no longer available");
      const qty = Math.max(1, Math.min(20, Math.floor(item.qty)));
      total += p.price * qty;
      lines.push({ productId: p._id, name: p.name, price: p.price, qty });
    }

    return await ctx.db.insert("orders", {
      customerName: args.customerName,
      phone: args.phone,
      address: args.address,
      items: lines,
      total,
      status: "pending",
    });
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const orderId = ctx.db.normalizeId("orders", id);
    if (!orderId) return null;
    return await ctx.db.get(orderId);
  },
});

// Called from our Next.js API routes (server side) only
export const attachRazorpay = mutation({
  args: { adminKey: v.string(), orderId: v.id("orders"), razorpayOrderId: v.string() },
  handler: async (ctx, { adminKey, orderId, razorpayOrderId }) => {
    assertAdmin(adminKey);
    await ctx.db.patch(orderId, { razorpayOrderId });
  },
});

export const markPaid = mutation({
  args: { adminKey: v.string(), orderId: v.id("orders"), razorpayPaymentId: v.string() },
  handler: async (ctx, { adminKey, orderId, razorpayPaymentId }) => {
    assertAdmin(adminKey);
    await ctx.db.patch(orderId, { status: "paid", razorpayPaymentId });
  },
});

export const listAll = query({
  args: { adminKey: v.string() },
  handler: async (ctx, { adminKey }) => {
    assertAdmin(adminKey);
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: { adminKey: v.string(), orderId: v.id("orders"), status: orderStatus },
  handler: async (ctx, { adminKey, orderId, status }) => {
    assertAdmin(adminKey);
    await ctx.db.patch(orderId, { status });
  },
});

export const checkAdmin = query({
  args: { adminKey: v.string() },
  handler: async (_ctx, { adminKey }) => {
    return !!process.env.ADMIN_KEY && adminKey === process.env.ADMIN_KEY;
  },
});