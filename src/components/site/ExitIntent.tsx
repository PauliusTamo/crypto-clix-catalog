import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useCart } from "@/lib/cart";

export function ExitIntent() {
  const { total, totalItems, shortsQty } = useCart();
  const [visible, setVisible] = useState(false);
  const hasItems = totalItems > 0 || shortsQty > 0;
  const shownRef = useRef(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY < 10 && hasItems && !shownRef.current) {
        shownRef.current = true;
        setVisible(true);
      }
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [hasItems]);

  if (!visible) return null;

  const message = `CryptoClicks Campaign Request\n\nI've built a campaign worth $${total}.\nPlease confirm availability and next steps.`;
  const tg = `https://t.me/crypoclicksio?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div className="w-full max-w-[480px] rounded-2xl border border-border bg-[#0f1319] p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="label-eyebrow mb-4">Before You Go</div>
        <h2 className="font-black text-3xl tracking-tighter leading-tight">
          Your campaign isn't<br />sent yet.
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          You've built a campaign worth{" "}
          <strong className="text-foreground">${total.toLocaleString()}</strong>. Send it to us
          now and we'll confirm availability within a few hours.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <a
            href={tg}
            target="_blank"
            rel="noreferrer"
            onClick={() => setVisible(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-12 text-base font-bold hover:bg-primary-glow transition shadow-lg shadow-primary/25"
          >
            <Send className="h-4 w-4" /> Send on Telegram →
          </a>
          <button
            onClick={() => setVisible(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-transparent h-10 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary transition"
          >
            I'll come back later
          </button>
        </div>
      </div>
    </div>
  );
}
