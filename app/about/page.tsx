import type { Metadata } from "next";
import { Testimonials } from "@/components/testimonials";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description: `The story behind ${site.name}, a family bakery in Haldwani.`,
};

const stats = [
  { n: "15+", l: "Years baking" },
  { n: "50+", l: "Items on the menu" },
  { n: "10,000+", l: "Happy customers" },
];

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="font-serif text-4xl font-bold">About {site.short}</h1>
        <p className="mt-5 text-muted-foreground">
          {site.name} started as a small family kitchen in {site.city}. We believe good food needs
          no shortcuts: real butter, pure ghee, fresh milk and nothing made the day before.
        </p>
        <p className="mt-4 text-muted-foreground">
          Today we bake cakes for birthdays and weddings, make mithai for every festival, and open
          our doors every morning with fresh bread and pastries. Now you can order online and we
          will bring it to your door.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl border bg-card p-5">
              <p className="text-2xl font-bold text-primary">{s.n}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
      <Testimonials />
    </>
  );
}