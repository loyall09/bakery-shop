import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { navLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl font-bold text-primary">{site.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{site.tagline}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Quick links</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="mb-3 text-sm font-semibold text-foreground">Visit us</p>
          <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" /> {site.address}</p>
          <p className="flex gap-2"><Phone className="h-4 w-4 shrink-0" /> {site.phone}</p>
          <p className="flex gap-2"><Clock className="h-4 w-4 shrink-0" /> {site.hours}</p>
        </div>
      </div>
      <p className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {site.name}. Demo website.
      </p>
    </footer>
  );
}