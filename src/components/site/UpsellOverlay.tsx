import { useEffect } from "react";
import { X, Zap, Newspaper, Video, AlertTriangle, ArrowRight, Check, Plus } from "lucide-react";
import { PR_LISTING, SHORTS_PRICES, useCart, type ShortsQty } from "@/lib/cart";

const BUNDLE_TIERS = [
  { count: 3, name: "Starter", price: 900  },
  { count: 5, name: "Growth",  price: 1400 },
  { count: 7, name: "Pro",     price: 1850 },
];

interface Props {
  onContinue: () => void;
  onNoThanks: () => void;
  onAddChannels: () => void;
  onDismiss: () => void;
}

export function UpsellOverlay({ onContinue, onNoThanks, onAddChannels, onDismiss }: Props) {
  const {
    uniqueChannels,
    prListingEnabled, setPrListingEnabled,
    shortsQty, setShortsQty,
  } = useCart();

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    };
  }, []);

  const nextTier     = BUNDLE_TIERS.find((t) => t.count > uniqueChannels);
  const showBundle   = uniqueChannels > 0 && nextTier !== undefined;
  const showPR       = !prListingEnabled;
  const showShorts   = shortsQty === 0;
  const shortsNudge  = shortsQty > 0 && uniqueChannels === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-in fade-in duration-200"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onDismiss}
    >
      <div
        className="relative w-full md:max-w-lg rounded-t-3xl md:rounded-2xl border border-border bg-[#0f1319] overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        style={{ borderLeft: "4px solid #4a6cf7" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="label-eyebrow">Before you submit</span>
            </div>
            <h2 className="font-black tracking-tighter text-2xl">Boost your campaign</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A few quick wins you might be missing.
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors shrink-0 mt-0.5"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-3">

          {/* ─── Section 1: Bundle nudge ─────────────────────────── */}
          {showBundle && (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-400">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-amber-300">
                    Unlock the {nextTier!.name} Bundle
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground leading-snug">
                    Add{" "}
                    <strong className="text-foreground">
                      {nextTier!.count - uniqueChannels} more channel
                      {nextTier!.count - uniqueChannels > 1 ? "s" : ""}
                    </strong>{" "}
                    and pay a flat{" "}
                    <strong className="text-amber-300">
                      ${nextTier!.price.toLocaleString()}
                    </strong>{" "}
                    for all {nextTier!.count} channels — regardless of which you pick.
                  </p>
                  <button
                    onClick={onAddChannels}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors px-3.5 h-8 text-xs font-bold"
                  >
                    Browse channels <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Section 2: PR Listing ───────────────────────────── */}
          {showPR && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Add-On Service</p>
                      <p className="font-bold text-sm">{PR_LISTING.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-snug">
                        {PR_LISTING.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {["CoinMarketCap", "Benzinga", "MSN", "Business Insider", "BlockTelegraph", "The Block", "Decrypt", "Cointelegraph"].map((pub) => (
                          <span
                            key={pub}
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(136,146,164,0.7)" }}
                          >
                            {pub}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="font-black text-sm text-primary shrink-0 mt-0.5">
                      +${PR_LISTING.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-3">
                    {!prListingEnabled ? (
                      <button
                        onClick={() => setPrListingEnabled(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a2f45] bg-transparent px-3.5 h-8 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Add to order
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3.5 h-8 text-xs font-bold">
                          <Check className="h-3 w-3" strokeWidth={3} /> Added to order
                        </span>
                        <button
                          onClick={() => setPrListingEnabled(false)}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Section 3: Short Video Ads ──────────────────────── */}
          {showShorts && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Video className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm">5 Short Video Ads</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-snug">
                        Fast, punchy crypto ads for YouTube Shorts, TikTok, and Reels. Script + editing included, 72-hour turnaround.
                      </p>
                    </div>
                    <span className="font-black text-sm text-primary shrink-0 mt-0.5">
                      +${SHORTS_PRICES[5]}
                    </span>
                  </div>
                  <div className="mt-3">
                    {shortsQty === 0 ? (
                      <button
                        onClick={() => setShortsQty(5 as ShortsQty)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a2f45] bg-transparent px-3.5 h-8 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Add to order
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3.5 h-8 text-xs font-bold">
                          <Check className="h-3 w-3" strokeWidth={3} /> Added ({shortsQty} videos)
                        </span>
                        <button
                          onClick={() => setShortsQty(0)}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Shorts-without-channels nudge ───────────────────── */}
          {shortsNudge && (
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-orange-300 font-semibold">Pair with a channel for better results</p>
                  <p className="mt-1 text-xs text-orange-300/80 leading-snug">
                    Short video ads perform best when paired with at least one YouTube channel — it boosts reach and lends credibility to your campaign.
                  </p>
                  <button
                    onClick={onAddChannels}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 hover:bg-orange-500/30 transition-colors px-4 h-9 text-sm font-bold"
                  >
                    Browse channels <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── CTAs ────────────────────────────────────────────── */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onContinue}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-12 text-base font-bold hover:bg-primary-glow transition shadow-lg shadow-primary/20"
            >
              Continue to Checkout <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onNoThanks}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5"
            >
              No thanks, go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
