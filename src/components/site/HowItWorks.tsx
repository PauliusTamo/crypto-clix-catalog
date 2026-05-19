const STEPS = [
  { icon: "🎯", title: "Pick Your Channels", desc: "Browse and add the channels that fit your project" },
  { icon: "📦", title: "Build Your Bundle", desc: "Discounts unlock automatically as you add more" },
  { icon: "📩", title: "Send Your Brief", desc: "We generate your order summary, you send it on Telegram" },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 border-t border-border">
      <div className="label-eyebrow mb-10 text-center">How It Works</div>
      <div className="grid gap-10 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-start gap-4">
            <div className="text-3xl">{s.icon}</div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  0{i + 1}
                </span>
                <h3 className="font-bold text-lg">{s.title}</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
