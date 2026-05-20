import { Check, Plus, X } from "lucide-react";
import { SHORTS_PRICES, useCart, type ShortsQty } from "@/lib/cart";

const SHORTS_PACKAGES: { qty: ShortsQty; label: string; featured: boolean }[] = [
  { qty: 1,  label: "1 Short Video Ad",   featured: false },
  { qty: 5,  label: "5 Short Video Ads",  featured: true  },
  { qty: 10, label: "10 Short Video Ads", featured: false },
];

const FORMATS = ["YouTube Shorts", "TikTok", "Reels"];

export function Shorts() {
  const { shortsQty, setShortsQty } = useCart();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <div className="border-t border-[#1e2535] mb-10" />

      <div className="mb-6 max-w-2xl">
        <h2 className="font-black tracking-tighter text-5xl md:text-6xl leading-[0.95]">
          SHORT VIDEO<br />ADS.
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-xl">
          Fast, punchy crypto ads across YouTube Shorts, TikTok, and Reels. Multiple faces available — script and editing included.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {FORMATS.map((f) => (
          <span key={f} className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
            {f}
          </span>
        ))}
        <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
          Multiple Faces Available
        </span>
        <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
          Script + Edit Included
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-3 items-end">
        {SHORTS_PACKAGES.map((pkg) => {
          const price = SHORTS_PRICES[pkg.qty];
          const selected = shortsQty === pkg.qty;

          return (
            <div
              key={pkg.qty}
              className={`relative overflow-hidden rounded-2xl transition-all duration-200 ${
                selected
                  ? "border-2 border-primary bg-[#131a2e]"
                  : pkg.featured
                  ? "border-2 border-[#2a3568] bg-card"
                  : "border border-border bg-card"
              } ${pkg.featured ? "p-9 md:scale-[1.04] md:-translate-y-1" : "p-7"}`}
            >
              {pkg.featured && !selected && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, #4a6cf7, #7c3aed)" }}
                  aria-hidden
                />
              )}
              {selected && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, #4a6cf7, #7c3aed)" }}
                  aria-hidden
                />
              )}
              {pkg.featured && !selected && (
                <span className="absolute top-4 right-4 rounded-full bg-primary/15 text-primary border border-primary/30 px-2.5 py-1 text-[10px] font-black tracking-widest">
                  BEST VALUE
                </span>
              )}
              {selected && (
                <span className="absolute top-4 right-4 grid h-6 w-6 place-items-center rounded-full bg-primary text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}

              <div className="label-eyebrow">{pkg.qty === 1 ? "Single" : pkg.qty === 5 ? "Pack" : "Bundle"}</div>
              <div className="mt-2 text-muted-foreground text-sm">{pkg.label}</div>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-black text-5xl tracking-tighter">${price}</span>
              </div>
              {pkg.qty > 1 && (
                <div className="mt-1.5 text-xs text-muted-foreground">
                  ~${Math.round(price / pkg.qty)}/video
                </div>
              )}

              {selected ? (
                <button
                  onClick={() => setShortsQty(0)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 h-10 text-sm font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              ) : (
                <button
                  onClick={() => setShortsQty(pkg.qty as ShortsQty)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#2a2f45] bg-transparent px-4 h-10 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add to Campaign
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground italic">
        72-hour turnaround guaranteed. If we miss the deadline, you get a free video on us.
      </p>
    </section>
  );
}
