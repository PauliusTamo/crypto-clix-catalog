import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-blob" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
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
