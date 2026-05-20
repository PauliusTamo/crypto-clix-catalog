import { Check, Plus, X } from "lucide-react";
import { SHORTS_PRICES, useCart, type ShortsQty } from "@/lib/cart";

const SHORTS_PACKAGES: { qty: ShortsQty; label: string; featured: boolean }[] = [
  { qty: 1,  label: "1 Short Video Ad",   featured: false },
  { qty: 5,  label: "5 Short Video Ads",  featured: true  },
  { qty: 10, label: "10 Short Video Ads", featured: false },
];

const PLATFORM_TAGS = [
  { label: "YouTube Shorts",          dot: "#ef4444" },
  { label: "TikTok",                  dot: "#ffffff" },
  { label: "Reels",                   dot: "#a855f7" },
  { label: "Multiple Faces Available",dot: null      },
  { label: "Script + Edit Included",  dot: null      },
];

export function Shorts() {
  const { shortsQty, setShortsQty } = useCart();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      {/* Section break — warm radial glow */}
      <div className="relative mb-10 h-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(249,115,22,0.05) 0%, transparent 100%)",
            filter: "blur(30px)",
          }}
          aria-hidden
        />
      </div>

      <div className="mb-6 max-w-2xl">
        <div className="label-eyebrow mb-3">Pricing</div>
        <h2 className="font-black tracking-tighter text-5xl md:text-6xl leading-[0.95]">
          SHORT VIDEO<br />ADS.
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-xl">
          Fast, punchy crypto ads across YouTube Shorts, TikTok, and Reels. Multiple faces available — script and editing included.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {PLATFORM_TAGS.map((t) => (
          <span
            key={t.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#2a2f45] bg-card px-3 py-1 text-xs font-semibold text-muted-foreground"
          >
            {t.dot && (
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: t.dot }}
              />
            )}
            {t.label}
          </span>
        ))}
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
              style={
                pkg.featured && !selected
                  ? { boxShadow: "0 0 0 1px #4a6cf7, 0 8px 32px rgba(74,108,247,0.2)" }
                  : undefined
              }
            >
              {(pkg.featured && !selected) && (
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

      <div className="mt-8 flex items-center justify-center gap-2">
        <Check className="h-4 w-4 text-emerald-500 shrink-0" strokeWidth={2.5} />
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground font-semibold">72-hour turnaround, guaranteed.</strong>{" "}
          Miss the deadline and you get a free video.
        </p>
      </div>
    </section>
  );
}
