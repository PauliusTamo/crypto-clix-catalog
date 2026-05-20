import { useEffect, useMemo, useRef, useState } from "react";
import { ShoppingCart, X, Copy, Mail, Send, Check, Trash2, Minus, Plus, Video, Newspaper, Share2 } from "lucide-react";
import { ADDON, CHANNELS, HOMEPAGE_PIN_PRICE, PR_LISTING, SHORTS_PRICES, useCart } from "@/lib/cart";
import { UpsellOverlay } from "./UpsellOverlay";

type View = "closed" | "upsell" | "checkout";

export function CheckoutFlow() {
  const [view, setView] = useState<View>("closed");
  const upsellShownRef = useRef(false);
  const { totalItems, shortsQty, uniqueChannels, prListingEnabled, cart, pins } = useCart();
  const hasItems = totalItems > 0 || shortsQty > 0;
  const [shareCopied, setShareCopied] = useState(false);
  const [emptyMsg, setEmptyMsg] = useState(false);
  const emptyMsgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasUpsellContent =
    (uniqueChannels > 0 && uniqueChannels < 7) ||
    !prListingEnabled ||
    shortsQty === 0;

  const openCart = () => {
    if (!hasItems) {
      if (emptyMsgTimerRef.current) clearTimeout(emptyMsgTimerRef.current);
      setEmptyMsg(true);
      emptyMsgTimerRef.current = setTimeout(() => setEmptyMsg(false), 2500);
      return;
    }
    if (!upsellShownRef.current && hasUpsellContent) {
      setView("upsell");
    } else {
      setView("checkout");
    }
  };

  const openCartRef = useRef(openCart);
  openCartRef.current = openCart;

  const handleUpsellContinue = () => { upsellShownRef.current = true; setView("checkout"); };
  const handleUpsellNoThanks = () => { upsellShownRef.current = true; setView("checkout"); };
  const handleUpsellAddChannels = () => {
    setView("closed");
    setTimeout(() => document.getElementById("channels")?.scrollIntoView({ behavior: "smooth" }), 50);
  };
  const handleUpsellDismiss = () => { upsellShownRef.current = true; setView("closed"); };

  const handleShare = async () => {
    const entries = Object.entries(cart);
    if (!entries.length) return;
    const cartStr = entries.map(([id, qty]) => {
      const ch = CHANNELS.find((c) => c.id === id)!;
      const name = ch.name.replace(/\s+/g, "");
      const pin = pins[id] ? ":pin" : "";
      return `${name}:${qty}${pin}`;
    }).join(",");
    const url = `${window.location.origin}${window.location.pathname}?cart=${encodeURIComponent(cartStr)}`;
    window.history.replaceState({}, "", `?cart=${encodeURIComponent(cartStr)}`);
    await navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const handleShareRef = useRef(handleShare);
  handleShareRef.current = handleShare;

  useEffect(() => {
    const handler = () => openCartRef.current();
    const shareHandler = () => handleShareRef.current();
    window.addEventListener("open-cart", handler);
    window.addEventListener("share-campaign", shareHandler);
    return () => {
      window.removeEventListener("open-cart", handler);
      window.removeEventListener("share-campaign", shareHandler);
    };
  }, []);

  return (
    <>
      {/* Share button — shown above cart button when cart has items (desktop only) */}
      {hasItems && (
        <div className="hidden md:flex fixed bottom-[10.5rem] right-5 z-40 items-center gap-2 md:bottom-[11.5rem] md:right-8">
          {shareCopied && (
            <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-2.5 py-1 whitespace-nowrap">
              Campaign link copied!
            </span>
          )}
          <button
            onClick={handleShare}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#1a1f2e] border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors shadow-lg"
            aria-label="Share campaign"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {emptyMsg && (
        <div className="fixed bottom-[7.5rem] right-5 z-40 md:bottom-[8.5rem] md:right-8 pointer-events-none">
          <span className="inline-block rounded-lg bg-[#1a1f2e] border border-border text-muted-foreground text-xs font-medium px-3 py-2 shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
            Add at least one channel to continue
          </span>
        </div>
      )}

      <button
        onClick={openCart}
        className={`fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:bg-primary-glow transition-colors md:bottom-28 md:right-8${hasItems ? " cart-pulse" : ""}`}
        aria-label="Open campaign cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {hasItems && (
          <span className="absolute -top-1 -right-1 grid h-6 min-w-6 place-items-center rounded-full bg-destructive px-1.5 text-xs font-black text-white border-2 border-background">
            {totalItems + (shortsQty > 0 ? 1 : 0)}
          </span>
        )}
      </button>

      {view === "upsell" && (
        <UpsellOverlay
          onContinue={handleUpsellContinue}
          onNoThanks={handleUpsellNoThanks}
          onAddChannels={handleUpsellAddChannels}
          onDismiss={handleUpsellDismiss}
        />
      )}
      {view === "checkout" && (
        <CheckoutModal onClose={() => setView("closed")} />
      )}
    </>
  );
}

function CheckoutModal({ onClose }: { onClose: () => void }) {
  const {
    cart, pins, subtotal, bundleActive, channelTotal, savings,
    pinTotal, shortsQty, setShortsQty, shortsTotal,
    prListingEnabled, setPrListingEnabled, prListingTotal,
    addonEnabled, setAddonEnabled, total, uniqueChannels,
    clearItem, setQty, togglePin,
  } = useCart();
  const [copied, setCopied] = useState(false);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

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
    const header = projectName.trim()
      ? `*CryptoClicks Campaign Request — ${projectName.trim()}*`
      : "*CryptoClicks Campaign Request*";
    lines.push(header, "");

    if (selectedItems.length > 0) {
      lines.push("*Selected Channels:*");
      if (projectName.trim()) lines.push(`*Project:* ${projectName.trim()}`);
      selectedItems.forEach((s) => {
        lines.push(`- ${s.name} × ${s.qty} ($${s.price * s.qty})`);
        if (s.pinned) lines.push(`  ↳ Homepage Pin × 30 days — +$${HOMEPAGE_PIN_PRICE}`);
      });
    }

    if (shortsQty > 0) {
      lines.push("", "*Short Video Ads:*");
      lines.push(`- ${shortsQty} Short Video Ad${shortsQty > 1 ? "s" : ""} — $${SHORTS_PRICES[shortsQty]}`);
    }

    if (prListingEnabled) {
      lines.push("", "*Add-Ons:*");
      lines.push(`- ${PR_LISTING.title} — $${PR_LISTING.price}`);
    }

    lines.push("", "*Financial Summary:*");
    if (selectedItems.length > 0) {
      if (bundleActive) {
        lines.push(`- ${uniqueChannels}-Channel Bundle Rate: $${channelTotal}`);
        if (savings > 0) lines.push(`- Bundle Savings: −$${savings}`);
      } else {
        lines.push(`- Channel Subtotal: $${subtotal}`);
      }
    }
    if (pinTotal > 0) lines.push(`- Homepage Pin(s): +$${pinTotal}`);
    if (shortsTotal > 0) lines.push(`- Short Video Ads: +$${shortsTotal}`);
    if (prListingTotal > 0) lines.push(`- PR Listing: +$${prListingTotal}`);
    if (addonEnabled) lines.push(`- PR Listing & Press Coverage: +$${ADDON.price}`);
    lines.push(`- Grand Total: $${total}`);
    lines.push("", "Please confirm availability and next steps. Thank you.");
    return lines.join("\n");
  }, [selectedItems, subtotal, bundleActive, channelTotal, savings, pinTotal, shortsQty, shortsTotal, prListingEnabled, prListingTotal, addonEnabled, total, uniqueChannels, projectName]);

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
          {/* Project name */}
          <div>
            <label className="label-eyebrow mb-2 block">Your Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. DeltaSwap, MoonFi, ArcadeToken..."
              className="w-full rounded-xl border bg-card px-4 h-11 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
              style={{ borderColor: "#2a2f45" }}
            />
          </div>

          {/* Channel items */}
          <div>
            <div className="label-eyebrow mb-3">Order Summary</div>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {selectedItems.length === 0 && shortsQty === 0 && !prListingEnabled && (
                <div className="p-4 text-sm text-muted-foreground">No items added yet.</div>
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
                      <button onClick={() => setQty(s.id, s.qty - 1)} className="grid h-6 w-6 place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition" aria-label="Decrease">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-foreground">{s.qty}</span>
                      <button onClick={() => setQty(s.id, s.qty + 1)} className="grid h-6 w-6 place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition" aria-label="Increase">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="font-bold text-sm w-16 text-right">${s.price * s.qty}</div>
                    <button onClick={() => clearItem(s.id)} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0" aria-label={`Remove ${s.name}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {s.pinned && (
                    <div className="flex items-center justify-between px-4 pb-3 pl-[3.75rem]">
                      <span className="text-xs text-amber-400/80">↳ Homepage Pin × 30 days</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-amber-400">+${HOMEPAGE_PIN_PRICE}</span>
                        <button onClick={() => togglePin(s.id)} className="grid h-5 w-5 place-items-center rounded text-amber-400/60 hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Remove homepage pin">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {shortsQty > 0 && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                    <Video className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{shortsQty} Short Video Ad{shortsQty > 1 ? "s" : ""}</div>
                    <div className="text-xs text-muted-foreground">YouTube Shorts · TikTok · Reels</div>
                  </div>
                  <div className="font-bold text-sm w-16 text-right">${SHORTS_PRICES[shortsQty]}</div>
                  <button onClick={() => setShortsQty(0)} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0" aria-label="Remove shorts">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {prListingEnabled && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                    <Newspaper className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{PR_LISTING.title}</div>
                    <div className="text-xs text-muted-foreground">50+ crypto publications</div>
                  </div>
                  <div className="font-bold text-sm w-16 text-right">${PR_LISTING.price}</div>
                  <button onClick={() => setPrListingEnabled(false)} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0" aria-label="Remove PR listing">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Pricing summary */}
            <div className="mt-4 space-y-2 text-sm">
              {selectedItems.length > 0 && (
                <>
                  {bundleActive ? (
                    <>
                      <Row label="Channel Subtotal" value={`$${subtotal}`} valueClass="text-muted-foreground line-through" />
                      <Row label={`${uniqueChannels}-Channel Bundle Rate`} value={`$${channelTotal}`} valueClass="text-primary font-bold" />
                      {savings > 0 && <Row label="Bundle Savings" value={`−$${savings}`} valueClass="text-emerald-500" />}
                    </>
                  ) : (
                    <Row label="Channel Subtotal" value={`$${subtotal}`} />
                  )}
                </>
              )}
              {pinTotal > 0 && <Row label="Homepage Pin(s)" value={`+$${pinTotal}`} valueClass="text-amber-400" />}
              {shortsTotal > 0 && <Row label="Short Video Ads" value={`+$${shortsTotal}`} />}
              {prListingTotal > 0 && <Row label="PR Listing" value={`+$${prListingTotal}`} />}
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

          {/* Message — conversion centrepiece */}
          <div className="rounded-2xl border border-primary/25 bg-[#0c1020] overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-border flex items-center justify-between gap-3">
              <div>
                <div className="font-black text-base tracking-tight text-foreground">Your message is ready.</div>
                <div className="text-xs text-muted-foreground mt-0.5">Copy it and paste it straight into Telegram or email.</div>
              </div>
              <button
                onClick={copy}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-transparent h-8 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy text"}
              </button>
            </div>
            <pre
              className="whitespace-pre-wrap p-5 text-xs leading-relaxed text-foreground/80 max-h-52 overflow-y-auto"
              style={{ fontFamily: "var(--font-mono)" }}
            >
{message}
            </pre>
            <div className="px-5 pb-5 pt-1 grid grid-cols-2 gap-3">
              <a
                href={mailto}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface-elevated h-11 text-sm font-semibold text-foreground hover:bg-[#222a3d] transition"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
              <a
                href={tg}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-11 text-sm font-bold hover:bg-primary-glow transition shadow-lg shadow-primary/25"
              >
                <Send className="h-4 w-4" /> Send on Telegram
              </a>
            </div>
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
