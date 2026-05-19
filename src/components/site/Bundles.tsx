import { Check } from "lucide-react";

const BUNDLES = [
  { name: "Starter", channels: "3 channels", price: 1200, featured: false },
  { name: "Growth", channels: "5 channels", price: 1900, featured: false },
  { name: "Pro", channels: "7 channels", price: 2500, featured: true },
];

const INCLUDED = [
  "Dedicated video per channel",
  "Channel's full audience reach",
  "Detailed campaign report",
];

export function Bundles() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center mb-12">
        <div className="label-eyebrow mb-3">Pricing</div>
        <h2 className="font-black tracking-tighter text-4xl md:text-5xl">
          BUNDLE PRICING
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {BUNDLES.map((b) => (
          <div
            key={b.name}
            className={`relative rounded-2xl border p-7 transition ${
              b.featured
                ? "border-primary bg-gradient-to-b from-primary/15 to-card"
                : "border-border bg-card"
            }`}
          >
            {b.featured && (
              <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] font-black tracking-widest text-primary-foreground">
                MOST POPULAR
              </span>
            )}
            <div className="label-eyebrow">{b.name}</div>
            <div className="mt-2 text-muted-foreground">{b.channels}</div>
            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-black text-5xl tracking-tighter">
                ${b.price.toLocaleString()}
              </span>
            </div>
            <ul className="mt-7 space-y-3">
              {INCLUDED.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      b.featured ? "text-primary" : "text-emerald-500"
                    }`}
                  />
                  <span className="text-foreground/90">{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
