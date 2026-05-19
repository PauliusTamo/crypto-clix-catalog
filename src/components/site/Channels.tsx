import { Check, ExternalLink, Minus, Plus, Users } from "lucide-react";
import { CHANNELS, HOMEPAGE_PIN_PRICE, useCart, type Channel } from "@/lib/cart";

export function Channels() {
  const main = CHANNELS.filter((c) => c.id !== "defidaily");
  const featured = CHANNELS.find((c) => c.id === "defidaily");

  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-28">
      <div className="label-eyebrow mb-4">Available Channels</div>
      <div className="sticky top-12 z-30 -mx-2 mb-8">
        <div className="mx-2 rounded-xl border border-border bg-surface/85 backdrop-blur-xl px-4 py-3 text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">💰 Bundle discount</span>{" "}
          unlocks automatically as you add more channels.
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {main.map((c) => (
          <ChannelCard key={c.id} channel={c} />
        ))}
        {featured && (
          <ChannelCard channel={featured} className="md:col-span-2" bestValue />
        )}
      </div>
    </section>
  );
}

function ChannelCard({
  channel,
  className = "",
  bestValue = false,
}: {
  channel: Channel;
  className?: string;
  bestValue?: boolean;
}) {
  const { cart, pins, add, remove, setQty, togglePin } = useCart();
  const qty = cart[channel.id] ?? 0;
  const selected = qty > 0;
  const pinned = pins[channel.id] ?? false;

  return (
    <article
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-200 ${
        selected
          ? "card-selected"
          : "bg-[#0f1319] border-[#1e2535] card-hover-ring"
      } ${className}`}
      style={{
        transform: selected ? "translateY(0)" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!selected) (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Left accent bar */}
      <span
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl pointer-events-none z-10"
        style={{
          backgroundColor: channel.color,
          boxShadow: selected ? `0 0 12px ${channel.color}` : "none",
          transition: "box-shadow 0.2s ease",
        }}
        aria-hidden
      />

      <div className="pl-4 pr-5 pt-5 pb-5">
        {bestValue && !selected && (
          <span className="absolute top-4 right-4 rounded-full bg-primary/15 text-primary border border-primary/30 px-2.5 py-1 text-[10px] font-black tracking-widest">
            BEST VALUE
          </span>
        )}
        {selected && (
          <span
            className="absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-full text-white"
            style={{ backgroundColor: channel.color }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}

        <div className="flex items-center gap-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-black text-base text-white"
            style={{ backgroundColor: channel.color }}
            aria-hidden
          >
            {channel.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-foreground truncate">{channel.name}</h3>
              <a
                href={channel.link}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={`Open ${channel.name}`}
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

        {/* Content type tag */}
        <div className="mt-3">
          <span className="inline-block rounded-full bg-[#1e2535] text-[#8892a4] px-2.5 py-0.5 text-[11px] font-medium">
            {channel.contentType}
          </span>
        </div>

        {/* Homepage Pin toggle */}
        <div
          className={`mt-4 flex items-center justify-between transition-all duration-200 ${
            pinned ? "rounded-lg border px-3 py-2" : ""
          }`}
          style={pinned ? { borderColor: "#f59e0b55", backgroundColor: "#f59e0b08" } : {}}
        >
          <span className="text-xs text-muted-foreground">📌 Homepage Pin — 30 days</span>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium transition-all"
              style={{ color: pinned ? "#f59e0b" : undefined, fontWeight: pinned ? 700 : 400 }}
            >
              +${HOMEPAGE_PIN_PRICE}
            </span>
            <button
              role="switch"
              aria-checked={pinned}
              onClick={() => togglePin(channel.id)}
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                pinned ? "bg-amber-500" : "bg-[#2a2f45] border border-[#3a4055]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                  pinned ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#1e2535] flex items-center justify-between">
          <div className="font-black text-2xl text-foreground">
            ${channel.price}
          </div>

          {!selected ? (
            <button
              onClick={() => add(channel.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a2f45] bg-transparent px-3.5 h-9 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: channel.color, backgroundColor: channel.color + "1a" }}>
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
