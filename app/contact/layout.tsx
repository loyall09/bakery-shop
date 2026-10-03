import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp or send us a message for custom cake orders.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}