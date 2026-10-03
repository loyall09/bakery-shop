import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { assertAdmin } from "./helpers";

export const list = query({
  args: { category: v.optional(v.string()), search: v.optional(v.string()) },
  handler: async (ctx, { category, search }) => {
    if (search && search.trim()) {
      return await ctx.db
        .query("products")
        .withSearchIndex("search_name", (q) => {
          const s = q.search("name", search);
          return category ? s.eq("category", category) : s;
        })
        .collect();
    }
    if (category) {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", category))
        .collect();
    }
    return await ctx.db.query("products").collect();
  },
});

export const featured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("featured"), true))
      .take(4);
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const productId = ctx.db.normalizeId("products", id);
    if (!productId) return null;
    return await ctx.db.get(productId);
  },
});

export const create = mutation({
  args: {
    adminKey: v.string(),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    image: v.optional(v.string()),
    featured: v.boolean(),
  },
  handler: async (ctx, { adminKey, ...data }) => {
    assertAdmin(adminKey);
    return await ctx.db.insert("products", { ...data, inStock: true });
  },
});

export const setStock = mutation({
  args: { adminKey: v.string(), id: v.id("products"), inStock: v.boolean() },
  handler: async (ctx, { adminKey, id, inStock }) => {
    assertAdmin(adminKey);
    await ctx.db.patch(id, { inStock });
  },
});

export const remove = mutation({
  args: { adminKey: v.string(), id: v.id("products") },
  handler: async (ctx, { adminKey, id }) => {
    assertAdmin(adminKey);
    await ctx.db.delete(id);
  },
});