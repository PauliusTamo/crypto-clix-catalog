export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
      <h1 className="font-black tracking-tighter text-5xl md:text-7xl leading-[0.95] max-w-4xl">
        <span className="block text-foreground">SELECT YOUR CHANNELS,</span>
        <span className="block italic font-black text-destructive mt-2">
          BUILD YOUR CAMPAIGN.
        </span>
      </h1>
      <p className="mt-7 max-w-xl text-muted-foreground text-lg leading-relaxed">
        Pick from our crypto-native YouTube channels, bundle them for automatic
        discounts, and reach thousands of real investors.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
        <Stat value="7" label="Active Channels" />
        <Dot />
        <Stat value="2M+" label="Total Subscribers" />
        <Dot />
        <Stat value="100+" label="Campaigns Delivered" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-black text-foreground text-xl">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-border-strong" />;
}
