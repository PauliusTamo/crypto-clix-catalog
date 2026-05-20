const ITEMS = [
  "🚀 DeltaSwap · 340K views across 3 channels",
  "📈 ArcadeToken · 18% engagement rate on dedicated video",
  "🔥 NovaDEX · Sold out presale within 48hrs of campaign",
  "💎 ChainVault · 2.1M impressions · 5 channel campaign",
  "⚡ StratumFi · 127K views · first campaign",
  "🎯 OrbitalDAO · 94% audience retention on review video",
];

export function CaseTicker() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "#080b10",
        borderTop: "1px solid #1e2535",
        borderBottom: "1px solid #1e2535",
        height: 36,
      }}
    >
      <div className="ticker-track flex items-center h-full" style={{ width: "max-content" }}>
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-xs font-medium whitespace-nowrap px-6"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {item}
            <span className="ml-6 mr-0" style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
