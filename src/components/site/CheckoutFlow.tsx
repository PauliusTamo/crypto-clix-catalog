import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, X, Copy, Mail, Send, Check, Trash2, Minus, Plus } from "lucide-react";
import { ADDON, CHANNELS, HOMEPAGE_PIN_PRICE, useCart } from "@/lib/cart";

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
  const {
    cart,
    pins,
    subtotal,
    discount,
    pinTotal,
    addonEnabled,
    setAddonEnabled,
    total,
    uniqueChannels,
    clearItem,
    setQty,
    togglePin,
  } = useCart();
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
          return { ...ch, qty, pinned: pins[id] ?? false };
        })
        .filter(Boolean),
    [cart, pins]
  );

  const message = useMemo(() => {
    const lines: string[] = [];
    lines.push("*CryptoClicks Campaign Request*", "");
    lines.push("*Selected Channels:*");
    if (selectedItems.length === 0) lines.push("- (none selected)");
    selectedItems.forEach((s) => {
      lines.push(`- ${s.name} × ${s.qty} ($${s.price * s.qty})`);
      if (s.pinned) lines.push(`  ↳ Homepage Pin × 30 days — +$${HOMEPAGE_PIN_PRICE}`);
    });
    lines.push("", "*Financial Summary:*");
    lines.push(`- Base Total: $${subtotal}`);
    if (discount > 0) lines.push(`- Bundle Discount: −$${discount}`);
    if (pinTotal > 0) lines.push(`- Homepage Pin(s): +$${pinTotal}`);
    if (addonEnabled) lines.push(`- Add-On (${ADDON.title}): $${ADDON.price}`);
    lines.push(`- Grand Total: $${total}`);
    lines.push("", "Please confirm availability and next steps. Thank you.");
    return lines.join("\n");
  }, [selectedItems, subtotal, discount, pinTotal, addonEnabled, total]);

  const copy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const mailto = `mailto:hello@cryptoclicks.io?subject=${encodeURIComponent("CryptoClicks Campaign Request")}&body=${encodeURIComponent(message)}`;
  const tg = `https://t.me/crypoclicksio?text=${encodeURIComponent(message)}`;

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
                <div key={s.id}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                      style={{ border: `2px solid ${s.color}55` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground">${s.price}/video</div>
                    </div>

                    <div className="flex items-center gap-0.5 rounded-lg border border-[#2a2f45] bg-[#0a0d14] p-0.5">
                      <button
                        onClick={() => setQty(s.id, s.qty - 1)}
                        className="grid h-6 w-6 place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-foreground">{s.qty}</span>
                      <button
                        onClick={() => setQty(s.id, s.qty + 1)}
                        className="grid h-6 w-6 place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition"
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="font-bold text-sm w-16 text-right">${s.price * s.qty}</div>

                    <button
                      onClick={() => clearItem(s.id)}
                      className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                      aria-label={`Remove ${s.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {s.pinned && (
                    <div className="flex items-center justify-between px-4 pb-3 pl-[3.75rem]">
                      <span className="text-xs text-amber-400/80">↳ Homepage Pin × 30 days</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-amber-400">+${HOMEPAGE_PIN_PRICE}</span>
                        <button
                          onClick={() => togglePin(s.id)}
                          className="grid h-5 w-5 place-items-center rounded text-amber-400/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label="Remove homepage pin"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
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
              {pinTotal > 0 && (
                <Row label="Homepage Pin(s)" value={`+$${pinTotal}`} valueClass="text-amber-400" />
              )}
              {addonEnabled && <Row label={`Add-on — ${ADDON.title}`} value={`+$${ADDON.price}`} />}
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="text-muted-foreground text-sm">Grand Total</span>
              <span className="font-black text-3xl tracking-tighter">${total}</span>
            </div>
          </div>

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

          <div>
            <div className="label-eyebrow mb-3">Pre-Written Message</div>
            <pre
              className="whitespace-pre-wrap rounded-xl border border-border bg-black/40 p-4 text-xs leading-relaxed text-foreground/90 max-h-64 overflow-y-auto"
              style={{ fontFamily: "var(--font-mono)" }}
            >
{message}
            </pre>
          </div>

          <div className="grid grid-cols-12 gap-2.5 pb-2 items-stretch">
            <button
              onClick={copy}
              className="col-span-12 md:col-span-3 inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-transparent h-10 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary transition"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <a
              href={mailto}
              className="col-span-12 md:col-span-4 inline-flex items-center justify-center gap-2 rounded-xl bg-surface-elevated h-11 text-sm font-semibold text-foreground hover:bg-[#222a3d] transition"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
            <a
              href={tg}
              target="_blank"
              rel="noreferrer"
              className="col-span-12 md:col-span-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-12 text-base font-bold hover:bg-primary-glow transition shadow-lg shadow-primary/20"
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
