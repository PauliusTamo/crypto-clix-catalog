import { X, Zap, Newspaper, Video, AlertTriangle, ArrowRight } from "lucide-react";
import { PR_LISTING, SHORTS_PRICES, useCart, type ShortsQty } from "@/lib/cart";

const BUNDLE_TIERS = [
  { count: 3, name: "Starter", price: 900  },
  { count: 5, name: "Growth",  price: 1400 },
  { count: 7, name: "Pro",     price: 1850 },
];

interface Props {
  onContinue: () => void;
  onDismiss: () => void;
}

export function UpsellOverlay({ onContinue, onDismiss }: Props) {
  const {
    uniqueChannels,
    prListingEnabled, setPrListingEnabled,
    shortsQty, setShortsQty,
  } = useCart();

  const nextTier = BUNDLE_TIERS.find((t) => t.count > uniqueChannels);
  const showBundleNudge = uniqueChannels > 0 && nextTier !== undefined;
  const showPRListing   = !prListingEnabled;
  const showShorts      = shortsQty === 0;
  const showShortsNudge = shortsQty > 0 && uniqueChannels === 0;

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
            <h2 className="font-black tracking-tighter text-2xl">
              Boost your campaign
            </h2>
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
          {showBundleNudge && (
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
                    and get all {nextTier!.count} channels for a flat{" "}
                    <strong className="text-amber-300">
                      ${nextTier!.price.toLocaleString()}
                    </strong>{" "}
                    — regardless of which channels you pick.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Section 2: PR Listing ───────────────────────────── */}
          {showPRListing && (
            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-[#131a2e] transition-colors group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                <span
                  className={`grid h-5 w-5 place-items-center rounded border-2 transition-colors ${
                    prListingEnabled
                      ? "border-primary bg-primary"
                      : "border-border-strong bg-transparent group-hover:border-primary/60"
                  }`}
                >
                  {prListingEnabled && (
                    <svg viewBox="0 0 10 8" className="h-3 w-3 text-white" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm flex items-center gap-2">
                    <Newspaper className="h-3.5 w-3.5 text-primary shrink-0" />
                    {PR_LISTING.title}
                  </span>
                  <span className="font-black text-sm text-primary shrink-0">+${PR_LISTING.price}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">
                  {PR_LISTING.description}
                </p>
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={prListingEnabled}
                onChange={(e) => setPrListingEnabled(e.target.checked)}
              />
            </label>
          )}

          {/* ─── Section 3: Short Video Ads ──────────────────────── */}
          {showShorts && (
            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-[#131a2e] transition-colors group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                <span
                  className={`grid h-5 w-5 place-items-center rounded border-2 transition-colors ${
                    shortsQty > 0
                      ? "border-primary bg-primary"
                      : "border-border-strong bg-transparent group-hover:border-primary/60"
                  }`}
                >
                  {shortsQty > 0 && (
                    <svg viewBox="0 0 10 8" className="h-3 w-3 text-white" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm flex items-center gap-2">
                    <Video className="h-3.5 w-3.5 text-primary shrink-0" />
                    5 Short Video Ads
                  </span>
                  <span className="font-black text-sm text-primary shrink-0">+${SHORTS_PRICES[5]}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">
                  Fast, punchy crypto ads for YouTube Shorts, TikTok, and Reels. Script + editing included, 72-hour turnaround.
                </p>
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={shortsQty > 0}
                onChange={(e) => setShortsQty(e.target.checked ? 5 as ShortsQty : 0)}
              />
            </label>
          )}

          {/* ─── Shorts-without-channels nudge ───────────────────── */}
          {showShortsNudge && (
            <div className="flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-300 leading-snug">
                <strong>Heads up:</strong> Short video ads perform best when paired with at least one YouTube channel. Adding a channel boosts reach and lends credibility to your campaign.
              </p>
            </div>
          )}

          {/* ─── CTA ─────────────────────────────────────────────── */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onContinue}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-12 text-base font-bold hover:bg-primary-glow transition shadow-lg shadow-primary/20"
            >
              Continue to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onDismiss}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              No thanks, go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
