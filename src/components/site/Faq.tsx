import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  { q: "How does the ordering process work?", a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Select your channels, review the auto-generated brief, and send it to us via Telegram for confirmation." },
  { q: "What is included in a dedicated video?", a: "Lorem ipsum dolor sit amet. A full-length custom video covering your project, hosted on the channel's main feed, with title, description, and pinned-comment placement." },
  { q: "How long until my campaign goes live?", a: "Lorem ipsum dolor sit amet. Most campaigns go live within 5–10 business days from confirmation, depending on channel availability." },
  { q: "Can I pick specific channels for my niche?", a: "Lorem ipsum dolor sit amet. Yes — all 7 channels are crypto-native, and you choose exactly which ones run your campaign." },
  { q: "Do you offer guarantees or performance metrics?", a: "Lorem ipsum dolor sit amet. We provide a post-campaign report with views, engagement metrics, and audience insights for every channel." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="label-eyebrow mb-3 text-center">FAQ</div>
      <h2 className="font-black tracking-tighter text-4xl md:text-5xl text-center mb-12">
        Questions, answered.
      </h2>
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold">{f.q}</span>
                {isOpen ? (
                  <Minus className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
