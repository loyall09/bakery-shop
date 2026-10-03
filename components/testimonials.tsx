import { Star } from "lucide-react";

const reviews = [
  { name: "Priya Joshi", text: "Ordered a truffle cake for my daughter's birthday. Fresh, soft and delivered on time. Everyone asked where it was from!", },
  { name: "Rahul Bisht", text: "The kaju katli is the best I've had in Haldwani. We now order all our Diwali mithai from here.", },
  { name: "Anita Rawat", text: "Croissants every Sunday morning. Always warm and flaky. Easy ordering too.", },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-center font-serif text-3xl font-bold">What our customers say</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.name} className="rounded-xl border bg-card p-6">
            <div className="mb-3 flex gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{r.text}</p>
            <p className="mt-4 text-sm font-semibold">{r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}