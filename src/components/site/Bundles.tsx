const BUNDLES = [
  { name: "Starter", channels: "3 channels", channelCount: 3, price: 1200, featured: false },
  { name: "Growth", channels: "5 channels", channelCount: 5, price: 1900, featured: false },
  { name: "Pro", channels: "7 channels", channelCount: 7, price: 2500, featured: true },
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
      <path
        d="M6 10.5l2.6 2.6L14 7.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Bundles() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-12 max-w-2xl">
        <div className="label-eyebrow mb-3">Pricing</div>
        <h2 className="font-black tracking-tighter text-5xl md:text-6xl leading-[0.95]">
          BUNDLE
          <br />
          PRICING.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3 items-end">
        {BUNDLES.map((b) => {
          const per = Math.round(b.price / b.channelCount);
          return (
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
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                  aria-hidden
                />
              )}
              <div className="label-eyebrow">{b.name}</div>
              <div className="mt-2 text-muted-foreground">{b.channels}</div>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-black text-5xl tracking-tighter">
                  ${b.price.toLocaleString()}
                </span>
              </div>
              <div className="mt-1.5 text-xs text-muted-foreground">
                ~${per}/channel
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
          );
        })}
      </div>
    </section>
  );
}
