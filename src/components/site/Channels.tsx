import { Check, ExternalLink, Minus, Plus, Users } from "lucide-react";
import { CHANNELS, useCart, type Channel } from "@/lib/cart";

export function Channels() {
  // Pull DefiDaily out so we can render it as a featured wider card
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
  const { cart, add, remove, setQty } = useCart();
  const qty = cart[channel.id] ?? 0;
  const selected = qty > 0;

  return (
    <article
      className={`group relative rounded-2xl border p-5 transition-all duration-200 ${
        selected
          ? "card-selected"
          : "bg-[#0f1319] border-[#1e2535] card-hover-ring"
      } ${className}`}
    >
      {bestValue && !selected && (
        <span className="absolute top-4 right-4 rounded-full bg-primary/15 text-primary border border-primary/30 px-2.5 py-1 text-[10px] font-black tracking-widest">
          BEST VALUE
        </span>
      )}
      {selected && (
        <span className="absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
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

      <div className="mt-5 pt-5 border-t border-[#1e2535] flex items-center justify-between">
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
          <div className="flex items-center gap-1 rounded-lg border border-primary bg-primary/10 p-1">
            <button
              onClick={() => remove(channel.id)}
              className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-primary/20 transition"
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
              className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-primary/20 transition"
              aria-label="Increase"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
