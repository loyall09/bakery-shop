"use client";

import { useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY!);
    data.append("subject", `New enquiry from ${site.short} website`);
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) {
        setStatus("done");
        form.reset();
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="font-serif text-4xl font-bold">Contact us</h1>
        <p className="mt-3 text-muted-foreground">
          Planning a custom cake or a bulk order? Send us a message and we&apos;ll get back to you soon.
        </p>
        <div className="mt-8 space-y-4 text-sm">
          <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-primary" /> {site.address}</p>
          <p className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-primary" /> {site.phone}</p>
          <p className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-primary" /> {site.hours}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-6">
        <Input name="name" required placeholder="Your name" />
        <Input name="phone" required placeholder="Phone number" inputMode="numeric" />
        <Textarea name="message" required rows={5} placeholder="Tell us what you need" />
        {/* spam trap for Web3Forms */}
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
        <Button type="submit" className="w-full" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send message"}
        </Button>
        {status === "done" && <p className="text-sm text-green-600">Thanks! We&apos;ll contact you shortly.</p>}
        {status === "error" && <p className="text-sm text-red-500">Could not send. Please WhatsApp us instead.</p>}
      </form>
    </div>
  );
}