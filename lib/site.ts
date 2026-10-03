export const site = {
  name: "Mithaas Bakery & Sweets",
  short: "Mithaas",
  tagline: "Fresh cakes, pastries and mithai, baked daily in Haldwani",
  city: "Haldwani, Uttarakhand",
  address: "Nainital Road, Haldwani, Uttarakhand 263139",
  phone: "+91 99999 99999",
  whatsapp: "919999999999",
  email: "hello@mithaas-demo.in",
  hours: "Mon to Sun, 8:00 AM to 10:00 PM",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const categories = ["Cakes", "Pastries", "Sweets", "Cookies & Bread"];

export const categoryEmoji: Record<string, string> = {
  Cakes: "🎂",
  Pastries: "🥐",
  Sweets: "🍬",
  "Cookies & Bread": "🍪",
};

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");