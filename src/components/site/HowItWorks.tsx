const STEPS = [
  { title: "Pick Your Channels", desc: "Browse and add the channels that fit your project" },
  { title: "Build Your Bundle", desc: "Discounts unlock automatically as you add more" },
  { title: "Send Your Brief", desc: "We generate your order summary, you send it on Telegram" },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="label-eyebrow mb-10">How It Works</div>

      <div className="relative grid gap-12 md:gap-6 md:grid-cols-3">
        {/* Connecting dashed line */}
        <div
          className="hidden md:block absolute top-[3.5rem] left-[10%] right-[10%] border-t border-dashed border-[#2a2f45] pointer-events-none"
          aria-hidden
        />
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative pt-6 md:pt-0">
            <span
              className="pointer-events-none select-none absolute -top-6 left-0 font-black leading-none text-foreground"
              style={{ fontSize: "8rem", opacity: 0.06 }}
              aria-hidden
            >
              0{i + 1}
            </span>
            <div className="relative pt-20 md:pt-24 md:pl-2">
              <h3 className="font-black text-2xl tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
