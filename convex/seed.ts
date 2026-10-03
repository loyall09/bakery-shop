import { internalMutation } from "./_generated/server";

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return "Already seeded";

    const items = [
      { name: "Chocolate Truffle Cake (1 kg)", description: "Rich dark chocolate sponge layered with truffle ganache. Fresh-baked on order.", price: 850, category: "Cakes", featured: true },
      { name: "Black Forest Cake (1 kg)", description: "Classic cherry and whipped cream cake with chocolate shavings.", price: 750, category: "Cakes", featured: true },
      { name: "Pineapple Cake (1 kg)", description: "Light vanilla sponge with fresh pineapple and cream.", price: 700, category: "Cakes", featured: false },
      { name: "Red Velvet Cake (1 kg)", description: "Soft red velvet layers with cream cheese frosting.", price: 950, category: "Cakes", featured: false },
      { name: "Butter Croissant", description: "Flaky, golden and buttery. Baked every morning.", price: 60, category: "Pastries", featured: false },
      { name: "Chocolate Pastry", description: "Single-serve chocolate pastry with a glossy ganache top.", price: 80, category: "Pastries", featured: true },
      { name: "Blueberry Muffin", description: "Moist muffin packed with blueberries.", price: 70, category: "Pastries", featured: false },
      { name: "Kaju Katli (500 g)", description: "Thin, smooth cashew fudge made with pure ghee.", price: 650, category: "Sweets", featured: true },
      { name: "Motichoor Laddu (500 g)", description: "Fine boondi laddus with cardamom and saffron.", price: 350, category: "Sweets", featured: false },
      { name: "Gulab Jamun (6 pcs)", description: "Soft khoya dumplings soaked in warm sugar syrup.", price: 180, category: "Sweets", featured: false },
      { name: "Atta Cookies (250 g)", description: "Crunchy whole-wheat cookies, baked fresh.", price: 150, category: "Cookies & Bread", featured: false },
      { name: "Multigrain Bread", description: "Soft, healthy loaf with seeds. Baked daily.", price: 70, category: "Cookies & Bread", featured: false },
    ];

    for (const p of items) {
      await ctx.db.insert("products", { ...p, inStock: true });
    }
    return `Inserted ${items.length} products`;
  },
});