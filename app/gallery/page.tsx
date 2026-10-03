import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A look at our cakes, pastries and mithai.",
};

const tiles = [
  { emoji: "🎂", label: "Birthday cakes", tone: "from-rose-100 to-amber-100 dark:from-rose-950 dark:to-amber-950" },
  { emoji: "🥐", label: "Morning bakes", tone: "from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950" },
  { emoji: "🍬", label: "Festival mithai", tone: "from-orange-100 to-rose-100 dark:from-orange-950 dark:to-rose-950" },
  { emoji: "🧁", label: "Cupcakes", tone: "from-pink-100 to-amber-100 dark:from-pink-950 dark:to-amber-950" },
  { emoji: "🍪", label: "Fresh cookies", tone: "from-yellow-100 to-orange-100 dark:from-yellow-950 dark:to-orange-950" },
  { emoji: "🍞", label: "Daily bread", tone: "from-amber-100 to-yellow-100 dark:from-amber-950 dark:to-yellow-950" },
  { emoji: "🎁", label: "Gift boxes", tone: "from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-950" },
  { emoji: "🍰", label: "Custom orders", tone: "from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950" },
];

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold">Gallery</h1>
      <p className="mt-2 text-muted-foreground">A taste of what comes out of our oven.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map((t) => (
          <div
            key={t.label}
            className={`flex aspect-square flex-col items-center justify-center rounded-xl bg-gradient-to-br ${t.tone}`}
          >
            <span className="text-6xl">{t.emoji}</span>
            <span className="mt-3 text-sm font-medium">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}