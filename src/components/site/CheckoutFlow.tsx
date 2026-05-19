import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, X, Copy, Mail, Send, Check } from "lucide-react";
import { ADDON, CHANNELS, useCart } from "@/lib/cart";

const TELEGRAM_HANDLE = "YOUR_HANDLE";

export function CheckoutFlow() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:bg-primary-glow transition-colors md:bottom-28 md:right-8"
        aria-label="Open campaign cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 grid h-6 min-w-6 place-items-center rounded-full bg-destructive px-1.5 text-xs font-black text-white border-2 border-background">
            {totalItems}
          </span>
        )}
      </button>

      {open && <CheckoutModal onClose={() => setOpen(false)} />}
    </>
  );
}

function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { cart, subtotal, discount, addonEnabled, setAddonEnabled, total, uniqueChannels } = useCart();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const selectedItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const ch = CHANNELS.find((c) => c.id === id)!;
          return { ...ch, qty };
        })
        .filter(Boolean),
    [cart]
  );

  const message = useMemo(() => {
    const lines: string[] = [];
    lines.push("*CryptoClix Campaign Request*", "");
    lines.push("*Selected Channels:*");
    if (selectedItems.length === 0) lines.push("- (none selected)");
    selectedItems.forEach((s) => lines.push(`- ${s.name} × ${s.qty} ($${s.price * s.qty})`));
    lines.push("", "*Financial Summary:*");
    lines.push(`- Base Total: $${subtotal}`);
    if (discount > 0) lines.push(`- Bundle Discount: −$${discount}`);
    if (addonEnabled) lines.push(`- Add-On (${ADDON.title}): $${ADDON.price}`);
    lines.push(`- Grand Total: $${total}`);
    lines.push("", "Please confirm availability and next steps. Thank you.");
    return lines.join("\n");
  }, [selectedItems, subtotal, discount, addonEnabled, total]);

  const copy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const mailto = `mailto:?subject=${encodeURIComponent("CryptoClix Campaign Request")}&body=${encodeURIComponent(message)}`;
  const tg = `https://t.me/${TELEGRAM_HANDLE}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-in fade-in duration-200"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full md:max-w-2xl h-[92vh] md:h-auto md:max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border border-border bg-[#0f1319] animate-in slide-in-from-bottom-4 duration-300"
        style={{ borderLeft: "4px solid #4a6cf7" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-[#0f1319]/95 backdrop-blur px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Send className="h-4 w-4 text-primary" />
            <h2 className="font-black tracking-tighter text-xl">CAMPAIGN READY</h2>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface-elevated">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="label-eyebrow mb-3">Order Summary</div>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {selectedItems.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">No channels added yet.</div>
              )}
              {selectedItems.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full text-xs font-black text-white" style={{ backgroundColor: s.color }}>
                      {s.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <div className="font-semibold text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground">Qty {s.qty} · ${s.price} each</div>
                    </div>
                  </div>
                  <div className="font-bold">${s.price * s.qty}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={`$${subtotal}`} />
              {discount > 0 && (
                <Row
                  label={`Bundle discount — ${uniqueChannels} channels`}
                  value={`−$${discount}`}
                  valueClass="text-emerald-500"
                />
              )}
              {addonEnabled && <Row label={`Add-on — ${ADDON.title}`} value={`+$${ADDON.price}`} />}
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="text-muted-foreground text-sm">Grand Total</span>
              <span className="font-black text-3xl tracking-tighter">${total}</span>
            </div>
          </div>

          {/* Add-on */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="label-eyebrow mb-2">Add-On Service</div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold">{ADDON.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{ADDON.description}</p>
                <div className="mt-2 text-destructive font-bold">+${ADDON.price}</div>
              </div>
              <button
                onClick={() => setAddonEnabled(!addonEnabled)}
                role="switch"
                aria-checked={addonEnabled}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${addonEnabled ? "bg-primary" : "bg-surface-elevated border border-border-strong"}`}
              >
                <span className={`absolute top-0.5 grid h-6 w-6 place-items-center rounded-full bg-white transition-transform ${addonEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          {/* Message */}
          <div>
            <div className="label-eyebrow mb-3">Pre-Written Message</div>
            <pre className="whitespace-pre-wrap rounded-xl border border-border bg-background/60 p-4 text-xs leading-relaxed text-foreground/90 font-mono max-h-64 overflow-y-auto">
{message}
            </pre>
          </div>

          <div className="grid gap-2.5 md:grid-cols-3 pb-2">
            <button
              onClick={copy}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface-elevated h-11 text-sm font-semibold hover:border-primary transition"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <a
              href={mailto}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface-elevated h-11 text-sm font-semibold hover:border-primary transition"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
            <a
              href={tg}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-11 text-sm font-bold hover:bg-primary-glow transition"
            >
              <Send className="h-4 w-4" /> Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
