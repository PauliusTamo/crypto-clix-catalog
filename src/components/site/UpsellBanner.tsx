import { useCart } from "@/lib/cart";
import { ArrowRight } from "lucide-react";

export function UpsellBanner() {
  const { totalItems, total } = useCart();
  if (totalItems < 1) return null;

  let text = "";
  let cta: string | null = "ADD MORE";
  let success = false;

  if (totalItems === 1) {
    text = "🎯 Add 2 more to unlock the 3-video bundle — save $200";
  } else if (totalItems === 2) {
    text = "⚡ One more video to unlock bundle pricing!";
  } else if (totalItems === 3 || totalItems === 4) {
    success = true;
    text = "🎉 Bundle unlocked! Add 2 more to reach the 5-video deal and save an extra $150";
    cta = "UPGRADE";
  } else if (totalItems === 5 || totalItems === 6) {
    success = true;
    text = "🚀 Almost there — add more to unlock the full 7-channel Pro bundle";
    cta = "UPGRADE";
  } else {
    success = true;
    text = "🏆 Maximum bundle active — you're getting our best rate.";
    cta = null;
  }

  const bg = success
    ? "bg-emerald-500/15 border-emerald-400/30"
    : "bg-[rgba(74,108,247,0.15)] border-[rgba(74,108,247,0.3)]";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none">
      <div
        className={`pointer-events-auto border-t backdrop-blur-xl ${bg} transition-colors duration-500`}
        style={{ backdropFilter: "blur(12px)" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className="shrink-0 font-black text-white text-lg md:text-xl tracking-tighter">
              ${total.toLocaleString()}
            </span>
            <span className="hidden sm:block w-px h-5 bg-white/20 shrink-0" />
            <p className="font-medium text-sm md:text-base text-foreground truncate">{text}</p>
          </div>
          {cta && (
            <a
              href="#channels"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-glow text-primary-foreground transition-colors px-3.5 h-9 text-xs font-bold tracking-wider"
            >
              {cta} <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
