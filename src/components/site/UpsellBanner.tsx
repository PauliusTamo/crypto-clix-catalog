import { useCart } from "@/lib/cart";
import { ArrowRight } from "lucide-react";

export function UpsellBanner() {
  const { uniqueChannels } = useCart();
  if (uniqueChannels < 1) return null;

  let bg = "bg-primary";
  let text = "";
  let cta: string | null = "ADD MORE";

  if (uniqueChannels === 1) {
    text = "🎯 Add 2 more channels and unlock the 3-channel bundle — save $200";
  } else if (uniqueChannels === 2) {
    text = "⚡ One more channel to unlock bundle pricing!";
  } else if (uniqueChannels === 3 || uniqueChannels === 4) {
    bg = "bg-emerald-500";
    text = `🎉 Bundle unlocked! Add ${
      5 - uniqueChannels
    } more to reach the 5-channel deal and save an extra $150`;
    cta = "UPGRADE";
  } else {
    bg = "bg-emerald-500";
    text = "🏆 Maximum bundle active — you're getting our best rate.";
    cta = null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none animate-in slide-in-from-bottom-4 duration-300">
      <div className="mx-auto max-w-5xl px-4 pb-4 md:pb-6">
        <div
          className={`pointer-events-auto flex items-center justify-between gap-4 rounded-2xl ${bg} px-5 py-4 text-white shadow-2xl transition-colors duration-500`}
        >
          <p className="font-semibold text-sm md:text-base">{text}</p>
          {cta && (
            <a
              href="#channels"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition-colors px-3.5 h-9 text-xs font-bold tracking-wider"
            >
              {cta} <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
