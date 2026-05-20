import { useEffect, useRef, useState } from "react";
import { Check, ExternalLink, Minus, Plus, Tag, TrendingUp, Users } from "lucide-react";
import { BUNDLE_PRICES, CHANNELS, HOMEPAGE_PIN_PRICE, useCart, type Channel } from "@/lib/cart";

const BUNDLE_TIERS = [
  { count: 3, name: "Starter", price: 900  },
  { count: 5, name: "Growth",  price: 1400 },
  { count: 7, name: "Pro",     price: 1850 },
];

function BundleSavingsBar() {
  const { uniqueChannels, subtotal, bundleActive, channelTotal } = useCart();
  const prevTierRef = useRef<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  // Fire animation whenever we land exactly on a bundle tier
  const currentTier = bundleActive
    ? BUNDLE_TIERS.find((t) => t.count === uniqueChannels)?.count ?? null
    : null;

  useEffect(() => {
    if (currentTier !== null && currentTier !== prevTierRef.current) {
      setAnimKey((k) => k + 1);
    }
    prevTierRef.current = currentTier;
  }, [currentTier]);

  if (uniqueChannels === 0) {
    return (
      <div className="mx-2 rounded-xl border border-border bg-[#0f1319] px-4 py-3 text-sm text-muted-foreground">
        <span className="text-foreground font-semibold">Bundle pricing</span>{" "}
        unlocks automatically at 3, 5, or 7 channels — save up to $650.
      </div>
    );
  }

  const actualSavings = subtotal - channelTotal;
  const nextTier = BUNDLE_TIERS.find((t) => t.count > uniqueChannels);

  if (bundleActive) {
    const tierName = BUNDLE_TIERS.find((t) => t.count === uniqueChannels)?.name ?? "";
    return (
      <div
        key={animKey}
        className="mx-2 rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-4 py-3 bundle-pop"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={2.5} />
            <span className="text-sm font-bold text-emerald-300">
              {tierName} Bundle active — {uniqueChannels} channels
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground line-through">${subtotal.toLocaleString()}</span>
            <span className="font-black text-emerald-300">${channelTotal.toLocaleString()}</span>
            {actualSavings > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 text-xs font-black">
                <Tag className="h-2.5 w-2.5" /> Save ${actualSavings.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        {nextTier && (
          <p className="mt-2 text-xs text-muted-foreground">
            Add {nextTier.count - uniqueChannels} more channel{nextTier.count - uniqueChannels > 1 ? "s" : ""} → upgrade to {nextTier.name} Bundle (${nextTier.price.toLocaleString()})
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-2 rounded-xl border border-border bg-[#0f1319] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="text-foreground font-semibold">
            {uniqueChannels} channel{uniqueChannels > 1 ? "s" : ""} selected
          </span>
          <span className="text-muted-foreground">${channelTotal.toLocaleString()} current total</span>
        </div>
        {nextTier && (
          <div className="text-xs text-muted-foreground">
            Add{" "}
            <strong className="text-foreground">
              {nextTier.count - uniqueChannels} more
            </strong>{" "}
            →{" "}
            <span className="text-primary font-semibold">
              {nextTier.name} Bundle ${nextTier.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Channels() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-28">
      <div className="label-eyebrow mb-4">Available Channels</div>
      <div className="sticky top-12 z-30 -mx-2 mb-8">
        <BundleSavingsBar />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CHANNELS.map((c) => (
          <ChannelCard key={c.id} channel={c} />
        ))}
      </div>
    </section>
  );
}

function ChannelCard({ channel }: { channel: Channel }) {
  const { cart, pins, add, remove, setQty, togglePin } = useCart();
  const qty = cart[channel.id] ?? 0;
  const selected = qty > 0;
  const pinned = pins[channel.id] ?? false;
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (!pinError) return;
    const t = setTimeout(() => setPinError(false), 3000);
    return () => clearTimeout(t);
  }, [pinError]);

  const handlePinToggle = () => {
    if (!selected) { setPinError(true); return; }
    togglePin(channel.id);
  };

  return (
    <article
      className="relative rounded-2xl border overflow-hidden transition-all duration-200"
      style={
        selected
          ? {
              background: `linear-gradient(135deg, ${channel.color}10 0%, #111827 100%)`,
              borderColor: channel.color,
              borderWidth: 2,
              boxShadow: `0 0 0 1px ${channel.color}30, 0 8px 32px ${channel.color}18`,
              transform: "translateY(0)",
            }
          : { background: "#0f1319", borderColor: "#1e2535", borderWidth: 1 }
      }
      onMouseEnter={(e) => {
        if (!selected) (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        if (!selected) (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Color stripe */}
      <span
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl pointer-events-none z-10"
        style={{
          backgroundColor: channel.color,
          boxShadow: selected ? `0 0 20px ${channel.color}` : "none",
          transition: "box-shadow 0.3s ease",
        }}
        aria-hidden
      />

      <div className="pl-5 pr-5 pt-5 pb-5">
        {/* Badge or selected check */}
        {selected ? (
          <span
            className="absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-full text-white z-10"
            style={{ backgroundColor: channel.color }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        ) : channel.badge ? (
          <span
            className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-black tracking-wide border z-10"
            style={{
              backgroundColor: channel.color + "18",
              borderColor: channel.color + "40",
              color: channel.color,
            }}
          >
            {channel.badge}
          </span>
        ) : null}

        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src={channel.image}
            alt={channel.name}
            className="h-12 w-12 shrink-0 rounded-full object-cover transition-all duration-200"
            style={{
              border: selected ? `2px solid ${channel.color}` : `2px solid ${channel.color}55`,
              boxShadow: selected ? `0 0 10px ${channel.color}55` : "none",
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3
                className="font-bold truncate transition-colors duration-200"
                style={{ color: selected ? channel.color : "white" }}
              >
                {channel.name}
              </h3>
              <a
                href={channel.link}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                aria-label={`Open ${channel.name}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {channel.subs} subscribers
            </div>
          </div>
        </div>

        {/* Metrics row */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-black/20 px-3 py-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Avg Views</div>
            <div className="text-sm font-bold text-foreground">{channel.avgViews}</div>
          </div>
          <div className="rounded-lg bg-black/20 px-3 py-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5 flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5" /> Engagement
            </div>
            <div className="text-sm font-bold text-emerald-400">{channel.engagementRate}</div>
          </div>
        </div>

        {/* Audience descriptor */}
        <p className="mt-3 text-xs text-muted-foreground italic leading-relaxed">
          {channel.audienceDesc}
        </p>

        {/* Homepage pin toggle */}
        <div
          className={`mt-4 flex items-center justify-between transition-all duration-200 ${
            pinned ? "rounded-lg border px-3 py-2" : ""
          }`}
          style={pinned ? { borderColor: "#f59e0b55", backgroundColor: "#f59e0b08" } : {}}
        >
          <span className="text-xs text-muted-foreground">📌 Homepage Pin — 30 days</span>
          <div className="flex items-center gap-2">
            <span
              className="text-xs transition-all"
              style={{ color: pinned ? "#f59e0b" : undefined, fontWeight: pinned ? 700 : 400 }}
            >
              +${HOMEPAGE_PIN_PRICE}
            </span>
            <button
              role="switch"
              aria-checked={pinned}
              onClick={handlePinToggle}
              className="relative shrink-0 rounded-full"
              style={{
                width: 44,
                height: 24,
                backgroundColor: pinned ? "#f59e0b" : "#2a2f45",
                transition: "background-color 150ms ease",
              }}
            >
              <span
                className="absolute h-5 w-5 rounded-full bg-white"
                style={{
                  top: 2,
                  left: 2,
                  transition: "transform 150ms ease",
                  transform: pinned ? "translateX(0px)" : "translateX(20px)",
                }}
              />
            </button>
          </div>
        </div>

        {pinError && (
          <p className="mt-1.5 text-xs" style={{ color: "#e53e3e" }}>
            Add this channel first to enable the Homepage Pin.
          </p>
        )}

        {/* Price + action */}
        <div className="mt-4 pt-4 border-t border-[#1e2535] flex items-center justify-between">
          <div
            className="font-black text-2xl tracking-tighter transition-colors duration-200"
            style={{ color: selected ? channel.color : "white" }}
          >
            ${channel.price}
            <span className="text-sm font-normal text-muted-foreground ml-1">/video</span>
          </div>

          {!selected ? (
            <button
              onClick={() => add(channel.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a2f45] bg-transparent px-3.5 h-9 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          ) : (
            <div
              className="flex items-center gap-1 rounded-lg border p-1"
              style={{ borderColor: channel.color, backgroundColor: channel.color + "18" }}
            >
              <button
                onClick={() => remove(channel.id)}
                className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-white/10 transition"
                aria-label="Decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <input
                value={qty}
                onChange={(e) =>
                  setQty(channel.id, Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-8 bg-transparent text-center font-bold text-foreground outline-none"
              />
              <button
                onClick={() => add(channel.id)}
                className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-white/10 transition"
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
