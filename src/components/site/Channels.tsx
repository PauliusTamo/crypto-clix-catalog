import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, ExternalLink, Minus, Plus, Tag, Users, X, Zap } from "lucide-react";
import { BUNDLE_PRICES, CHANNELS, HOMEPAGE_PIN_PRICE, useCart, type Channel } from "@/lib/cart";
import { Quiz, QuizEntryLink } from "./Quiz";

const BUNDLE_TIERS = [
  { count: 3, name: "Starter", price: 900  },
  { count: 5, name: "Growth",  price: 1400 },
  { count: 7, name: "Pro",     price: 1850 },
];

function BundleSavingsBar() {
  const { uniqueChannels, subtotal, bundleActive, channelTotal } = useCart();
  const prevTierRef = useRef<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

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
      <div className="mx-2 px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
          Bundle pricing unlocks at 3, 5, or 7 channels
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ color: "#10b981", background: "rgba(16,185,129,0.15)" }}
        >
          Save up to $650
        </span>
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
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareMaxError, setCompareMaxError] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        setCompareMaxError(id);
        setTimeout(() => setCompareMaxError(null), 2500);
        return prev;
      }
      return [...prev, id];
    });
  };

  const browseAll = () => {
    document.getElementById("channels")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6 pb-28" style={{ paddingTop: 28 }}>
      {/* Quiz entry */}
      <div style={{ marginBottom: 20 }}>
        <QuizEntryLink onClick={() => setQuizOpen(true)} />
      </div>

      <div className="label-eyebrow" style={{ marginBottom: 12 }}>Available Channels</div>

      <div className="-mx-2" style={{ marginBottom: 28 }}>
        <BundleSavingsBar />
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {CHANNELS.map((c) => (
          <ChannelCard
            key={c.id}
            channel={c}
            isCompared={compareIds.includes(c.id)}
            showMaxError={compareMaxError === c.id}
            onToggleCompare={toggleCompare}
          />
        ))}
      </div>

      {/* Compare drawer */}
      <CompareDrawer
        compareIds={compareIds}
        onClose={() => setCompareIds([])}
      />

      {/* Quiz modal */}
      {quizOpen && (
        <Quiz onClose={() => setQuizOpen(false)} onBrowseAll={browseAll} />
      )}
    </section>
  );
}

function ChannelCard({
  channel,
  isCompared,
  showMaxError,
  onToggleCompare,
}: {
  channel: Channel;
  isCompared: boolean;
  showMaxError: boolean;
  onToggleCompare: (id: string) => void;
}) {
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
      <span
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl pointer-events-none z-10"
        style={{
          backgroundColor: channel.color,
          boxShadow: selected ? `0 0 20px ${channel.color}` : "none",
          transition: "box-shadow 0.3s ease",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-16 pointer-events-none rounded-b-2xl z-0"
        style={{ background: "linear-gradient(to top, rgba(255,255,255,0.02), transparent)" }}
        aria-hidden
      />

      <div className="relative z-10 pl-4 pr-4 pt-4 pb-4">
        {selected ? (
          <span
            className="absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-full text-white"
            style={{ backgroundColor: channel.color }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        ) : channel.badge ? (
          <span
            className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-black tracking-wide border"
            style={{
              backgroundColor: channel.color + "18",
              borderColor: channel.color + "40",
              color: channel.color,
              boxShadow: `0 0 10px ${channel.color}55`,
            }}
          >
            {channel.badge}
          </span>
        ) : null}

        <div className="flex items-center gap-3.5">
          <img
            src={channel.image}
            alt={channel.name}
            className="h-11 w-11 shrink-0 rounded-full object-cover transition-all duration-200"
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
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {channel.subs} subscribers
            </div>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-2xl font-black text-emerald-400 tracking-tight leading-none">
              {channel.engagementRate}
            </span>
            <span className="text-[10px] text-muted-foreground/70 font-medium self-end mb-0.5">
              engagement
            </span>
          </div>
          <div className="w-px h-5 bg-white/10 shrink-0" />
          <div className="text-xs text-muted-foreground/60">
            <span className="font-semibold text-foreground/50">{channel.avgViews}</span> avg views
          </div>
        </div>

        <p
          className="mt-2 text-xs italic leading-relaxed overflow-hidden"
          style={{ color: "rgba(136,146,164,0.65)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" } as React.CSSProperties}
        >
          "{channel.audienceDesc}"
        </p>

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
              className="relative shrink-0 rounded-full grid place-items-center"
              style={{ minWidth: 44, minHeight: 44, backgroundColor: "transparent" }}
            >
              <span
                className="relative rounded-full"
                style={{
                  width: 44,
                  height: 24,
                  backgroundColor: pinned ? "#f59e0b" : "#2a2f45",
                  transition: "background-color 150ms ease",
                  display: "block",
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
              </span>
            </button>
          </div>
        </div>

        {pinError && (
          <p className="mt-1.5 text-xs" style={{ color: "#e53e3e" }}>
            Add this channel first to enable the Homepage Pin.
          </p>
        )}

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
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a2f45] bg-transparent px-3.5 h-11 md:h-9 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
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
                className="grid h-10 w-10 md:h-7 md:w-7 place-items-center rounded-md text-foreground hover:bg-white/10 transition"
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
                className="grid h-10 w-10 md:h-7 md:w-7 place-items-center rounded-md text-foreground hover:bg-white/10 transition"
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Compare toggle */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => onToggleCompare(channel.id)}
            className="inline-flex items-center gap-1.5 h-11 md:h-6 rounded-full border text-xs transition-all duration-150 select-none"
            style={{
              padding: "0 10px",
              borderColor: isCompared ? "#4a6cf7" : "#2a2f45",
              backgroundColor: isCompared ? "rgba(74,108,247,0.12)" : "transparent",
              color: isCompared ? "white" : "rgba(136,146,164,0.8)",
            }}
          >
            {isCompared && (
              <span style={{ color: "#4a6cf7", fontSize: 10, lineHeight: 1 }}>✓</span>
            )}
            Compare
          </button>
          {showMaxError && (
            <span className="text-[10px] text-amber-400">Max 3 — deselect one first</span>
          )}
        </div>
      </div>
    </article>
  );
}

function CompareDrawer({
  compareIds,
  onClose,
}: {
  compareIds: string[];
  onClose: () => void;
}) {
  const { cart, add } = useCart();
  const channels = compareIds.map((id) => CHANNELS.find((c) => c.id === id)!).filter(Boolean);
  const show = channels.length >= 2;

  useEffect(() => {
    if (!show) return;
  }, [show]);

  if (!show) return null;

  const channelRows = (
    <div className="flex flex-col md:flex-row h-full divide-y divide-[#1e2535] md:divide-y-0 md:divide-x md:divide-[#1e2535]" style={{ minWidth: 0 }}>
      {channels.map((ch) => {
        const inCart = (cart[ch.id] ?? 0) > 0;
        return (
          <div key={ch.id} className="flex-1 min-w-0 md:min-w-[220px] px-5 py-4 flex flex-col gap-2 overflow-hidden">
            <div className="flex items-center gap-2.5">
              <img
                src={ch.image}
                alt={ch.name}
                className="h-8 w-8 rounded-full object-cover shrink-0"
                style={{ border: `2px solid ${ch.color}55` }}
              />
              <span className="font-bold text-sm truncate" style={{ color: ch.color }}>{ch.name}</span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              {([
                { label: "Subscribers", value: ch.subs, cls: "" },
                { label: "Avg Views", value: ch.avgViews, cls: "" },
                { label: "Engagement", value: ch.engagementRate, cls: "text-emerald-400" },
                { label: "Price", value: `$${ch.price}/video`, cls: "" },
              ] as { label: string; value: string; cls: string }[]).map(({ label, value, cls }) => (
                <div key={label} className="flex items-center gap-2" style={{ minHeight: 18 }}>
                  <span className="text-muted-foreground shrink-0" style={{ width: 72 }}>{label}</span>
                  <span className={`font-semibold text-foreground ${cls}`}>{value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] italic leading-relaxed overflow-hidden" style={{ color: "rgba(136,146,164,0.6)" }}>
              "{ch.audienceDesc}"
            </p>
            <button
              onClick={() => !inCart && add(ch.id)}
              className={`mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg h-11 md:h-8 text-xs font-semibold transition-colors ${
                inCart
                  ? "border border-emerald-500/30 text-emerald-400 cursor-default"
                  : "border border-[#2a2f45] hover:border-primary hover:text-primary text-foreground"
              }`}
            >
              {inCart ? (
                <><Check className="h-3 w-3" /> In campaign</>
              ) : (
                <><Plus className="h-3 w-3" /> Add to Campaign</>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile: full-screen modal */}
      <div
        className="md:hidden fixed inset-0 z-50 flex flex-col"
        style={{ backgroundColor: "#0f1319" }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-[#1e2535] shrink-0"
          style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
        >
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Comparing {channels.length} channel{channels.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition"
            aria-label="Close compare"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {channelRows}
        </div>
      </div>

      {/* Desktop: bottom drawer */}
      <div
        className="hidden md:flex fixed bottom-0 left-0 right-0 z-50 flex-col"
        style={{ height: "280px", backgroundColor: "#0f1319", borderTop: "1px solid #1e2535" }}
      >
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#1e2535] shrink-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Comparing {channels.length} channel{channels.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full divide-x divide-[#1e2535]" style={{ minWidth: channels.length * 240 }}>
            {channels.map((ch) => {
              const inCart = (cart[ch.id] ?? 0) > 0;
              return (
                <div key={ch.id} className="flex-1 min-w-[220px] px-5 py-4 flex flex-col gap-2 overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <img src={ch.image} alt={ch.name} className="h-8 w-8 rounded-full object-cover shrink-0" style={{ border: `2px solid ${ch.color}55` }} />
                    <span className="font-bold text-sm truncate" style={{ color: ch.color }}>{ch.name}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs">
                    {([
                      { label: "Subscribers", value: ch.subs, cls: "" },
                      { label: "Avg Views", value: ch.avgViews, cls: "" },
                      { label: "Engagement", value: ch.engagementRate, cls: "text-emerald-400" },
                      { label: "Price", value: `$${ch.price}/video`, cls: "" },
                    ] as { label: string; value: string; cls: string }[]).map(({ label, value, cls }) => (
                      <div key={label} className="flex items-center gap-2" style={{ minHeight: 18 }}>
                        <span className="text-muted-foreground shrink-0" style={{ width: 72 }}>{label}</span>
                        <span className={`font-semibold text-foreground ${cls}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] italic leading-relaxed" style={{ color: "rgba(136,146,164,0.6)", minHeight: 40 }}>"{ch.audienceDesc}"</p>
                  <button
                    onClick={() => !inCart && add(ch.id)}
                    className={`mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg h-8 text-xs font-semibold transition-colors ${
                      inCart ? "border border-emerald-500/30 text-emerald-400 cursor-default" : "border border-[#2a2f45] hover:border-primary hover:text-primary text-foreground"
                    }`}
                  >
                    {inCart ? <><Check className="h-3 w-3" /> In campaign</> : <><Plus className="h-3 w-3" /> Add to Campaign</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
