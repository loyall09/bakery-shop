import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const orderStatus = v.union(
  v.literal("pending"),
  v.literal("paid"),
  v.literal("preparing"),
  v.literal("delivered"),
  v.literal("cancelled")
);

export default defineSchema({
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(), // rupees
    category: v.string(),
    image: v.optional(v.string()),
    featured: v.boolean(),
    inStock: v.boolean(),
  })
    .index("by_category", ["category"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["category"],
    }),

  orders: defineTable({
    customerName: v.string(),
    phone: v.string(),
    address: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        qty: v.number(),
      })
    ),
    total: v.number(),
    status: orderStatus,
    razorpayOrderId: v.optional(v.string()),
    razorpayPaymentId: v.optional(v.string()),
  }).index("by_status", ["status"]),
});