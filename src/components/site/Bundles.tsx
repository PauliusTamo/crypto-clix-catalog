const BUNDLES = [
  { name: "Starter", channels: "3 channels", channelCount: 3, originalPrice: 1000, price: 900,  savings: 100, reach: "300K+", featured: false },
  { name: "Growth",  channels: "5 channels", channelCount: 5, originalPrice: 1700, price: 1400, savings: 300, reach: "550K+", featured: false },
  { name: "Pro",     channels: "7 channels", channelCount: 7, originalPrice: 2500, price: 1850, savings: 650, reach: "900K+", featured: true  },
];

const INCLUDED = [
  "Dedicated video per channel",
  "Channel's full audience reach",
  "Detailed campaign report",
];

function CircleCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 10.5l2.6 2.6L14 7.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Bundles() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      {/* Section break — blue radial glow */}
      <div className="relative mb-10 h-10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(74,108,247,0.06) 0%, transparent 100%)",
            filter: "blur(30px)",
          }}
          aria-hidden
        />
      </div>

      <div className="mb-6 max-w-2xl">
        <div className="label-eyebrow mb-3">Pricing</div>
        <h2 className="font-black tracking-tighter text-5xl md:text-6xl leading-[0.95]">
          BUNDLE<br />PRICING.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3 items-end">
        {BUNDLES.map((b) => (
          <div
            key={b.name}
            className={`relative overflow-hidden rounded-2xl bg-card transition ${
              b.featured
                ? "border-2 border-[#2a3568] p-9 md:scale-[1.04] md:-translate-y-1"
                : "border border-border p-7"
            }`}
          >
            {b.featured && (
              <span
                className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
                style={{ background: "linear-gradient(180deg, #4a6cf7, #7c3aed)" }}
                aria-hidden
              />
            )}
            <div className="label-eyebrow">{b.name}</div>
            <div className="mt-2 text-muted-foreground">{b.channels}</div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-black text-5xl tracking-tighter">${b.price.toLocaleString()}</span>
              <span className="text-muted-foreground line-through text-lg">${b.originalPrice.toLocaleString()}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xs text-emerald-500 font-bold">Save ${b.savings}</span>
              <span className="text-xs text-muted-foreground">· {b.reach} reach</span>
            </div>
            <ul className="mt-7 space-y-3">
              {INCLUDED.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-foreground/90">{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground italic">
        All bundles include full script control, review before publishing, and a post-campaign performance report.
      </p>
    </section>
  );
}
