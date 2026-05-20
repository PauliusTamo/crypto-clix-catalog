import { Share2, ShoppingBag, Users } from "lucide-react";
import { BUNDLE_PRICES, useCart } from "@/lib/cart";

function formatReach(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

const NEXT_TIER: Record<number, { name: string; count: number }> = {
  2: { name: "Starter", count: 3 },
  4: { name: "Growth",  count: 5 },
  6: { name: "Pro",     count: 7 },
};

export function UpsellBanner() {
  const { totalItems, shortsQty, total, totalReach, uniqueChannels } = useCart();
  const hasItems = totalItems > 0 || shortsQty > 0;
  if (!hasItems) return null;

  const oneAway = NEXT_TIER[uniqueChannels];
  const nextBundlePrice = oneAway ? BUNDLE_PRICES[oneAway.count] : null;

  const openCart = () =>
    window.dispatchEvent(new CustomEvent("open-cart"));

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none">
      <div
        className="pointer-events-auto border-t border-white/10 bg-[#08090f]"
        style={{ transform: "translateZ(0)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center justify-between gap-3 md:gap-6">

          {/* Price + optional inline hint */}
          <div className="flex flex-col leading-tight shrink-0">
            <span className="font-black text-white text-xl tracking-tighter">
              ${total.toLocaleString()}
            </span>
            {oneAway && nextBundlePrice !== null ? (
              <span className="hidden sm:block text-[11px] text-primary/80 font-semibold mt-0.5">
                +1 channel → {oneAway.name} Bundle ${nextBundlePrice.toLocaleString()}
              </span>
            ) : (
              <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                Total
              </span>
            )}
          </div>

          <span className="hidden sm:block w-px h-8 bg-white/10 shrink-0" />

          {/* Reach — hidden on mobile */}
          <div className="hidden sm:flex flex-col items-start leading-tight shrink-0">
            <span className="font-black text-white text-xl tracking-tighter flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-white/40" />
              {formatReach(totalReach)}
            </span>
            <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
              Reach
            </span>
          </div>

          <div className="flex-1" />

          {/* Mobile share button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("share-campaign"))}
            className="md:hidden grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#1a1f2e] text-muted-foreground hover:text-primary hover:border-primary transition-colors shrink-0"
            aria-label="Share campaign"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* Checkout button */}
          <button
            onClick={openCart}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary hover:bg-primary-glow text-primary-foreground transition-colors px-5 h-11 text-sm font-bold shadow-lg shadow-primary/20"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>View Campaign</span>
          </button>
        </div>
      </div>
    </div>
  );
}
