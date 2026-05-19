import { ArrowDown } from "lucide-react";

const FLOATING_CARDS = [
  { initials: "CV", name: "CryptoVault", subs: "85K subs", price: "$500", color: "#4a6cf7", rotate: "-6deg", top: "8%", right: "2%", scale: 1, blur: false },
  { initials: "BT", name: "BlockTalk", subs: "62K subs", price: "$450", color: "#e53e3e", rotate: "5deg", top: "35%", right: "18%", scale: 0.88, blur: true },
  { initials: "W3", name: "Web3Wire", subs: "47K subs", price: "$400", color: "#10b981", rotate: "-3deg", top: "60%", right: "4%", scale: 0.95, blur: false },
  { initials: "AS", name: "AltSignals", subs: "29K subs", price: "$350", color: "#8b5cf6", rotate: "7deg", top: "20%", right: "36%", scale: 0.78, blur: true },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-blob" aria-hidden />

      {/* Top page gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0"
        style={{ height: 200, background: "linear-gradient(180deg, #0d1117 0%, #0a0d14 100%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-8 items-center">
        {/* Left content */}
        <div>
          <h1
            className="font-black tracking-tighter leading-[0.92] max-w-5xl"
            style={{ fontSize: "clamp(48px, 7vw, 104px)" }}
          >
            <span className="block text-foreground">SELECT YOUR CHANNELS,</span>
            <span className="block italic font-black text-destructive mt-1 red-glow">
              BUILD YOUR CAMPAIGN.
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-muted-foreground text-lg leading-relaxed">
            Pick from our crypto-native YouTube channels, bundle them for automatic
            discounts, and reach thousands of real investors.
          </p>

          <div className="mt-12 flex items-stretch gap-6 md:gap-10">
            <Stat value="7" label="Active Channels" />
            <Divider />
            <Stat value="2M+" label="Total Subscribers" />
            <Divider />
            <Stat value="100+" label="Campaigns Delivered" />
          </div>

          <a
            href="#channels"
            className="mt-14 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowDown className="h-3.5 w-3.5 scroll-arrow" />
            Browse channels
          </a>
        </div>

        {/* Right side — floating channel cards */}
        <div className="relative hidden md:block h-[420px]" aria-hidden>
          {/* Grid mesh pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,1) 100%)",
              maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,1) 100%)",
            }}
          />

          {FLOATING_CARDS.map((card) => (
            <div
              key={card.name}
              className="absolute rounded-xl border border-white/10 bg-[#0f1319]/90 px-4 py-3 backdrop-blur-sm"
              style={{
                top: card.top,
                right: card.right,
                transform: `rotate(${card.rotate}) scale(${card.scale})`,
                filter: card.blur ? "blur(1px)" : "none",
                width: 200,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-black text-white"
                  style={{ backgroundColor: card.color }}
                >
                  {card.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{card.name}</div>
                  <div className="text-xs text-white/50">{card.subs}</div>
                </div>
              </div>
              <div
                className="mt-2.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-black text-white"
                style={{ backgroundColor: card.color + "33", color: card.color, border: `1px solid ${card.color}55` }}
              >
                {card.price}/video
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-black text-foreground text-3xl md:text-4xl tracking-tighter">
        {value}
      </span>
      <span className="mt-1 text-xs md:text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

function Divider() {
  return <span className="w-px self-stretch bg-[#2a2f45]" />;
}
